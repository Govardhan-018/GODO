let email, pass, key,ip,server
fetchIP()
document.getElementById("email").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("pass").focus();
    }
});

document.getElementById("pass").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        submitData();
    }
});

async function fetchIP() {
    try {
        const response = await fetch("../ip.txt");
        ip = await response.text();
        server = `http://${ip}:3069/checkuser`
    } catch (error) {
        console.error("Could not fetch IP:", error);
    }
}

function customEncrypt(email, password, key = 7) {
    const combined = `${email}::${password}`;
    let encrypted = '';

    for (let i = 0; i < combined.length; i++) {
        let charCode = combined.charCodeAt(i);
        charCode = (charCode + key + i) % 256;
        encrypted += String.fromCharCode(charCode);
    }

    return btoa(encrypted);
}

async function submitData() {
    email = document.getElementById("email").value;
    pass = document.getElementById("pass").value;

    if (!email || !pass) {
        alert("Email and password are required.");
        return;
    }

    key = await customEncrypt(email, pass, 42);

    try {
        const response = await fetch(server, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, key: key })
        });
        console.log(response.status)
        console.log("Status:", response.status);
        const result = await response.json()
        console.log(result.st)
        if (result.st == "success") {
            const newWindow = window.open("home.html");

            if (newWindow) {
                newWindow.addEventListener("load", () => {
                    newWindow.postMessage({ key: key }, "*");
                });
            } else {
                alert("Popup blocked. Please allow popups for this site.");
            }
        }
    } catch (error) {
        console.error("Login failed:", error, email, pass);
        location.reload()
    }
}