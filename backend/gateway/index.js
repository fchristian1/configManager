import express from 'express';
import cors from 'cors';
import { urlParser } from './src/common/urlParser.js';
import { log } from './src/common/log.js';
import { apifetch } from './src/apifetch.js';
import { connectMongo, disconnectMongo } from './src/common/mongo.js';

connectMongo();

const app = express();
app.use(cors());
app.use(express.json());
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Something went wrong!" });
});

app.all('/api/v*/*', async (req, res) => {
    try {
        const { apiname, apiversion, apipath } = urlParser(req.url);
        const request = { type: 'request', message: { apiname, apiversion, apipath, headers: req.headers, method: req.method, body: req.body } };
        log('request', request, request.message.method, req.url);
        if (req.method === "HEAD" || req.method === "GET") {
            const response = await apifetch(apiname, apiversion, apipath, res, { method: req.method, headers: req.headers });
            if (response instanceof Error) {
                //res.status(500).json({ message: 'Internal server error' });
                return;
            }
            const logData = { type: 'response', message: { apiname, apiversion, apipath, response } };
            log('response', logData, req.method, req.url);
            res.json(response);
        }
        else {

            const response = await apifetch(apiname, apiversion, apipath, res, { method: req.method, headers: req.headers, body: JSON.stringify(req.body) });
            if (response instanceof Error) {
                //res.status(500).json({ message: 'Internal server error' });
                return;
            }

            const logData = { type: 'response', message: { apiname, apiversion, apipath, response } };
            log('response', logData, req.method, req.url);
            res.json(response);

        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error' });
    }
});

async function stopApp() {
    await disconnectMongo();
}

process.on('SIGINT', async () => {
    await stopApp();
    process.exit(0);
});

app.listen(3000, () => {
    console.log('API-Gateway is listening on port 3000');
});