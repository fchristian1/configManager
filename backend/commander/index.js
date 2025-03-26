import { disconnectMongo } from './src/db/mongo.js';
import { Services } from './src/services/services.js';
import { startWatching } from './src/watch.js';

const services = new Services();
await services.initialize();
process.on('SIGINT', async () => {
    disconnectMongo();
}
);
startWatching(services).catch(console.error);