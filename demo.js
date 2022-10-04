/** @type {HTMLTemplateElement} */
const event_template = document.getElementById("event-template");

const new_events = document.getElementById("new-events");

/**
 * @param {string} event
 * @param {string} data
 *
 * @returns {HTMLTableRowElement}
 */
function create_event_row(event, data) {
    /** @type {HTMLTableRowElement} */
    const event_row = event_template.content.firstElementChild.cloneNode(true);

    /** @type {HTMLSlotElement} */
    const timestamp_element = event_row.querySelector("slot[name=timestamp]");
    timestamp_element.innerText = new Date().toLocaleString();

    /** @type {HTMLSlotElement} */
    const event_element = event_row.querySelector("slot[name=event]");
    event_element.innerText = event;

    /** @type {HTMLSlotElement} */
    const data_element = event_row.querySelector("slot[name=data]");
    data_element.innerText = data;

    return event_row;
}

create_event_source();

function create_event_source() {
    const url = "http://192.168.4.1:80/api/events";

    const event_source = new EventSource(url);
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

    return event_source;
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
    event_source.close();
    console.warn("Waiting");
    setTimeout(() => {
        console.info("Reconnecting");
        create_event_source();
    }, 1);
}

/**
 * @param {Event} event
 * @param {EventSource} event_source
 */
function open_handler(event_source, event) {
    console.info("OPEN", ready_state(event_source.readyState), event.timeStamp);
}

/**
 * @param {MessageEvent<any>} event
 * @param {EventSource} event_source
 */
function message_handler(event_source, event) {
    console.warn("untagged message", event.data);
}

/**
 * @param {MessageEvent<>} event
 * @param {EventSource} event_source
 */
function system_handler(event_source, event) {
    const data = JSON.parse(event.data);

    console.info("system", data);

    new_events.appendChild(create_event_row("system", JSON.stringify(data)));
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
