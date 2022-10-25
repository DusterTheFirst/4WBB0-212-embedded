# H2knOw Firmware

## Developing

Tools needed:

-   [`just`](https://github.com/casey/just#installation)
-   [`mpremote`](https://pypi.org/project/mpremote/)
-   [`mpy-cross`](https://pypi.org/project/mpy-cross/)

run `just help` for an overview of the available build commands.

## Endpoints

### Event Source

-   GET `/api/events` -> `text/event-stream` (See `types.d.ts`)

### REST

-   GET `/api/health` -> `"OK"`
-   GET `/api/solenoid/open` -> `"OK"`
-   GET `/api/solenoid/close` -> `"OK"`
