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
            //console.log(1, "name", name);
            const type = getSystemType(fileContent);
            //console.log(1, "type", type);
            const content = getSystemContent(fileContent);
            //console.log(1, "content", content);
            const parser = new parserClassMap[type](name, type, content);
            const hash = crypto.createHash('sha256').update(fileContent).digest('hex');
            //console.log(hash);
            return {
                name,
                type,
                content,
                parser,
                hash
            }
        });
        const filesSFJSON = getListOfFiles('./system_files', '.json');

        let systems = this.getSystems();
        let systemsJSON = systems.map(system => {
            let systemJson = {
                name: system,
                hash: this.systemsSF.find(systemObj => systemObj.name === system).hash,
                content: this.getParser(system).contentParsed
            }
            fs.writeFileSync(`./system_files/${system}.json`, JSON.stringify(systemJson, " ", 2));
            return systemJson;
        });
        //console.log(systemsJSON);


    }

    getSystems() {
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
