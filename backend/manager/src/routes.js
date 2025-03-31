import { Router } from "express";
import { controllerData } from "./controller/data.js";
import fs from "fs";

const getConfigData = (type) => {
    const data = fs.readFileSync(`./src/configData/${type}.json`);
    return JSON.parse(data);
}
const managerConfigData = getConfigData("manager");

export const routerManager = Router();
routerManager.get("/configs/manager", async (req, res) => {
    res.json(managerConfigData);
});

routerManager.get("/data/:collection", controllerData.getAll);
routerManager.get("/data/:collection/parentid/:parentId", controllerData.getAllParentId);
routerManager.post("/data/:collection", controllerData.addOne);
routerManager.get("/data/:collection/id/:id", controllerData.getOne);
routerManager.get("/data/:collection/state/:id", controllerData.getOneState);
routerManager.put("/data/:collection/:id", controllerData.updateOne);
routerManager.delete("/data/:collection/:id", controllerData.deleteOne);

