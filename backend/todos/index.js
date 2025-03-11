import express from "express";
import cors from "cors";
import { getAll, saveAll } from "./src/data.js";
const app = express();
app.use(cors());
app.use(express.json());

app.get("/todos", (req, res) => {
    res.send(getAll());
});

app.post("/todos", (req, res) => {
    const data = req.body;
    saveAll(data);
    res.send("OK");
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});