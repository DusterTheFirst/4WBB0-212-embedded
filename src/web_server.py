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

    if method == "GET":
        if url == "/api/health":
            writer.write(http_response("text/plain"))
            writer.write("OK")
        elif url == "/api/events":
            writer.write(http_response("text/event-stream"))
            await writer.drain()
            await events.handle_events(writer, channel.create_receiver())
        elif url == "/api/toggle_solenoid":
            writer.write(http_response("text/plain"))
            writer.write("OK")
            api.toggle_solenoid(channel)
        else:
            writer.write(http_response("text/plain", status=(404, "Not Found")))
            writer.write("Not Found")
    else:
        writer.write(http_response("text/plain", status=(405, "Method Not Allowed")))
        writer.write("Method Not Allowed")

    await writer.drain()
    await writer.wait_closed()
    print(reader.get_extra_info("peername"), method, url, "Client disconnected")

def http_response(content_type: str, status: tuple[int, str] = (200, "OK")):
    headers = [
        ("Content-Type", content_type),
        ("Access-Control-Allow-Origin", "*")
    ]

    headers = "\r\n".join(map(lambda header: f"{header[0]}: {header[1]}", headers))

    return f"HTTP/1.0 {status[0]} {status[1]}\r\n{headers}\r\n\r\n"
