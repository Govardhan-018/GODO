import pg from "pg"
import express from "express"
import os from "os"
import cors from "cors"
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 3069
const app = express()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

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
    const name = req.body.name
    const family = req.body.family
    let op = customDecrypt(code, 42)
    let [email, pass] = op.split("::")
    const query = "INSERT INTO useraunth (email,pass,name,family_name) VALUES ($1,$2,$3,$4)"
    try {
        await db.query(query, [email, pass, name, family])
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
app.post("/fname", async (req, res) => {
    var key = req.body.key
    key = await customDecrypt(key, 42)
    let [email, pass] = key.split("::")
    const query = "SELECT * FROM useraunth WHERE email=$1 AND pass=$2 "
    try {
        const data = await db.query(query, [email, pass])
        const fname = data.rows[0].family_name
        const nam = data.rows[0].name
        res.status(200).json({
            fname: fname,
            name: nam
        })
    } catch (err) {
        res.status(401)
        console.log(err)
    }
})
app.post("/ftodo", async (req, res) => {
    const family = req.body.fname
    const query = "SELECT * FROM family WHERE family_name=$1"
    try {
        const data = await db.query(query, [family])
        res.status(200).json({
            data: data.rows
        })
    } catch (err) {
        res.status(401)
        console.log(err)
    }
})
app.post("/fadd", async (req, res) => {
    const family = req.body.fname
    const nam = req.body.name
    var key = req.body.key
    key = await customDecrypt(key, 42)
    let email = key.split("::")[0]
    const data = req.body.data
    const query = "INSERT INTO family (email,todo,name,family_name) VALUES ($1,$2,$3,$4)"
    try {
        await db.query(query, [email, data, nam, family])
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
app.post("/fdelet", async (req, res) => {
    var key = req.body.key
    const id = req.body.id
    const family = req.body.family
    key = await customDecrypt(key, 42)
    let email = key.split("::")[0]
    console.log(id + email + family)
    const query = "DELETE FROM family WHERE id=$1 AND email=$2 AND family_name=$3"
    try {
        await db.query(query, [id, email, family])
        res.status(201).json({
            st: "success"
        })
    } catch (err) {
        res.status(401).json({
            st: "fail"
        })
    }
})
app.post("/fedit", async (req, res) => {
    var key = req.body.key
    const id = req.body.id
    const todo = req.body.todo
    const family = req.body.family
    key = await customDecrypt(key, 42)
    let email = key.split("::")[0]
    const query = "UPDATE family SET todo = $1 WHERE id = $2 AND email = $3 AND family_name=$4"
    try {
        const data = await db.query(query, [todo, id, email, family])
        res.status(201).json({
            st: "success", data: data.rows
        })
    } catch (err) {
        res.status(401).json({
            st: "fail"
        })
    }
})
app.listen(port, async (req, res) => {
    const localIP = await getLocalIPAddress();
    fs.writeFileSync(path.join(__dirname, '../ip.txt'), localIP)
    console.log("Server is host on " + localIP + "/" + port)
})