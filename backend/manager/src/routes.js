import { Router } from "express";
import { controllerProjects } from "./controller/projects.js";
import { controllerInstances } from "./controller/systems.js";
import { controllerSoftwares } from "./controller/softwares.js";

export const routerManager = Router();

routerManager.get("/projects", controllerProjects.getAll);
routerManager.post("/projects", controllerProjects.addOne);
routerManager.get("/projects/:id", controllerProjects.getOne);
routerManager.put("/projects/:id", controllerProjects.updateOne);
routerManager.delete("/projects/:id", controllerProjects.deleteOne);

routerManager.get("/instances", controllerInstances.getAll);
routerManager.post("/instances", controllerInstances.addOne);
routerManager.get("/instances/:id", controllerInstances.getOne);
routerManager.put("/instances/:id", controllerInstances.updateOne);
routerManager.delete("/instances/:id", controllerInstances.deleteOne);

routerManager.get("/softwares", controllerSoftwares.getAll);
routerManager.post("/softwares", controllerSoftwares.addOne);
routerManager.get("/softwares/:id", controllerSoftwares.getOne);
routerManager.put("/softwares/:id", controllerSoftwares.updateOne);
routerManager.delete("/softwares/:id", controllerSoftwares.deleteOne);

routerManager.get("/oss", async (req, res) => {
    res.json({ message: "Betriebsystem Endpoint" });
});
routerManager.get("/configs", async (req, res) => {
    res.json({ message: "Configs Endpoint" });
});
routerManager.get("/workflows", async (req, res) => {
    res.json({ message: "Workflows Endpoint" });
});
routerManager.get("/tasks", async (req, res) => {
    res.json({ message: "Tasks Endpoint" });
});