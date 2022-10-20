declare type EventData<K extends keyof EventTypes> = EventTypes[K];

declare interface EventTypes {
    system: {
        /** RP2040 temperature */
        temperature: number;
        /** Timestamp */
        time: number;
    };
    solenoid: {
        closed: boolean;
    };
    flow: {
        // Change in flow (litres) since last update
        delta: number;
        // Total water flow (litres) since device power on
        total: number;
    };
}
