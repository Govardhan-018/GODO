let key; 

window.addEventListener("message", (event) => {
    const receivedData = event.data;
    if (receivedData && receivedData.key) {
        key = receivedData.key;
        console.log("Received and assigned the key:", key);

        initializePageWithKey();
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