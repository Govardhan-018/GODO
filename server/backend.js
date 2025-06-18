import pg from "pg"
import express from "express"
import axios from "axios"
import cors from "cors"

const port = 3069
const app = express()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


function customDecrypt(encryptedBase64, key = 7) {
    const encrypted = Buffer.from(encryptedBase64, 'base64').toString('binary');
    let decrypted = '';

    for (let i = 0; i < encrypted.length; i++) {
        let charCode = encrypted.charCodeAt(i);
        charCode = (charCode - key - i + 256) % 256;
        decrypted += String.fromCharCode(charCode);
    }

    return decrypted;
}

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "godo",
    password: "gova123",
    port: 5432
})
db.connect()

app.post("/creatuser", async (req, res) => {
    const code = req.body.key
    let op = customDecrypt(code, 42)
    let [email, pass] = op.split("::")
    const query = "INSERT INTO useraunth (email,pass) VALUES ($1,$2)"
    try {
        await db.query(query, [email, pass])
        res.status(201).json({
            status: "success"
        });
    } catch {
        res.status(400).json({
            status: "fail"
        });
    }

})
app.post("/checkuser", async (req, res) => {
    const code = req.body.key
    let op = customDecrypt(code, 42)
    let [email, pass] = op.split("::")
    console.log(email + pass)
    const query = "SELECT pass from useraunth WHERE email=$1"
    try {
        const data = await db.query(query, [email])
        console.log(data.rows[0].pass)
        if (data.rows[0].pass === pass) {
            res.status(201).json({
                st: "success"
            });
        } else {
            res.status(400).json({
                st: "fail"
            })
        }
    } catch (err) {
        console.error(err)
        res.status(401).json({ st: "fail" })
    }

})

app.post("/addtodo", async (req, res) => {
    const data = req.body.data
    var key = req.body.key
    key = await customDecrypt(key, 42)
    let email = key.split("::")[0]
    const query = "INSERT INTO godo (email,todo) VALUES ($1,$2)"
    try {
        await db.query(query, [email, data])
        res.status(201).json({
            st: "success"
        });
    } catch (err) {
        console.log(err)
        res.status(401).json({
            st: "fail"
        });
    }
})
app.post("/gettodo", async (req, res) => {
    var key = req.body.key
    key = await customDecrypt(key, 42)
    let email = key.split("::")[0]
    const query = "SELECT * FROM godo WHERE email=$1"
    try {
        const data = await db.query(query, [email])
        res.status(201).json({
            st: "success", data: data.rows
        })
    } catch (err) {
        res.status(401).json({
            st: "fail"
        })
    }
})
app.post("/deltodo", async (req, res) => {
    var key = req.body.key
    const id = req.body.id
    key = await customDecrypt(key, 42)
    let email = key.split("::")[0]
    const query = "DELETE FROM godo WHERE id=$1 AND email=$2"
    try {
        const data = await db.query(query, [id, email])
        res.status(201).json({
            st: "success", data: data.rows
        })
    } catch (err) {
        res.status(401).json({
            st: "fail"
        })
    }
})
app.post("/editodo", async (req, res) => {
    var key = req.body.key
    const id = req.body.id
    const todo = req.body.todo
    key = await customDecrypt(key, 42)
    let email = key.split("::")[0]
    const query = "UPDATE godo SET todo = $1 WHERE id = $2 AND email = $3"
    try {
        const data = await db.query(query, [todo, id, email])
        res.status(201).json({
            st: "success", data: data.rows
        })
    } catch (err) {
        res.status(401).json({
            st: "fail"
        })
    }
})
app.listen(port, (req, res) => {
    console.log("Server is hosten on " + port)
})