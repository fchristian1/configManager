import { Parser } from "./parser.js";
// tasks:
// parser anpassen auf neue sf links anpassen 
export class YAMLParser extends Parser {
    constructor(systemname, systemtype, content) {
        super(systemname, systemtype, content);
    }
    parseContent() {
        //console.log("content", this.content);
        //console.log("tabLength", tabLength);

        this.contentParsed =
            this.getAnkers(this.content).map((anker, i) => {
                const id = i + 1;
                anker.id = id;
                return {
                    [anker.name]: {
                        id: id.toString(),
                        sections: this.getAnkerSections(anker)
                    }
                }
            })

        return this.contentParsed;
    }
    getAnkers(content) {
        let ankers = [];
        let serchForContent = false;
        content.forEach((line, i) => {
            if (serchForContent) {
                if (line.includes("{{{") && line.includes("}}}")) {
                    serchForContent = false;
                } else {
                    if (line.trim() != "") {
                        ankers[ankers.length - 1].content.push(line);
                    }
                }
            }
            if (line.includes("{{{") && line.includes("}}}")) {
                ankers.push(
                    {
                        name: line.match(/^{{{(.*?):(.*?)}}}$/)[2],
                        content: []
                    });
                serchForContent = true;
            }
        });
        //console.log("ankers", ankers);
        return ankers;
    }
    getAnkerSections(anker) {
        let sections = [];
        sections = this.getSections(anker.content, anker.id, 1);
        return sections;
    }
    getSections(section, parentId, c) {
        let sections = [];

        const tabLength = this.getTabLength();
        let col = c * tabLength;
        let idI = 1;
        section.forEach((line, i) => {
            let hasChildrens = false;
            let childeContent = [];
            if (line.trim() == "") return;
            if (line.match(`^\\s{${col}}\\S+`) == null) return;
            if (section.length > i + 1 && section[i + 1].match(`^\\s{${col + tabLength}}\\S+`) != null) {
                hasChildrens = true;
                let search = true;
                let j = i + 1;
                while (search) {
                    childeContent.push(section[j]);
                    j++;
                    if (section.length == j || section[j].match(`^\\s{${col}}\\S+`) != null) {
                        search = false;
                    }
                }
            } else {
                hasChildrens = false;
            }
            if (line[col + 1] != " ") {
                let id = parentId + "." + idI;
                let childrens = hasChildrens ? this.getSections(childeContent, id, c + 1) : [];
                sections.push({
                    id,
                    section: line.trim(),
                    options: { hasChildrens },
                    childrens,
                });
                idI++;
            };
        });
        return sections;
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