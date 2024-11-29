import { getFileContent, getListOfFiles } from "./common/fileSystem.js";
import { getSystemContent, getSystemName, getSystemType } from "./common/systemFile.js";
import { parserClassMap } from "./parser/classMap.js";

export default class Interpreter {
    constructor() {
        this.systems = [];
        this.init();
    }
    init() {
        const files = getListOfFiles('./system_files', '.sf');
        //console.log(files);
        this.systems = files.map((filename) => {
            const fileContent = getFileContent(`./system_files/${filename}`);
            let name = getSystemName(fileContent);
            let type = getSystemType(fileContent);
            let content = getSystemContent(fileContent);
            let parser = new parserClassMap[type](name, type, content);
            return {
                name,
                type,
                content,
                parser
            }
        });
        //console.log(this.systems);
    }

    getAllSystems() {
        return this.systems.map(system => system.name);
    }
    getElementsFromParent(system, parent, parentPosition) { }
    getRootElements(systemName) {
        const systemObj = this.systems.find(systemObj => systemObj.name === systemName);
        return systemObj.parser.getRootElements();
    }
    getParser(systemName) {
        const systemObj = this.systems.find(systemObj => systemObj.name === systemName);
        return systemObj.parser;
    }
}
