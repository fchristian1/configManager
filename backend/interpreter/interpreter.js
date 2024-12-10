import { getFileContent, getListOfFiles } from "./common/fileSystem.js";
import { getSystemContent, getSystemName, getSystemType } from "./common/systemFile.js";
import { parserClassMap } from "./parser/classMap.js";

import crypto from 'node:crypto';
import fs from 'node:fs';

export default class Interpreter {
    constructor() {
        this.systemsSF = [];
        this.systemsJSON = [];
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
        this.systemsJSON = systems.map(system => {
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
    getElementsFromId(systemName, id) {
        if (id.includes("..")) {
            let idB = id.split("..")[0];
            let idD = id.split("..")[1];
            let systemsBlocks = this.systemsJSON.find(system => system.name === systemName).content.map(block => Object.keys(block)[0]);
            let finding = systemsBlocks.map(blockName => {
                return this.findId(id, this.systemsJSON
                    .find(system => system.name === systemName).content.filter(block => block[blockName])[0][blockName].sections, 1)
            })
            console.log(1, finding.find(f => f !== null));
            let r = finding.find(f => f !== null);
            return r?.childrens.map(elm => {
                let e = { id: idB + ".." + elm.id, section: elm.section, options: elm.options };
                return e;
            }) ?? [];
        } else {
            return this.findId(id, this.systemsJSON
                .find(system => system.name === systemName).content[0][systemName].sections, 1)?.childrens ?? [];
        }
    }
    findId(id, sections, i) {
        let finding = null;
        sections.forEach(section => {
            if (id.split("..").length > 1) {
                if (section.id === id.split("..")[1]) {
                    finding = section;
                }
            } else {
                if (section.id === id) {
                    finding = section;
                    section.childrens.map(child => {
                        if (child.section.match(/{{.*\..*}}/)) {
                            let systemName = child.section.match(/{{(.*\..*?)}}/)[1];
                            let linkElement = this.getRootElements(systemName, child.id);
                            finding.childrens = linkElement;
                        }
                    });
                }
            }
        });
        if (finding === null) {
            sections.forEach(section => {
                if (section.childrens?.length > 0) {
                    finding = this.findId(id, section.childrens, i + 1);
                } else { return null; }
            });
        }
        return finding;
    }
    getRootElements(systemName, id = "") {
        if (systemName.split(".").length > 1) {
            return this.systemsJSON
                .find(system => system.name === systemName.split(".")[0])?.content
                .filter(element => element[systemName] != null)[0][systemName].sections
                .map(section => {
                    return { id: id + ".." + section.id, section: section.section, options: section.options }
                })
        } else {
            return this.systemsJSON
                .find(system => system.name === systemName).content
                .filter(element => element[systemName] != null)[0][systemName].sections
                .map(section => {
                    return { id: section.id, section: section.section, options: section.options }
                });
        }
    }
    getParser(systemName) {
        const systemObj = this.systemsSF.find(systemObj => systemObj.name === systemName);
        return systemObj.parser;
    }
}
