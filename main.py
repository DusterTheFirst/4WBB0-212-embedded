import src.broadcast.channel as broadcast_channel
import src.core0 as core0
import src.core1 as core1
import uasyncio as asyncio
import _thread as thread
import micropython

micropython.alloc_emergency_exception_buf(100)

channel = broadcast_channel.BroadcastChannel()

thread.start_new_thread(core1.main, (channel,))

loop: asyncio.Loop = asyncio.new_event_loop()
asyncio.run(core0.main(channel))