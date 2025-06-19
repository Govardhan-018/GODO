let key;

window.addEventListener("message", (event) => {
    const receivedData = event.data;
    if (receivedData && receivedData.key) {
        key = receivedData.key;
        sessionStorage.setItem("key", key);
        console.log("Received and stored key:", key);
        initializePageWithKey();
    }
});

window.addEventListener("DOMContentLoaded", () => {
    const navType = performance.getEntriesByType("navigation")[0].type;
    if (navType === "reload") {
        const storedKey = sessionStorage.getItem("key");
        if (storedKey) {
            key = storedKey;
            console.log("Reload detected. Restored key:", key);
            initializePageWithKey();
        } else {
            console.warn("Reload detected, but no key stored.");
        }
    }
});

function initializePageWithKey() {
    document.getElementById("family").addEventListener("click", familydodo);
    document.getElementById("personal").addEventListener("click", personal);
}


function familydodo() {
   if (!key) {
        alert("Key not received yet. Please wait a moment.");
        return;
    }
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
    if (!key) {
        alert("Key not received yet. Please wait a moment.");
        return;
    }
    const newWindow = window.open("private.html");

    if (newWindow) {
        newWindow.addEventListener("load", () => {
            newWindow.postMessage({ key: key }, "*");
        });
    } else {
        alert("Popup blocked. Please allow popups for this site.");
    }
}