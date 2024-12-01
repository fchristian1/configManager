import { getFileContent, getListOfFiles } from "./common/fileSystem.js";
import { getSystemContent, getSystemName, getSystemType } from "./common/systemFile.js";
import { parserClassMap } from "./parser/classMap.js";

import crypto from 'node:crypto';
import fs from 'node:fs';

export default class Interpreter {
    constructor() {
        this.systemsSF = [];
        this.systemsSFJSON = [];
        this.init();
    }
    init() {

        const filesSF = getListOfFiles('./system_files', '.sf');
        //console.log(files);
        this.systemsSF = filesSF.map((filename) => {
            const fileContent = getFileContent(`./system_files/${filename}`);
            const name = getSystemName(fileContent);
            const type = getSystemType(fileContent);
            const content = getSystemContent(fileContent);
            const parser = new parserClassMap[type](name, type, content);
            const hash = crypto.createHash('sha256').update(fileContent).digest('hex');
            console.log(hash);
            return {
                name,
                type,
                content,
                parser,
                hash
            }
        });
        const filesSFJSON = getListOfFiles('./system_files', '.json');

        let systems = this.getAllSystems();
        let systemsJSON = systems.map(system => {
            let systemJson = {
                name: system,
                hash: this.systemsSF.find(systemObj => systemObj.name === system).hash,
                content: this.getParser(system).contentParsed
            }
            fs.writeFileSync(`./system_files/${system}.json`, JSON.stringify(systemJson, " ", 2));
            return systemJson;
        });
        console.log(systemsJSON);


    }

    getAllSystems() {
        return this.systemsSF.map(system => system.name);
    }
    getElementsFromParent(system, parent, parentPosition) { }
    getRootElements(systemName) {
        const systemObj = this.systemsSF.find(systemObj => systemObj.name === systemName);
        return systemObj.parser.getRootElements();
    }
    getParser(systemName) {
        const systemObj = this.systemsSF.find(systemObj => systemObj.name === systemName);
        return systemObj.parser;
    }
}
