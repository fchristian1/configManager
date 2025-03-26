import { connectMongo, find } from "../db/mongo.js";
import { Credential } from "./credentials/credential.js";
import { Instance } from "./instances/instance.js";
import { Project } from "./projects/projects.js";

export class Services {
    constructor() {
        this.serviceList = [
            { name: "Projects", ["class"]: Project, dbName: "projects", dbdata: [], services: [] },
            { name: "Instances", ["class"]: Instance, dbName: "instances", dbdata: [], services: [] },
            { name: "Credentials", ["class"]: Credential, dbName: "credentials", dbdata: [], services: [] },
        ];
    }

    async initialize() {
        await connectMongo();
        await this.getServicesData();
        await this.createServices();
    }

    async getServicesData() {
        for (const service of this.serviceList) {
            const dbData = await find(service.dbName);
            service.dbdata = dbData;
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