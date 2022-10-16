declare type EventData<K extends keyof EventTypes> = EventTypes[K];

declare interface EventTypes {
    system: {
        /** RP2040 temperature */
        temperature: number;
        /** Timestamp */
        time: number;
    };
    test: {
        enabled: boolean;
    };
}
