import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const dataProjectPath = path.join("./data/instances/");

export class Instance {
    constructor({ data }) {
        this.data = data;
        this.servicePath = path.join(dataProjectPath, data.id);
        if (!this.checkIfPathExists(this.servicePath)) {
            this.createPath(this.servicePath);
        }

        // async Methode wird nach dem Konstruktor gestartet
        this.loadModules().catch(console.error);
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
    getId() {
        return this.data._id;
    }

    async loadModules({ data } = {}) {
        if (data) this.data = { ...this.data, ...data };
        const status = this.data.status;
        const moduleName = this.data.instanceType?.link.split(":")[1];
        const workfolderPath = path.join("./src/services/instances/modules/", moduleName, "workfolder");
        if (status === "Active" && moduleName) {
            this.copyAllFilesAndFoldersFromTo(workfolderPath, this.servicePath);
            console.log("start terraform");
            const envVars = {
                ...process.env,
                AWS_ACCESS_KEY_ID: "---",
                AWS_SECRET_ACCESS_KEY: "---",
                AWS_SESSION_TOKEN: "---"


            };
            await this.commandOnTerminal('./create.sh', [this.data.id], {
                cwd: path.join(this.servicePath, 'terraform'), env: envVars
            });
            console.log("end terraform");
        }
        if (status === "Inactive" && moduleName) {
            const envVars = {
                ...process.env,
                AWS_ACCESS_KEY_ID: "---",
                AWS_SECRET_ACCESS_KEY: "-",
                AWS_SESSION_TOKEN: "---"


            };
            await this.commandOnTerminal('./destroy.sh', [this.data.id], {
                cwd: path.join(this.servicePath, 'terraform'), env: envVars
            });
        }

    }

    copyAllFilesAndFoldersFromTo(from, to) {
        this.copyRecursiveSync(from, to);
    }

    copyRecursiveSync(src, dest) {
        const stat = fs.statSync(src);

        if (stat.isDirectory()) {
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
            }

            for (const item of fs.readdirSync(src)) {
                const srcPath = path.join(src, item);
                const destPath = path.join(dest, item);
                this.copyRecursiveSync(srcPath, destPath);
            }
        } else {
            fs.copyFileSync(src, dest);
        }
    }

    getFilesAndFolders(path) {
        return fs.readdirSync(path);
    }

    async commandOnTerminal(command, args = [], options = {}) {
        return new Promise((resolve, reject) => {
            const child = spawn(command, args, {
                shell: true,
                stdio: ['inherit', 'pipe', 'pipe'],
                ...options
            });

            child.stdout.on('data', (data) => {
                process.stdout.write(data);
            });

            child.stderr.on('data', (data) => {
                process.stderr.write(data);
            });

            child.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Prozess mit Code ${code} beendet`));
                }
            });

            child.on('error', (err) => {
                reject(err);
            });
        });
    }
}
