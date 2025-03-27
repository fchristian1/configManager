import { MongoClient } from 'mongodb';
import { handleProjectChange } from './controllers/handleProjectChange.js';
import { handleInstanceChange } from './controllers/handleInstanceChange.js';
import { handleCredentialsChange } from './controllers/handleCredentialsChange.js';


console.log("MONGO_CONNECTION_STRING", process.env.MONGO_CONNECTION_STRING);

const uri = process.env.MONGO_CONNECTION_STRING
const dbName = 'internal';

export async function startWatching(services) {
    const watchedCollections = [
        { name: 'projects', handler: handleProjectChange(services) },
        { name: 'instances', handler: handleInstanceChange(services) },
        { name: 'credentials', handler: handleCredentialsChange(services) },
    ];
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Mit MongoDB verbunden.');

    const db = client.db(dbName);
    setTimeout(() => {
        watchedCollections.forEach(({ name, handler }) => {
            const collection = db.collection(name);
            const changeStream = collection.watch();

            changeStream.on('change', async (c) => {
                //await services.updateData();
                handler(c);
            }
            );

            changeStream.on('error', (error) => {
                console.error(`Fehler im Change Stream von "${name}":`, error);
            });

            process.on('SIGINT', async () => {
                console.log('Beende Change Streams...');
                await changeStream.close();
                await client.close();
                process.exit(0);
            });

            console.log(`Watching collection: ${name}`);
        });
    }, 2000);
}