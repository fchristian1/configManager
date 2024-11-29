import { Parser } from "./parser.js";

export class YAMLParser extends Parser {
    constructor(systemname, systemtype, content) {
        super(systemname, systemtype, content);
    }
    parseContent() {
        const tabLength = this.getTabLength();
        this.contentParsed = {
            [this.systemname]: {
                sections: this.getNextElements(tabLength, 1, this.content)
            }
        }
        return this.contentParsed;
    }
    getNextElements(tabLength, col, content, id = "") {
        const contentElements = this.getNextContent(tabLength, col, content);
        //console.log("contentElements", contentElements.length);
        let elements = contentElements.map((contentElement, i) => {
            const block = {
                id: id + col + "." + (i + 1).toString(),
                col,
                row: i + 1,
                section: contentElement[0].trim(),
                childrens: this.getNextElements(tabLength, col + 1, contentElement, id + col + "." + (i + 1).toString() + "-")
            };
            return block;
        });
        return elements;
    }
    getNextContent(tabLength, col, content) {
        let contentElements = [];
        const searchLength = (tabLength * col);
        //console.log("searchLength", searchLength);
        let contentFromElement = [];
        let search = false;

        content.forEach((line, i) => {
            if (line.match(`^\\s{${searchLength}}\\S+`)) {
                search = true;

            }
            if (search) {
                contentFromElement.push(line);
                if ((content.length > i + 1 && content[i + 1].match(`^\\s{${searchLength}}\\S+`)) || content.length == i + 1) {
                    //console.log("contentFromElement2", contentFromElement, i);
                    search = false;
                    contentElements.push(contentFromElement);
                    contentFromElement = [];
                }
            }

        });

        return contentElements;
    }


    parseContent_alt() {
        const tabLength = this.getTabLength();
        const rootElements = this.getRootElements();
        this.contentParsed = rootElements.map((rootElement) => {
            return {
                [rootElement.section]: {
                    id: rootElement.id,
                    col: rootElement.col,
                    row: rootElement.row,
                    childrens: this.getSectionChildrens(rootElement)
                }
            }
        });
        return this.contentParsed;
    }
    getSystemName() {
        return this.systemname;
    }
    getElementsFromParent(system, parent, parentPosition) {
        return "getElementsFromParent";
    }

    getSectionChildrens(parentElement) {
        const tabLength = this.getTabLength();
        const accCol = parentElement.col;
        let row = 1;
        const elements = this.content.map((line, i) => {
            const searchLength = (tabLength * (accCol + 1));
            if (line.match(`^\\s{${searchLength}}\\S+`)) {
                const block = { id: "1" + row.toString(), col: accCol + 1, row, section: line.trim() };
                row++;
                return block;
            }
        }).filter((el) => el != undefined);
        console.log("elements", elements);
        return elements;
    }
    getSectionContent(parentElement) { }
    getRootElements() {
        const tabLength = this.getTabLength();
        let row = 1;
        const rootElements = this.content.map((line, i) => {
            let lineMatch = line.match(`^\\s{${tabLength}}(\\S+):$`);
            //lineMatch && console.log("lineMatch", lineMatch[1]);
            if (lineMatch) {
                const block = { id: "1" + row.toString(), col: 1, row, section: lineMatch[1] };
                row++;
                return block;
            }
        }).filter((el) => el != undefined);
        //console.log("rootElements", rootElements);
        return rootElements;
    }
    getTabLength() {
        let status = true;
        let row = 0;
        let tabLength = 0;
        while (status) {
            let allRowsEmpty = true;
            this.content.forEach((line, i) => {
                if (i == 0) return;
                if (line[row] != " ") {
                    allRowsEmpty = false;
                    tabLength = row;
                }
            });
            if (!allRowsEmpty) {
                status = false;
            }
            row++;
        }
        return tabLength;
    }
}