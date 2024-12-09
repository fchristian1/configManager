import express from "express"
import Interpreter from './interpreter.js';
import { interpreterRouter } from "./interpreter.router.js";
const PORT = parseInt(process.env.PORT) || 3000
const startMessage = "Service: Interpreter started";

const interpreter = new Interpreter();

console.log(startMessage);

const app = express();

app.use("/api/v1/interpreter", interpreterRouter(interpreter));

app.listen(PORT, () => {
    console.log("interpreter is listening on port", PORT)
})