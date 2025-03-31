import { WebSocketServer } from 'ws';

const clients = new Map(); // Map<`${name}:${id}`, WebSocket>
let wss;

export function startWebSocketServer(serverPort = 8081) {
    wss = new WebSocketServer({ port: serverPort });

    wss.on('connection', (ws) => {
        let clientKey = null;
        let registered = false;

        ws.on('message', (message) => {
            try {
                const parsed = JSON.parse(message);

                // Registrierung: nur erste Nachricht wird zur Anmeldung verwendet
                if (!registered) {
                    const { name, id } = parsed;
                    if (!name || !id) {
                        ws.send(JSON.stringify({ error: 'Missing name or id' }));
                        return;
                    }

                    clientKey = `${name}:${id}`;
                    clients.set(clientKey, ws);
                    registered = true;

                    //console.log(`ℹ️  WS:Client registriert: ${clientKey}`);
                    return;
                }

                // Optional: Reagiere auf spätere Nachrichten vom Client (wenn nötig)
                //console.log(`ℹ️ WS:Ignoriere Nachricht von ${clientKey}:`, parsed);

            } catch (err) {
                ws.send(JSON.stringify({ error: 'Invalid JSON format' }));
            }
        });

        ws.on('close', () => {
            if (clientKey) {
                clients.delete(clientKey);
                //console.log(`ℹ️  WS:Client disconnected: ${clientKey}`);
            }
        });
    });

    console.log(`ℹ️  WS:WebSocket Server läuft auf ws://localhost:${serverPort}`);
}

export function sendToClient(name, id, data) {
    const key = `${name}:${id}`;
    const client = clients.get(key);
    //console.log(`ℹ️  WS:Client ${key} gefunden: ${!!client}`);

    if (client && client.readyState === client.OPEN) {
        client.send(JSON.stringify({ name, id, data }));
    } else {
        //console.warn(`ℹ️  WS:Client ${key} nicht verbunden oder nicht offen`);
    }
}
