window.addEventListener("DOMContentLoaded", () => {
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
        const event_row =
            event_template.content.firstElementChild.cloneNode(true);

        /** @type {HTMLSlotElement} */
        const timestamp_element = event_row.querySelector(
            "slot[name=timestamp]"
        );
        timestamp_element.innerText = new Date().toLocaleString();

        /** @type {HTMLSlotElement} */
        const event_element = event_row.querySelector("slot[name=event]");
        event_element.innerText = event;

        /** @type {HTMLSlotElement} */
        const data_element = event_row.querySelector("slot[name=data]");
        data_element.innerText = data;

        return event_row;
    }

    const event_source = new EventSource("http://192.168.4.1:80/api/events");
    event_source.addEventListener("error", console.error);
    event_source.addEventListener("open", console.info);
    event_source.addEventListener("error", console.error);

    new_events.appendChild(create_event_row("test", "test"));
});
