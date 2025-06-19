let key, family, todos, nam
const ipad = "http://192.168.1.102:3069/"
const server1 = `${ipad}fname`
const server2 = `${ipad}ftodo`
const server3 = `${ipad}fadd`
window.addEventListener("message", (event) => {
    console.log("Received message event:", event.data);
    const receivedData = event.data;
    if (receivedData && receivedData.key) {
        console.log("Key received from message:", receivedData.key);
        key = receivedData.key;
        sessionStorage.setItem("key", key);
        initializePageWithKey();
    }
});

window.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");
    const navType = performance.getEntriesByType("navigation")[0].type;
    if (navType === "reload") {
        const storedKey = sessionStorage.getItem("key");
        console.log("Page reloaded, stored key:", storedKey);
        if (storedKey) {
            key = storedKey;
            initializePageWithKey();
        } else {
            console.warn("Reload detected, but no key stored.");
        }
    }
})

async function initializePageWithKey() {
    try {
        const response1 = await fetch(server1, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: key })
        });
        const result1 = await response1.json();
        family = result1.fname
        nam = result1.name
        console.log("Family:", family);

        const response2 = await fetch(server2, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fname: family })
        });
        const result2 = await response2.json();
        todos = result2.data;
        result2.data.forEach(element => {
            document.querySelector(".box").innerHTML = `
             <div class="ydo">
                <h3>${element.todo}</h3>
                <form class="form"><input type="hidden" value="${element.id}" class="id"><button class="bt"><img
                            src="../images/delete.svg" class="delete" alt="delete"></button></form>
                <form class="editform"><input type="hidden" value="${element.id}" class="editid"><button
                        class="btedit"><img src="../images/edit.svg" class="edit" alt="edit"></button></form>
            </div>` + document.querySelector(".box").innerHTML
        })
    } catch (err) {
        console.log("Error occurred:", err);
    }
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
                submitData(event);
            }
        });
    }
    document.querySelectorAll(".bt").forEach(button => {
        button.addEventListener("click", delt);
    });
    document.querySelectorAll(".btedit").forEach(button => {
        button.addEventListener("click", edit);
    });
}
function addform() {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `
        <div class="input">
            <form>
                <input type="text" class="todo" placeholder="Enter your todo" maxlength="30" required autofocus>
                <button type="button" class="btdone"> <img src="../images/done.svg" alt="done"></button>
            </form>
        </div>`;

    const newFormElement = tempDiv.firstElementChild;
    const doneButton = newFormElement.querySelector(".btdone");
    const todoInput = newFormElement.querySelector(".todo");
    doneButton.addEventListener("click", (e) => {
        e.preventDefault();
        submitData();
    });
    todoInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            submitData();
        }
    });
    document.querySelector(".box").prepend(newFormElement);
}
async function submitData() {
    const todoInput = document.querySelector(".input .todo");
    if (!todoInput || !todoInput.value) {
        console.warn("Todo input is empty or not found.");
        location.reload();
        return;
    }

    const data = todoInput.value;
    try {
        const response = await fetch(server3, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: key, data: data, fname: family, name: nam })
        })
        location.reload()
    } catch (error) {
        console.error("Request failed:", error)
        location.reload()
    }
}
