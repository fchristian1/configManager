import { MongoClient } from 'mongodb';

const url = 'mongodb://admin:admin@backend_mongo:27017/?replicaSet=rs0&authSource=admin';
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

export async function insertOne(collection, id, data) {
    //insert or update data in collection with id
    try {
        const dbres = await db.collection(collection).updateOne({ id: id }, { $set: data }, { upsert: true });
        console.log(dbres);
    }
    catch (err) {
        console.error(err);
    }
}
export async function deleteOne(collection, id) {
    //delete data in collection with id
    try {
        await db.collection(collection).deleteOne({ id });
    }
    catch (err) {
        console.error(err);
    }
}
export async function findOne(collection, id) {
    //find data in collection with id
    try {
        const data = await db.collection(collection).findOne({ id });

        return data;
    }
    catch (err) {
        console.error(err);
    }
}

export async function find(collection) {
    //find all data in collection
    try {
        const datas = await db.collection(collection).find().toArray() ?? [];
        datas.forEach(data => { return data; });
        return datas;
    }
    catch (err) {
        console.error(err);
    }
}

export async function findFilter(collection, filter) {
    //find all data in collection with filter
    try {
        const datas = await db.collection(collection).find({ ...filter }).toArray() ?? [];
        datas.forEach(data => { return data; });
        return datas;
    }
    catch (err) {
        console.error(err);
    }
}