import path from "path";
import { connectMongo, find } from "../db/mongo.js";
import { Credential } from "./credentials/credential.js";
import { Instance } from "./instances/instance.js";
import { Project } from "./projects/projects.js";
import fs from 'fs';

export class Services {
    constructor() {
        this.serviceList = [
            { name: "Projects", ["class"]: Project, dbName: "projects", dbdata: [], services: [] },
            { name: "Instances", ["class"]: Instance, dbName: "instances", dbdata: [], services: [] },
            { name: "Credentials", ["class"]: Credential, dbName: "credentials", dbdata: [], services: [] },
        ];
        this.dataProjectPath = path.join("./data/");

    }

    async initialize() {
        await connectMongo();
        await this.getServicesData();
        await this.createServices();
        await this.removeFoldersFromNoServices();
    }
    async updateData() {
        await this.getServicesData();
        await this.createServices();
        await this.removeFoldersFromNoServices();
    }

    async getServicesData() {
        for (const service of this.serviceList) {
            const dbData = await find(service.dbName);

            service.dbdata = dbData;
        }
    }
    async removeFoldersFromNoServices() {
        console.log("ℹ️  Start:Remove folders with no Services");
        const instancesFolders = fs.readdirSync(path.join(this.dataProjectPath, "instances"));
        //console.log("🍀🍀🍀🍀🍀🍀Folders", instancesFolders);
        const instances = this.serviceList.find((s) => s.name === "Instances");
        const instancesIds = instances.dbdata.map((i) => i.id.toString());
        //console.log("🍀🍀🍀🍀🍀🍀Instances IDs", instancesIds);
        for (const folder of instancesFolders) {
            const folderPath = path.join(this.dataProjectPath, "instances", folder);
            if (!instancesIds.includes(folder)) {
                //console.log("🍀🍀🍀🍀🍀🍀Remove Folder", folderPath);
                this.deleteFolderRecursive(folderPath);
            }
        }
        console.log("🔚 Finish:Remove folders with no Services");

    }

    deleteFolderRecursive(pathFolder) {
        if (fs.existsSync(pathFolder)) {
            fs.readdirSync(pathFolder).forEach((file, index) => {
                const curPath = path.join(pathFolder, file);
                if (fs.lstatSync(curPath).isDirectory()) {
                    this.deleteFolderRecursive(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(pathFolder);
        }
    }
    getService(name, _id) {
        for (const service of this.serviceList) {
            if (service.name === name) {
                for (const entity of service.services) {
                    if (entity.getId && entity.getId().toString() == _id.toString()) {
                        return entity;
                    }
                }
            }
        }
        console.error("Service not found", name, _id);
    }

    async createServices() {
        for (const service of this.serviceList) {
            for (const data of service.dbdata) {
                service.services.push(new service.class({ data }));
                //console.log("Created service", service, data);
            }
        }
    }
} 