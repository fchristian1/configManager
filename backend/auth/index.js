import express from 'express';
import cors from 'cors';
import { checkPassword, createJWT, createUser, getUser, verifyJWT } from './src/user.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/v1/auth/", (req, res) => {
    res.json({ message: "API-Auth running" });
});

app.post("/api/v1/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "email and password required" });
        return;
    }
    if (!checkPassword(email, password)) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    let user = getUser(email);
    const token = createJWT(user.email, user.userId)
    res.json({ message: "Login successful", token });
});

app.post("/api/v1/auth/token", (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).json({ message: "no token" });
        return;
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "no token" });
        return;
    }
    const payload = verifyJWT(token);
    if (!payload) {
        res.status(401).json({ message: "nok" });
        return;
    }
    res.json({ message: "ok", payload });
});

app.get("/api/v1/auth/getuseridfromtoken", (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).json({ message: "no token" });
        return;
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "no token" });
        return;
    }
    const payload = verifyJWT(token);
    if (!payload) {
        res.status(401).json({ message: "nok" });
        return;
    }
    res.json({ message: "ok", userId: payload.userId });
});

createUser("fchristian1@gmx.net", "123456");
app.listen(3000, () => {
    console.log("API-Auth is running on http://localhost:3000");
});