import { establish_connection } from "./events.js";

document.getElementById("reconnect").addEventListener("click", () => {
    establish_connection();
});

const button = /** @type {HTMLButtonElement}*/ (
    document.getElementById("toggle_test")
);
button.addEventListener("click", async () => {
    button.disabled = true;

    let response = await fetch("http://192.168.4.1:80/api/toggle_test");

    if (response.ok) {
        console.log("toggle_test success");
    } else {
        console.warn(
            "toggle_test failure",
            response.status,
            response.statusText
        );
    }
});

establish_connection();
