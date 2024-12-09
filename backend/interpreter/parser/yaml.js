import { Parser } from "./parser.js";
// tasks:
// parser anpassen auf neue sf links anpassen 
export class YAMLParser extends Parser {
    constructor(systemname, systemtype, content) {
        super(systemname, systemtype, content);
    }
    parseContent() {
        //console.log("content", this.content);

        const tabLength = this.getTabLength();
        //console.log("tabLength", tabLength);

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
            console.log("contentElement", contentElement);
            const block = {
                id: id + col + "." + (i + 1).toString(),
                col,
                row: i + 1,
                section: contentElement[0].trim(),
                childrens: this.getNextElements(tabLength, col + 1, contentElement, id + col + "." + (i + 1).toString() + "-")
            };
            //console.log("block", block);
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
    getTabLength() {
        let status = true;
        let row = 0;
        let tabLength = 0;
        while (status) {
            let allRowsEmpty = true;
            this.content.forEach((line, i) => {
                if (line[0] != " ") return;
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