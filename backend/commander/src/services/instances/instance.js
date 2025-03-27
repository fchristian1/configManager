import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import { findOne } from '../../db/mongo.js';



export class Instance {
    constructor({ data }) {
        this.data = data;
        this.dataProjectPath = path.join("./data/instances");


        // async Methode wird nach dem Konstruktor gestartet
        this.loadModules({ data }).catch(console.error);
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
    getDbId() {
        return this.data.id;
    }

    async loadModules({ data } = {}) {
        console.log("loadModules", 1, data);
        if (data) this.data = { ...this.data, ...data };
        console.log("loadModules", 2, this.data);
        this.servicePath = path.join(this.dataProjectPath, this.data.id);
        this.createPath(this.servicePath);
        if (this.data.instanceType) {
            let moduleName = this.data.instanceType?.link.split(":")[1];
            if (moduleName && moduleName == "aws-ec2") await this.instanceTypeAWSEC2(this.data, this.servicePath);
            moduleName = this.data.repositoryType?.link.split(":")[1];
            if (moduleName && moduleName == "github") await this.repositoryTypeGithub(this.data, this.servicePath);
            moduleName = this.data.scriptType?.link.split(":")[1];
            if (moduleName && moduleName == "script-command") await this.scriptTypeScriptCommand(this.data, this.servicePath);
        }
    }
    async scriptTypeScriptCommand(data, servicePath) {
        const status = data.status;
        if (status === "Inactive") {
        } else {
            const scriptPath = data.scriptType?.path;
            const scriptCommand = data.scriptType?.command;
            const envVars = {
                ...process.env
            };
            console.log("start script-command");
            await this.commandOnTerminal('ansible-playbook', ["-i", "inventory", "script_command.yaml", "-e", "path='" + scriptPath + "'", "-e", "command='" + scriptCommand + "'"], {
                cwd: path.join(servicePath, 'terraform/ansible_playbooks/'), env: envVars
            });
            console.log("stop script-command");
        }
    }
    async repositoryTypeGithub(data, servicePath) {
        console.log("instanceTypeGithub", 1);
        const repositoryUrl = data.repositoryType?.url;
        console.log("instanceTypeGithub", 2, "repositoryUrl", repositoryUrl);
        const repositoryBranch = data.repositoryType?.branch;
        const status = data.status;
        if (status === "Inactive") {
        } else {
            //ansible-playbook clone_repo.yml -e "repository_url=https://github.com/user/repository.git"
            const envVars = {
                ...process.env
            };
            console.log("start install node");
            await this.commandOnTerminal('ansible-playbook', ["-i", "inventory", "node.yaml", "-e", "node_version=" + ""], {
                cwd: path.join(servicePath, 'terraform/ansible_playbooks/'), env: envVars
            });
            console.log("stop install node");

            console.log("start github_clone");
            await this.commandOnTerminal('ansible-playbook', ["-i", "inventory", "github_clone.yaml", "-e", "repository_url=" + repositoryUrl, "-e", "repository_branch='" + repositoryBranch + "'"], {
                cwd: path.join(servicePath, 'terraform/ansible_playbooks/'), env: envVars
            });
            console.log("stop github_clone");
        }
    }
    async instanceTypeAWSEC2(data, servicePath) {
        //console.log("instanceTypeAWSEC2", 1);
        const moduleName = data.instanceType?.link.split(":")[1];
        const instanceId = data.instanceType?.instanceId;
        const instanceType = data.instanceType?.instanceType;
        const instanceRegion = data.instanceType?.region;

        // console.log("moduleName", 3, moduleName);


        // console.log("servicePath", 4, this.servicePath); 
        if (!moduleName) {
            //console.log(11111);
            //console.log("deleteAllInFolders", servicePath);
            this.deleteAllInFolders(servicePath);
            return;
        } else {
            //console.log(2222);

            const status = data.status;
            const workfolderPath = path.join("./src/services/instances/modules/", moduleName, "workfolder");
            await this.copyAllFilesAndFoldersFromTo(workfolderPath, servicePath);
            const credentials = await this.getCredentials(data.instanceType?.credentials ?? "");
            await this.createCerdFile(credentials, path.join(servicePath, 'terraform', 'cred'));
            if (status === "Active" && moduleName) {
                console.log("start terraform aktiv");
                const envVars = {
                    ...process.env
                };
                console.log("start terraform", servicePath);
                await this.commandOnTerminal('./create.sh', [data.id, instanceId, instanceType, instanceRegion], {
                    cwd: path.join(servicePath, 'terraform'), env: envVars
                });
                console.log("end terraform");
                console.log("start waiting for reaching", servicePath);
                await this.commandOnTerminal('ansible-playbook', ["-i", "inventory", "ping_wait.yaml"], {
                    cwd: path.join(servicePath, 'terraform/ansible_playbooks/'), env: envVars
                });
                console.log("succsellfully reached", servicePath);
            }
            if (status === "Inactive" && moduleName) {
                const envVars = {
                    ...process.env
                };
                console.log("start terraform inaktiv");
                console.log("start terraform", servicePath);
                await this.commandOnTerminal('./destroy.sh', [data.id, instanceId, instanceType, instanceRegion], {
                    cwd: path.join(servicePath, 'terraform'), env: envVars
                });
                console.log("end terraform");
            }
        }

    }

    async getCredentials(id) {
        if (!id || id === "") return;
        const res = await findOne("credentials", id);
        const data = res.keyvalue.data.map(data => ({ [data.key]: data.value }));

        return data;
    }
    async createCerdFile(credentialsList, pathFolder) {
        const data = ["[default]"];
        credentialsList.forEach(credential => {
            const key = Object.keys(credential)[0];
            const value = Object.values(credential)[0];
            data.push(`${key} = "${value}"`);
        }
        );
        const content = data.join("\n");
        //create file

        fs.writeFileSync(pathFolder, content);
    }
    deleteAllInFolders(folderPath) {
        // Lösche alle Inhalte im Ordner
        fs.readdirSync(folderPath).forEach((file) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                // Rekursiv Ordner löschen
                this.deleteAllInFolders(curPath);
            } else {
                // Datei löschen
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
    }

    async copyAllFilesAndFoldersFromTo(from, to) {
        await this.copyRecursiveforEachAsync(from, to);
    }

    async copyRecursiveforEachAsync(src, dest) {
        const stat = await fsPromises.stat(src);

        if (stat.isDirectory()) {
            if (!fs.existsSync(dest)) {
                await fsPromises.mkdir(dest, { recursive: true });
            }

            const items = await fsPromises.readdir(src);
            for (const item of items) {
                const srcPath = path.join(src, item);
                const destPath = path.join(dest, item);
                await this.copyRecursiveforEachAsync(srcPath, destPath);
            }
        } else {
            await fsPromises.copyFile(src, dest);
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
                    resolve(new Error(`Prozess mit Code ${code} beendet`));
                }
            });

            child.on('error', (err) => {
                resolve(err);
            });
        });
    }
}
