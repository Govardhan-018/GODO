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
    const query = "SELECT pass from useraunth WHERE email=$1"
    try {
        const data = await db.query(query, email)
        if (data.pass = pass) {
            res.status(201).json({
                st: "success"
            });
        } else {
            res.status(400).json({
                st: "fail"
            })
        }
    } catch {
        res.status(401).json({
            st: "fail"
        });
    }

})

app.listen(port, (req, res) => {
    console.log("Server is hosten on " + port)
})