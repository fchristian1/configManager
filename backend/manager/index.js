import express from 'express';
import cors from 'cors';
import { routerManager } from './src/routes.js';
import { connectMongo, disconnectMongo } from './src/db/mongo.js';

const app = express();
connectMongo();

app.use(cors());
app.use(express.json());
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Something went wrong!" });
});
app.use("/api/v1/manager", routerManager);

app.get("/api/v1/manager/", (req, res) => {
    res.json({ message: "API-Manager running" });
});

process.on('SIGINT', async () => {
    await disconnectMongo();
    process.exit();
});



app.listen(3000, () => {
    console.log('API-Manager is listening on port 3000');
});