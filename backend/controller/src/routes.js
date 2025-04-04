import { Router } from "express";
import { stateController } from "./controller/state.js";
import { outputController } from "./controller/output.js";
import { activeController, inactiveController, restartController } from "./controller/controll.js";

const router = Router();

router.get('/instance/:id/state', stateController);
router.get('/instance/:id/output', outputController);
router.get('/instance/:id/active', activeController);
router.get('/instance/:id/inactive', inactiveController);
router.get('/instance/:id/restart', restartController);
export const controllerRoutes = () => {
    return router;
}


