import { MongoClient } from 'mongodb';

const url = 'mongodb://admin:admin@backend_mongo:27017';
const client = new MongoClient(url);
const dbName = 'internal';
const collectionName = 'logs-gateway';

let db;
let collection;

export async function connectMongo() {
    try {
        await client.connect();
        db = client.db(dbName);
        collection = db.collection(collectionName);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
}

export async function disconnectMongo() {
    try {
        await client.close();
        console.log("Disconnected from MongoDB");
    } catch (err) {
        console.error("Failed to disconnect from MongoDB", err);
    }
}

export async function logMongo(data) {
    try {
        if (!collection) {
            console.error("MongoDB collection is not initialized");
            return Promise.reject("MongoDB collection is not initialized");
        }
        await collection.insertOne(data);
    } catch (err) {
        console.error(err);
    }
}

