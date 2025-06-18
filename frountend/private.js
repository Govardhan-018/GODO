let key;
const server = "http://192.168.1.103:3069/addtodo";

window.addEventListener("message", (event) => {
    const receivedData = event.data;
    if (receivedData && receivedData.key) {
        key = receivedData.key;
        sessionStorage.setItem("key", key); // Save for reload
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
    const addButton = document.querySelector(".add");
    if (addButton) {
        addButton.addEventListener("click", addform);
    } else {
        console.warn(".add button not found.");
    }
    const todoInput = document.querySelector(".todo");
    if (todoInput) {
        todoInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                submitData();
            }
        });
    }
}

async function submitData() {
    const data = document.querySelector(".todo").value;

    try {
        const response = await fetch(server, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: key, data: data })
        });

        console.log("Status:", response.status);
        const result = await response.json();
        console.log(result.st);

        if (result.st === "success") {
            alert("Todo added successfully");
        } else {
            alert("Failed to add todo.");
        }
    } catch (error) {
        console.error("Request failed:", error);
        alert("Error occurred. Trying to resend key...");
    }
}

function addform() {
    document.querySelector(".box").innerHTML = `
        <div class="input">
            <input type="text" class="todo" placeholder="Enter your todo" autofocus>
        </div>` + document.querySelector(".box").innerHTML;

    const newTodo = document.querySelector(".todo");
    if (newTodo) {
        newTodo.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                submitData();
            }
        });
    }
}
