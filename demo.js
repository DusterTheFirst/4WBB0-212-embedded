import { establish_connection } from "./events.js";

document.getElementById("reconnect").addEventListener("click", () => {
    establish_connection();
});

const button = /** @type {HTMLButtonElement}*/ (
    document.getElementById("toggle_solenoid")
);
button.addEventListener("click", async () => {
    button.disabled = true;

    let response = await fetch("http://192.168.4.1:80/api/toggle_solenoid");

    if (response.ok) {
        console.log("toggle_solenoid success");
    } else {
        console.warn(
            "toggle_solenoid failure",
            response.status,
            response.statusText
        );
    }
});

establish_connection();
