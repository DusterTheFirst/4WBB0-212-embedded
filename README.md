# 4WBB0 Group 212 embedded component

## Developing

-   `just`
-   `mpremote`
-   `mpy-cross`

run `just help` for an overview of the available build commands.

## Endpoints

### Event Source

-   GET `/api/events` -> `text/event-stream`

    -   Event `system`

        ```ts
        interface SystemStats {
            /** RP2040 temperature */
            temperature: number;
            /** Timestamp */
            time: number;
        }
        ```

### REST

-   GET `/api/health` -> `"OK"`
