import machine
import src.broadcast.channel as broadcast_channel
import src.access_point as access_point
import src.web_server as web_server
import uasyncio as asyncio
import micropython

onboard = machine.Pin("LED", machine.Pin.OUT)

g_flow_cycles = 0
total_litres = 0

def flow(pin):
    global g_flow_cycles
    g_flow_cycles += 1

async def main(channel: broadcast_channel.BroadcastChannel):
    print('Setting up Access Point...')
    access_point.AccessPoint().setup()

    print('Setting up web server...')
    asyncio.create_task(asyncio.start_server(lambda reader, writer: web_server.serve_client(reader, writer, channel), "0.0.0.0", 80))

    flow_sensor = machine.Pin(17, mode=machine.Pin.IN, pull=machine.Pin.PULL_DOWN)
    flow_sensor.init()
    flow_sensor.irq(flow, machine.Pin.IRQ_FALLING, hard=True)
    
    while True:
        onboard.on()
        await asyncio.sleep(.5)
        onboard.off()
        await asyncio.sleep(1)

        global g_flow_cycles
        flow_cycles = g_flow_cycles
        g_flow_cycles = 0

        if flow_cycles == 0:
            freq = 0
        else:
            freq = flow_cycles / .100

        litres_per_minute = freq / 6.6
        litres = litres_per_minute * micropython.const(1 / (60 * 10))

        global total_litres
        total_litres += litres

        print(litres, total_litres)