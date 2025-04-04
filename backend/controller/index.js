import express, { json } from 'express';
import cors from 'cors';
import { controllerRoutes } from './src/routes.js';
import { connectMongo, disconnectMongo } from './src/db/mongo.js';

connectMongo();
const PORT = 3000;;
const app = express();
app.use(cors());
app.use(json());

app.use("/api/v1/controller", controllerRoutes());

app.get('/api/v1/controller/health', (req, res) => {
    res.json({ status: 'Controller is healthy' });
});


process.on('SIGINT', async () => {
    console.log("🪧  SIGINT received, shutting down...");
    await disconnectMongo();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`🪧  Controller is running on port ${PORT}`);
});