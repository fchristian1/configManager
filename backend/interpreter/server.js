import Interpreter from './interpreter.js';
import fs from 'fs';

const startMessage = "Service: Interpreter started";

const interpreter = new Interpreter();

console.log(startMessage);

const json = JSON.stringify(interpreter.getParser("docker-compose").contentParsed, " ", 2);
fs.writeFileSync('./output.json', json);