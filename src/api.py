import src.broadcast.channel as broadcast_channel
import machine

solenoid_pin = machine.Pin(22, mode = machine.Pin.OUT)
solenoid_pin.init()

def solenoid(channel: broadcast_channel.BroadcastChannel, closed: bool) :
    solenoid_pin.value(closed)

    channel.broadcast({
        "event": "solenoid",
        "data": {
            "closed": solenoid_pin.value(),
        }
    })