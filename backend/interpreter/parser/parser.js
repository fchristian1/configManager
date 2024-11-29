export class Parser {
    constructor(systemname, systemtype, content) {
        this.systemname = systemname;
        this.systemtype = systemtype;
        this.content = content;
        this.contentParsed = this.parseContent();
    }
    contentParsed = [];
    parseContent() { }

    getSystemName() { }
    getElementsFromParent(system, parent, parentPosition) { }
    getRootElements() { }
}