import { MongoClient, ObjectId } from 'mongodb';

const url = 'mongodb://admin:admin@backend_mongo:27017';
const client = new MongoClient(url);
const dbName = 'internal';

let db;

export async function connectMongo() {
    try {
        await client.connect();
        db = client.db(dbName);
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

export async function insertOne(userId, collection, id, data) {
    //insert or update data in collection with id
    try {
        data.userId = userId;
        await db.collection(collection).updateOne({ id: id, userId: userId }, { $set: data }, { upsert: true });
    }
    catch (err) {
        console.error(err);
    }
}
export async function deleteOne(userId, collection, id) {
    //delete data in collection with id
    try {
        await db.collection(collection).deleteOne({ id, userId });
    }
    catch (err) {
        console.error(err);
    }
}
export async function findOne(userId, collection, id) {
    //find data in collection with id
    try {
        return await db.collection(collection).findOne({ id, userId }) ?? {};
    }
    catch (err) {
        console.error(err);
    }
}
export async function find(userId, collection) {
    //find all data in collection
    try {
        return await db.collection(collection).find({ userId }).toArray() ?? [];
    }
    catch (err) {
        console.error(err);
    }
}