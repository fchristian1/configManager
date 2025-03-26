import fs from 'fs';
import path from 'path';

const dataProjectPath = path.join("./data/credentials/");
export class Credential {
    constructor({ data }) {
        if (!this.checkIfPathExists(path.join(dataProjectPath, data.id))) {
            this.createPath(path.join(dataProjectPath, data.id));
        }
    }
    checkIfPathExists(path) {
        return fs.existsSync(path);
    }
    createPath(path) {
        fs.mkdirSync(path, { recursive: true });
    }
    deletePath(path) {
        fs.rmdirSync(path, { recursive: true });
    }
}