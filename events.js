const event_template = /** @type {HTMLTemplateElement} */ (
    document.getElementById("event-template")
);

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
 *
 * @returns {HTMLTableRowElement}
 */
function create_event_row(event, data) {
    const event_row = /** @type {HTMLTableRowElement} */ (
        event_template.content.firstElementChild.cloneNode(true)
    );

    /** @type {HTMLSlotElement} */
    const timestamp_element = event_row.querySelector("slot[name=timestamp]");
    timestamp_element.innerText = new Date().toLocaleString();

    /** @type {HTMLSlotElement} */
    const event_element = event_row.querySelector("slot[name=event]");
    event_element.innerText = event;

    /** @type {HTMLSlotElement} */
    const data_element = event_row.querySelector("slot[name=data]");
    data_element.innerText = JSON.stringify(data);

    return event_row;
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
    event_source.addEventListener("test", (event) =>
        test_handler(event_source, event)
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

    new_events.appendChild(create_event_row("system", data));
}

/**
 * @param {MessageEvent<string>} event
 * @param {EventSource} event_source
 */
function test_handler(event_source, event) {
    /** @type {EventData<"test">} */
    const data = JSON.parse(event.data);

    console.info("test", data);

    const button = /** @type {HTMLButtonElement} */ (
        document.getElementById("toggle_test")
    );

    button.disabled = false;

    if (data.enabled) {
        button.innerText = "Disable Test";
    } else {
        button.innerText = "Enable Test";
    }

    new_events.appendChild(create_event_row("test", data));
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
