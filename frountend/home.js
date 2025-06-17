let key

window.addEventListener("message", async (event) => {
    key = event.data.key;
});

document.getElementById("family").addEventListener("click", familydodo)

function familydodo() {
    const newWindow = window.open("family.html");

    if (newWindow) {
        newWindow.addEventListener("load", () => {
            newWindow.postMessage({ key: key }, "*");
        });
    } else {
        alert("Popup blocked. Please allow popups for this site.");
    }
}

function personal() {
    const newWindow = window.open("private.html");

    if (newWindow) {
        newWindow.addEventListener("load", () => {
            newWindow.postMessage({ key: key }, "*");
        });
    } else {
        alert("Popup blocked. Please allow popups for this site.");
    }
}
