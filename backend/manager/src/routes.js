import { Router } from "express";
import { controllerProjects } from "./controller/projects.js";
import { controllerInstances } from "./controller/instances.js";
import { controllerSoftwares } from "./controller/softwares.js";
import { controllerModulesConfig } from "./controller/modulesConfig.js";
import { controllerModules } from "./controller/modules.js";

export const routerManager = Router();

const projects = "projects";
const instances = "instances";
const softwares = "softwares";
const modulesConfig = "modulesconfig";
const modules = "modules";

routerManager.get(`/${projects}`, controllerProjects.getAll);
routerManager.post(`/${projects}`, controllerProjects.addOne);
routerManager.get(`/${projects}/:id`, controllerProjects.getOne);
routerManager.put(`/${projects}/:id`, controllerProjects.updateOne);
routerManager.delete(`/${projects}/:id`, controllerProjects.deleteOne);

routerManager.get(`/${instances}`, controllerInstances.getAll);
routerManager.post(`/${instances}`, controllerInstances.addOne);
routerManager.get(`/${instances}/:id`, controllerInstances.getOne);
routerManager.put(`/${instances}/:id`, controllerInstances.updateOne);
routerManager.delete(`/${instances}/:id`, controllerInstances.deleteOne);

routerManager.get(`/${softwares}`, controllerSoftwares.getAll);
routerManager.post(`/${softwares}`, controllerSoftwares.addOne);
routerManager.get(`/${softwares}/:id`, controllerSoftwares.getOne);
routerManager.put(`/${softwares}/:id`, controllerSoftwares.updateOne);
routerManager.delete(`/${softwares}/:id`, controllerSoftwares.deleteOne);

routerManager.get(`/${modulesConfig}`, controllerModulesConfig.getAll);
routerManager.post(`/${modulesConfig}`, controllerModulesConfig.addOne);
routerManager.get(`/${modulesConfig}/:id`, controllerModulesConfig.getOne);
routerManager.put(`/${modulesConfig}/:id`, controllerModulesConfig.updateOne);
routerManager.delete(`/${modulesConfig}/:id`, controllerModulesConfig.deleteOne);

routerManager.get(`/${modules}`, controllerModules.getAll);
routerManager.post(`/${modules}`, controllerModules.addOne);
routerManager.get(`/${modules}/:id`, controllerModules.getOne);
routerManager.put(`/${modules}/:id`, controllerModules.updateOne);
routerManager.delete(`/${modules}/:id`, controllerModules.deleteOne);

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