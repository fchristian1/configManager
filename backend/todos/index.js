import express from "express";
import cors from "cors";
import { getAll, saveAll } from "./src/data.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/v1/todos", async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ message: "no token" });
        return;
    }
    let response = await fetch(
        'http://backend_gateway:3000/api/v1/auth/getuseridfromtoken',
        { headers: { 'Authorization': token } }
    );
    let data = await response.json();
    if (data.message !== 'ok') {
        res.status(401).json({ message: "nok" });
        return;
    }
    res.send(getAll(data.userId));
});

app.post("/api/v1/todos", async (req, res) => {
    const dataTodos = req.body;
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ message: "no token" });
        return;
    }
    let response = await fetch(
        'http://backend_gateway:3000/api/v1/auth/getuseridfromtoken',
        { headers: { 'Authorization': token } }
    );
    let data = await response.json();
    if (data.message !== 'ok') {
        res.status(401).json({ message: "nok" });
        return;
    }
    dataTodos.forEach(todo => {
        todo.userId = data.userId;
    });
    saveAll(dataTodos, data.userId);
    res.send({ message: "OK" });
});

app.listen(3000, () => {
    console.log("API-Todos is running on http://localhost:3000");
});