let email, pass, key, nam, family;
const server = "http://192.168.1.5:3069/creatuser";

document.getElementById("name").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("email").focus();
    }
});
document.getElementById("email").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("family").focus();
    }
});
document.getElementById("family").addEventListener("keydown", (event) => {
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
    nam = document.getElementById("name").value;
    family = document.getElementById("family").value;
    if (!email || !pass || !nam) {
        alert("Email and password are required.");
        return;
    }

    key = await customEncrypt(email, pass, 42);

    try {
        const response = await fetch(server, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, key: key, name: nam, family: family })
        });
        console.log(response.status)
        console.log("Status:", response.status);
        const newWindow = window.open("home.html");

        if (newWindow) {
            newWindow.addEventListener("load", () => {
                newWindow.postMessage({ key: key }, "*");
            });
        } else {
            alert("Popup blocked. Please allow popups for this site.");
        }


    } catch (error) {
        console.error("Signup failed:", error, email, pass);
    }
}