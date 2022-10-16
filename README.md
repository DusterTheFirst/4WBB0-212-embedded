# 4WBB0 Group 212 embedded component

## Developing

-   `just`
-   `mpremote`
-   `mpy-cross`

run `just help` for an overview of the available build commands.

## Endpoints

### Event Source

-   GET `/api/events` -> `text/event-stream` (See `types.d.ts`)

### REST

-   GET `/api/health` -> `"OK"`
-   GET `/api/toggle_test` -> `"OK"`
