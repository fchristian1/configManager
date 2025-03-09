import { WebSocketServer } from 'ws';
import http from 'http';
import express from 'express';

const app = express();



const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
    console.log('Client connected');
    ws.send('Hello from the server! Mesage 1');
    ws.on('message', function message(data) {
        console.log(`Received message => ${data}`);
        ws.send('Hello! Message received!');
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

app.get('/', (req, res) => {
    wss.clients.forEach((client) => {
        client.send('Hello from the server!');
    });
    res.send("Message sent to all clients");
});

server.listen(3001);