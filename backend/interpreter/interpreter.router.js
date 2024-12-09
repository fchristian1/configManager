import { Router } from "express";

const router = (interpreterService) => {
    const router = Router();
    router.get("/", (req, res) => {
        const systems = interpreterService.getSystems();
        res.json({ systems });
    });
    return router;
};

export { router as interpreterRouter };