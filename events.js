const new_events = /** @type {HTMLTableSectionElement} */ (
    document.getElementById("new-events")
);
const connection_state = /** @type {HTMLSlotElement} */ (
    document.getElementById("connection_state")
);

/**
 * @template {keyof EventTypes} E
 * @param {E} event
 * @param {EventData<E>} data
 */
function create_event_row(event, data) {
    const event_row = new_events.insertRow(0);

    const timestamp_element = event_row.insertCell(0);
    timestamp_element.innerText = new Date().toLocaleString();

    const event_element = event_row.insertCell(1);
    event_element.innerText = event;

    const data_element = event_row.insertCell(2);
    data_element.innerText = JSON.stringify(data);
}

/** @type {EventSource} */
var event_source;
export function establish_connection() {
    const url = "http://192.168.4.1:80/api/events";

    if (event_source !== undefined) {
        event_source.close();
    }
    event_source = new EventSource(url);
    console.info("Created event source");

    event_source.addEventListener("error", (event) =>
        error_handler(event_source, event)
    );
    event_source.addEventListener("open", (event) =>
        open_handler(event_source, event)
    );
    event_source.addEventListener("message", (event) =>
        message_handler(event_source, event)
    );
    event_source.addEventListener("system", (event) =>
        system_handler(event_source, event)
    );
    event_source.addEventListener("solenoid", (event) =>
        solenoid_handler(event_source, event)
    );
    event_source.addEventListener("flow", (event) =>
        flow_handler(event_source, event)
    );
}

/**
 * @param {Event} event
 * @param {EventSource} event_source
 */
function error_handler(event_source, event) {
    console.error(
        "ERROR",
        ready_state(event_source.readyState),
        event.timeStamp
    );
    connection_state.innerText = "Disconnected";
    connection_state.style.color = "red";

    event_source.close();
    console.warn("Waiting");
    setTimeout(() => {
        console.info("Reconnecting");
        establish_connection();
    }, 1000);
}

/**
 * @param {Event} event
 * @param {EventSource} event_source
 */
function open_handler(event_source, event) {
    connection_state.innerText = "Connected";
    connection_state.style.color = "green";
    console.info("OPEN", ready_state(event_source.readyState), event.timeStamp);
}

/**
 * @param {MessageEvent<string>} event
 * @param {EventSource} event_source
 */
function message_handler(event_source, event) {
    console.warn("untagged message", event.data);
}

/**
 * @param {MessageEvent<string>} event
 * @param {EventSource} event_source
 */
function system_handler(event_source, event) {
    /** @type {EventData<"system">} */
    const data = JSON.parse(event.data);

    console.info("system", data);

    create_event_row("system", data);
}

/**
 * @param {MessageEvent<string>} event
 * @param {EventSource} event_source
 */
function solenoid_handler(event_source, event) {
    /** @type {EventData<"solenoid">} */
    const data = JSON.parse(event.data);

    console.info("solenoid", data);

    const button = /** @type {HTMLButtonElement} */ (
        document.getElementById("toggle_solenoid")
    );

    button.disabled = false;

    if (data.closed) {
        button.innerText = "Open Solenoid";
    } else {
        button.innerText = "Close Solenoid";
    }

    create_event_row("solenoid", data);
}

/**
 * @param {MessageEvent<string>} event
 * @param {EventSource} event_source
 */
 function flow_handler(event_source, event) {
    /** @type {EventData<"flow">} */
    const data = JSON.parse(event.data);

    console.info("flow", data);

    create_event_row("flow", data);
}

/**
 * @param {number} state
 * @returns string representation of the given ready state
 */
function ready_state(state) {
    switch (state) {
        case EventSource.CLOSED:
            return "CLOSED";
        case EventSource.CONNECTING:
            return "CONNECTING";
        case EventSource.OPEN:
            return "OPEN";
    }
}
