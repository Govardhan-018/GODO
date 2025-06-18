let key, todos
const ipad = "http://192.168.1.103:3069/"
const server = `${ipad}addtodo`
const get = `${ipad}gettodo`
const delet = `${ipad}deltodo`
const editdo = `${ipad}editodo`

window.addEventListener("message", (event) => {
    const receivedData = event.data;
    if (receivedData && receivedData.key) {
        key = receivedData.key;
        sessionStorage.setItem("key", key);
        initializePageWithKey();
    }
});

window.addEventListener("DOMContentLoaded", () => {
    const navType = performance.getEntriesByType("navigation")[0].type;
    if (navType === "reload") {
        const storedKey = sessionStorage.getItem("key");
        if (storedKey) {
            key = storedKey;
            initializePageWithKey();
        } else {
            console.warn("Reload detected, but no key stored.");
        }
    }
});

async function initializePageWithKey() {
    try {
        const response = await fetch(get, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: key })
        });

        const result = await response.json();
        todos = result.data
        result.data.forEach(element => {
            document.querySelector(".box").innerHTML = `
             <div class="ydo">
                <h3>${element.todo}</h3>
                <form class="form"><input type="hidden" value="${element.id}" class="id"><button class="bt"><img
                            src="../images/delete.svg" class="delete" alt="delete"></button></form>
                <form class="editform"><input type="hidden" value="${element.id}" class="editid"><button
                        class="btedit"><img src="../images/edit.svg" class="edit" alt="edit"></button></form>
            </div>` + document.querySelector(".box").innerHTML
        });
    } catch (err) {
        console.log(err)
        location.reload()
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
function edit(event) {
    const id = event.target.closest("form").querySelector(".editid").value;
    const match = todos.find(eve => eve.id == id);
    const todovalue = match ? match.todo : "";
    let gotodos = `
        <div class="input">
           <form>
            <input type="text" class="editodo" placeholder="Enter your todo" value="${todovalue}" maxlength="30" autofocus>
            <input type="hidden" class="editodoid" value="${id}">
            <button class="editdone">
            <img src="../images/done.svg" alt="done">
            </button>
            </form>
        </div>`
    document.querySelector(".box").prepend(gotodos);
    document.querySelector(".editdone").addEventListener("click", editdata)
}
async function editdata(params) {
    const id = params.target.closest("form").querySelector(".editodoid").value;
    const data = params.target.closest("form").querySelector(".editodo").value;
    try {
        await fetch(editdo, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: key, id: id, todo: data })
        });
        location.reload()
    } catch (err) {
        console.log(err)
        location.reload()
    }
}
async function delt(event) {
    const id = event.target.closest("form").querySelector(".id").value;
    try {
        await fetch(delet, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: key, id: id })
        });

        location.reload()
    } catch (err) {
        console.log(err)
        location.reload()
    }

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
        const response = await fetch(server, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: key, data: data })
        });
        location.reload()
    } catch (error) {
        console.error("Request failed:", error);
        location.reload()
    }
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

