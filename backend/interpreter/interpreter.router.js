import { Router } from "express";

const router = (interpreterService) => {
    const systems = interpreterService.getSystems();
    const router = Router();
    router.get("/", (req, res) => {
        res.json({ systems });
    });
    router.get("/:systemName", (req, res) => {
        const systemName = req.params.systemName;
        const rootElements = interpreterService.getRootElements(systemName);
        res.json(rootElements);
    });
    router.get("/:systemName/:id", (req, res) => {
        const systemName = req.params.systemName;
        const id = req.params.id;
        const elements = interpreterService.getElementsFromId(systemName, id);
        res.json(elements);
    });
    return router;
};

export { router as interpreterRouter };