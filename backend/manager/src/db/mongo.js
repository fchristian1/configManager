import { MongoClient } from 'mongodb';

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
        delete data._id;
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
        const data = await db.collection(collection).findOne({ id, userId });
        delete data._id;
        return data;
    }
    catch (err) {
        console.error(err);
    }
}
export async function findOneWithoutUserId(collection, id) {
    //find data in collection with id
    try {
        const data = await db.collection(collection).findOne({ id });
        delete data._id;
        return data;
    }
    catch (err) {
        console.error(err);
    }
}
export async function find(userId, collection) {
    //find all data in collection
    try {
        const datas = await db.collection(collection).find({ userId }).toArray() ?? [];
        datas.forEach(data => delete data._id);
        return datas;
    }
    catch (err) {
        console.error(err);
    }
}

export async function findWithoutUserId(collection) {
    //find all data in collection
    try {
        const datas = await db.collection(collection).find().toArray() ?? [];
        datas.forEach(data => delete data._id);
        return datas;
    }
    catch (err) {
        console.error(err);
    }
}