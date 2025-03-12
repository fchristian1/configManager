import { v4 as uuid } from 'uuid';
import { logMongo } from './mongo.js';

export function log(type = 'info', data, ...messages) {
    const id = uuid();
    logMongo({ id, type, data: passwordDelete(data), messages });
    console.log(`[${new Date().toISOString()}] [${type.toUpperCase()}] [${id}]`, ...messages);
}

function passwordDelete(obj) {
    //copy object to not change the original
    let newObj
        = JSON.parse(JSON.stringify(obj));
    recursivePasswordDeleter(newObj);
    return newObj;
}

function recursivePasswordDeleter(obj) {
    for (let key in obj) {
        if (key === "password") {
            obj[key] = "****";
        }
        else if (typeof obj[key] === "object") {
            recursivePasswordDeleter(obj[key]);
        }
    }
}