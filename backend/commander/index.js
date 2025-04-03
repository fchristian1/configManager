import { disconnectMongo } from './src/db/mongo.js';
import { Services } from './src/services/services.js';
import { startWatching } from './src/watch.js';
import { sendToClient, startWebSocketServer } from './ws/websocket.js';


const services = new Services();
await services.initialize();

process.on('SIGINT', async () => {
    disconnectMongo();
    process.exit();
});

// Starte WebSocket Server
startWebSocketServer(8888);

// Beispiel: Sende Nachricht nach 5 Sekunden an einen bestimmten Client
// setInterval(() => {
//     sendToClient('my-client', '123', { message: 'Hallo aus dem Backend!' });
// }, 1000);

startWatching(services).catch(console.error);
