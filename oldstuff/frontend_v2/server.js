import express from 'express';
import cors from 'cors';
import { loginGet, loginPost } from './routes/coreRoutes.js';
import { guideRoute, managerDashRoute, managerFilesRoute, managerProjectsRoute, managerRoute, managerServersRoute } from './routes/siteRoutes.js';
import { adminRoute } from './routes/adminRoute.js';

const __dirname = process.cwd();
const PORT = 8080;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    if (req.headers['hx-request'] === 'true') {
        res.send('<h2>Willkommen auf ConfigManager</h2>');
        return;
    }
    res.sendFile(`${__dirname}/page/index.html`);
});

app.get('/login', loginGet);
app.post('/login', loginPost);

app.get('/guide', guideRoute);

app.get('/manager', managerRoute);
app.get('/manager/dash', managerDashRoute);
app.get('/manager/projects', managerProjectsRoute);
app.get('/manager/servers', managerServersRoute);
app.get('/manager/files', managerFilesRoute);

app.get('/admin', adminRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});