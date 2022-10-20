import src.broadcast.channel as broadcast_channel
import machine
import micropython
import time

conversion_factor = micropython.const(3.3 / 65535)

def main(channel: broadcast_channel.BroadcastChannel):
    temperature_adc = machine.ADC(4)
    # v_sys_adc = machine.ADC(machine.Pin(29, machine.Pin.IN))

    while True:
        time.sleep_ms(10000)

        # GPIO25
        # v_sys = v_sys_adc.read_u16() * conversion_factor * 3

        temperature_reading = temperature_adc.read_u16() * conversion_factor
        temperature = 27 - (temperature_reading - 0.706) / 0.001721

        message = {
            "event": "system",
            "data": {
                "time": time.time(),
                "temperature": temperature
            }
        }

        print(message)
        # micropython.mem_info()
        channel.broadcast(message)