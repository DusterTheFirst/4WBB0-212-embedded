import src.api as api
import src.broadcast.channel as broadcast_channel
import src.events as events
import uasyncio as asyncio


async def serve_client(reader: asyncio.StreamReader, writer: asyncio.StreamWriter, channel: broadcast_channel.BroadcastChannel) -> None:
    print(reader.get_extra_info("peername"), "Client connected")

    request_line: bytes = await reader.readline()
    request: str = request_line.decode("utf-8").strip()

    # We are not interested in HTTP request headers, skip them
    while await reader.readline() != b"\r\n":
        pass

    [method, url, http] = request.split(" ", 3)
    print(reader.get_extra_info("peername"), "method", method)
    print(reader.get_extra_info("peername"), "url", url)
    print(reader.get_extra_info("peername"), "http", http)

    if method == "GET" or method == "OPTIONS":
        if url == "/api/health":
            writer.write(http_response("text/plain"))
            if method == "GET":
                writer.write("OK")
        elif url == "/api/events":
            writer.write(http_response("text/event-stream"))
            if method == "GET":
                await writer.drain()
                await events.handle_events(writer, channel.create_receiver())
        elif url == "/api/solenoid/open":
            writer.write(http_response("text/plain"))
            if method == "GET":
                writer.write("OK")
                api.solenoid(channel, False)
        elif url == "/api/solenoid/close":
            writer.write(http_response("text/plain"))
            if method == "GET":
                writer.write("OK")
                api.solenoid(channel, True)
        else:
            writer.write(http_response("text/plain", status=(404, "Not Found")))
            if method == "GET":
                writer.write("Not Found")
    else:
        writer.write(http_response("text/plain", status=(405, "Method Not Allowed")))
        writer.write("Method Not Allowed")

    await writer.drain()
    await writer.wait_closed()
    print(reader.get_extra_info("peername"), method, url, "Client disconnected")

def http_response(content_type: str | None, status: tuple[int, str] = (200, "OK")):
    headers = [
        ("Content-Type", content_type),
        ("Access-Control-Allow-Origin", "*"),
        ("Access-Control-Allow-Headers", "*"),
    ]

    headers_str = "\r\n".join(map(lambda header: f"{header[0]}: {header[1]}", headers))

    return f"HTTP/1.0 {status[0]} {status[1]}\r\n{headers_str}\r\n\r\n"
