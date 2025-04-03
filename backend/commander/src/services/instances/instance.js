import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import { findOne, insertOne } from '../../db/mongo.js';
import { spawn } from 'child_process';
import { sendToClient } from '../../../ws/websocket.js';



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

    async noError() {
        //console.log("☑️  noError", this.data.id);
        if (this.data.state.error && this.data.state.error.length > 0) {
            //console.log("❌ noError", this.data.id, this.data.state.error);
            return false;
        }
        //console.log("✅ noError", this.data.id);
        return true;
    }

    async showJSON(data) {
        console.log("showJSON", JSON.stringify(data, null, 2));
    }
    async loadModules({ data } = {}) {
        console.log("🪧  start loadModules", this.data.id);
        //console.log("loadModules", 1, data);
        if (data) this.data = { ...this.data, ...data };
        this.data.state = this.data.state ?? {};
        this.data.state.commander = "running";
        this.data.state.output = {};
        this.data.state.error = {};
        sendToClient('instance', this.data.id, this.data.state)
        await insertOne("instances", this.data.id, this.data) // Schreibe die Daten in die Datenbank
        //console.log("loadModules", 2, this.data);
        this.servicePath = path.join(this.dataProjectPath, this.data.id);
        this.createPath(this.servicePath);
        if (this.data.instanceType) {
            let moduleName = this.data.instanceType?.link.split(":")[1];
            if (moduleName && moduleName == "aws-ec2") {
                this.data = await this.instanceTypeAWSEC2(this.data, this.servicePath);


            }
            if (this.data.status == "Active") {

                if (await this.noError()) this.data = await this.instanceSoftware(this.data, this.servicePath);

                moduleName = this.data.repositoryType?.link.split(":")[1];
                if (moduleName && moduleName == "github" && this.data.status == "Active") {
                    if (await this.noError()) this.data = await this.repositoryTypeGithub(this.data, this.servicePath);
                }
                moduleName = this.data.scriptType?.link.split(":")[1];
                if (moduleName && moduleName == "script-command" && this.data.status == "Active") {
                    if (await this.noError()) this.data = await this.scriptTypeScriptCommand(this.data, this.servicePath);
                }
            }
        }
        console.log("🔚 finish loadModules", this.data.id);
        this.data.state.commander = "ready";
        sendToClient('instance', this.data.id, this.data.state)
        await insertOne("instances", this.data.id, this.data) // Schreibe die Daten in die Datenbank
    }
    async instanceSoftware(data, servicePath) {
        console.log("🪧  start instance-software", data.id);
        const status = data.status;
        const softwares = data.software.data ?? [];


        if (status === "Inactive") {

        } else {
            for (const software of softwares) {
                //console.log("ips", data.ips);
                //console.log("software", JSON.stringify(software, null, 2));
                const theSoftware = await findOne("software", software.objectId);
                //console.log("theSoftware", JSON.stringify(theSoftware, null, 2));
                const softwareEnvVars = theSoftware?.variables?.data?.map(data => ({ [data.key]: data.value })) ?? [];
                const envVars = {
                    ...process.env,
                    //variables
                    ...softwareEnvVars.reduce((acc, curr) => {
                        const key = Object.keys(curr)[0];
                        acc[key] = curr[key];
                        return acc;
                    }, {})
                };
                //console.log("envVars", JSON.stringify(envVars, null, 2));
                const files = theSoftware.file.data.map(data => ({ filename: data.filename, filecontent: data.filecontent }));
                //console.log("files", JSON.stringify(files, null, 2));
                for (const ip of data?.state?.ips) {
                    //url
                    //console.log("download url");
                    if (theSoftware.url) {
                        await this.commandOnTerminal(data, "software:download:" + ip, "ssh", ["-i", "./" + data.id + "_my_key.pem", "ubuntu@" + ip, "'cd " + theSoftware.path + ` && curl -O ${theSoftware.url}' && echo "Download completed"`], {
                            cwd: path.join(servicePath, 'terraform'), env: envVars
                        });

                    }
                    //git clone
                    //console.log("git clone");
                    if (theSoftware.githuburl) {
                        await this.commandOnTerminal(data, "software:gitclone:" + ip, "ssh", ["-i", "./" + data.id + "_my_key.pem", "ubuntu@" + ip, "' cd " + theSoftware.path + ` && git clone ${theSoftware.githuburl} && echo "Git clone completed"'`], {
                            cwd: path.join(servicePath, 'terraform'), env: envVars
                        });

                    }
                    //createFiles
                    //console.log("create files");
                    for (const file of files) {
                        const b64content = Buffer.from(file.filecontent).toString('base64');
                        //console.log("b64content", b64content);

                        await this.commandOnTerminal(data, "software:createfile:" + ip + ":" + file.filename, "ssh", [
                            "-i", `./${data.id}_my_key.pem`,
                            `ubuntu@${ip}`,
                            `bash -c "cd ${theSoftware.path} && echo '${b64content}' | base64 -d > ${file.filename} && chmod +x ${file.filename} && echo 'File created: ${file.filename}'"`
                        ], {
                            cwd: path.join(servicePath, 'terraform'),
                            env: envVars
                        });

                    }
                    //command  
                    //console.log("command");
                    if (theSoftware.command) {
                        await this.commandOnTerminal(data, "software:command:" + ip + ":" + theSoftware.path + ":" + theSoftware.command, "ssh", ["-i", "./" + data.id + "_my_key.pem", "ubuntu@" + ip, "'cd " + theSoftware.path + " && " + theSoftware.command + "'"], {
                            cwd: path.join(servicePath, 'terraform'), env: envVars
                        });

                    }
                }
            }
        }
        console.log("🔚 finish instance-software", data.id);
        return data;
    }
    async scriptTypeScriptCommand(data, servicePath) {
        console.log("🪧  start script-command", data.id);
        const status = data.status;
        if (status === "Inactive") {
        } else {
            const scriptPath = data.scriptType?.path;
            const scriptCommand = data.scriptType?.command;
            const envVars = {
                ...process.env
            };
            if (scriptPath && scriptCommand) {
                for (const ip of data?.state?.ips) {
                    await this.commandOnTerminal(data, "scriptcommand" + ip, "ssh", ["-i", "./" + data.id + "_my_key.pem", "ubuntu@" + ip, "'cd " + scriptPath + " && " + scriptCommand + "'"], {
                        cwd: path.join(servicePath, 'terraform'), env: envVars
                    });

                }
            }
        }
        console.log("🔚 finish script-command", data.id);
        return data;
    }
    async repositoryTypeGithub(data, servicePath) {
        console.log("🪧  start github_clone", data.id);
        //console.log("instanceTypeGithub", 1);
        const repositoryUrl = data.repositoryType?.url;
        //console.log("instanceTypeGithub", 2, "repositoryUrl", repositoryUrl);
        const repositoryBranch = data.repositoryType?.branch;
        const status = data.status;
        if (status === "Inactive") {
        } else {
            //ansible-playbook clone_repo.yml -e "repository_url=https://github.com/user/repository.git"
            const envVars = {
                ...process.env
            };

            await this.commandOnTerminal(data, "instance:github", 'ansible-playbook', ["-i", "inventory", "github_clone.yaml", "-e", "repository_url=" + repositoryUrl, "-e", "repository_branch='" + repositoryBranch + "'"], {
                cwd: path.join(servicePath, 'terraform/ansible_playbooks/'), env: envVars
            });

        }
        console.log("🔚 finish github_clone", data.id);
        return data;
    }
    async instanceTypeAWSEC2(data, servicePath) {
        console.log("🪧  Start AWS EC2", data.id);
        const moduleName = data.instanceType?.link.split(":")[1];
        const instanceId = data.instanceType?.instanceId;
        const instanceType = data.instanceType?.instanceType;
        const instanceCount = data.instanceType?.instanceCount;
        const instanceRegion = data.instanceType?.region;
        //[
        // {
        //     "id": "2f2d5f34-79f6-4ce9-a8c9-78d8127820a1",
        //     "name": "ssh",
        //     "portin": "22",
        //     "portout": "22",
        //     "protocol": "tcp",
        //     "cidr": "0.0.0.0/0"
        //   },
        //   {
        //     "id": "55f6e8d1-d4d5-4b39-80ea-a4b9c9112c74",
        //     "name": "http",
        //     "portin": "80",
        //     "portout": "80",
        //     "protocol": "tcp",
        //     "cidr": "0.0.0.0/0"
        //   }
        // ]
        // to name:portin:portout:protocol:cidr,name:portin:portout:protocol:cidr, ...
        const ports = data.instanceType?.port?.map(port => {
            return port.name + ":" + port.portin + ":" + port.portout + ":" + port.protocol + ":" + port.cidr;
        }).join(",") ?? "";

        // console.log("moduleName", 3, moduleName);


        // console.log("servicePath", 4, this.servicePath); 
        if (!moduleName) {
            //console.log(11111);
            //console.log("deleteAllInFolders", servicePath);
            this.deleteAllInFolders(servicePath);
            await insertOne("instances", data.id, data)
            return Promise.resolve();
        } else {
            //console.log(2222);

            const status = data.status;
            const workfolderPath = path.join("./src/services/instances/modules/", moduleName, "workfolder");
            await this.copyAllFilesAndFoldersFromTo(workfolderPath, servicePath);
            const credentials = await this.getCredentials(data.instanceType?.credentials ?? "");

            if (credentials && credentials != "") await this.createCerdFile(credentials, path.join(servicePath, 'terraform', 'cred'));
            if (status === "Active" && moduleName) {
                console.log("🪧  start instance aktiv", data.id);
                const envVars = {
                    ...process.env
                };
                console.log("🪧  start instance", data.id, servicePath);
                await this.commandOnTerminal(data, "instance:create", './create.sh', [data.id, instanceId, instanceType, instanceRegion, instanceCount, ports], {
                    cwd: path.join(servicePath, 'terraform'), env: envVars
                });

                console.log("🔚 finish instance");
                console.log("🪧  start checkIps", data.id)
                const ipsFile = path.join(servicePath, 'terraform', 'ips');
                if (!fs.existsSync(ipsFile)) {
                    console.log("❌ stop checkIps noIps", data.id)
                    data.state = { ...data.state, ips: [], error: { ...data.error, instanceStart: "error" } };
                    //await this.showJSON(data);
                    sendToClient('instance', data.id, data.state)
                    await insertOne("instances", data.id, data)
                    return data;
                }
                const ips = fs.readFileSync(ipsFile, 'utf-8').split('\n');
                const ipsArray = ips.map(ip => ip.trim()).filter(ip => ip !== '');
                data.state = { ...data.state, ips: ipsArray };
                //await this.showJSON(data);
                console.log("🔚 finish checkIps", data.id);
                //console.log("data", JSON.stringify(data, null, 2));
                console.log("🪧  start waiting for reaching", data.id, servicePath);
                sendToClient('instance', data.id, data.state)
                await insertOne("instances", data.id, data)
                await this.commandOnTerminal(data, "instance:check", 'ansible-playbook', ["-i", "inventory", "ping_wait.yaml"], {
                    cwd: path.join(servicePath, 'terraform/ansible_playbooks/'), env: envVars
                });

                console.log("✅ succsellfully reached", servicePath);
            }
            if (status === "Inactive" && moduleName) {
                const envVars = {
                    ...process.env
                };
                console.log("🪧  start instance inaktiv", data.id);
                console.log("🪧  start instance", data.id, servicePath);
                await this.commandOnTerminal(data, "instance:create", './destroy.sh', [data.id, instanceId, instanceType, instanceRegion, instanceCount, ports], {
                    cwd: path.join(servicePath, 'terraform'), env: envVars
                });

                console.log("🔚 finish instance");
                data.state.ips = [];
                fs.rmSync(path.join(servicePath, 'terraform', 'ips'), { force: true });
                fs.rmSync(path.join(servicePath, 'terraform', 'ansible_playbooks', 'inventory'), { force: true });
                //console.log("data", JSON.stringify(data, null, 2));
                sendToClient('instance', data.id, data.state)
                await insertOne("instances", data.id, data)

            }
        }
        console.log("🔚 finish AWS EC2", data.id);
        return data;
    }

    async getCredentials(id) {
        if (!id || id === "") return Promise.resolve();
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

    async commandOnTerminal(data, type, command, args = [], options = {}) {
        data.state = data.state ?? {};
        data.state.output = data.state.output ?? {};
        data.state.output = { ...data.state.output }
        data.state.output[type] = { ...data.state.output[type] ?? { normal: [], error: [] } };

        return new Promise((resolve, reject) => {
            const child = spawn(command, args, {
                shell: true,
                stdio: ['inherit', 'pipe', 'pipe'],
                ...options
            });

            let stdoutData = [];
            let stderrData = [];

            child.stdout.on('data', (d) => {
                const output = d.toString();
                stdoutData.push(output); // Sammle stdout-Daten
                data?.state?.output[type]?.normal?.push(output);
                sendToClient('instance', data.id, data.state)

            });

            child.stderr.on('data', (d) => {
                const output = d.toString();
                stderrData.push(output); // Sammle stderr-Daten
                data?.state?.output[type]?.error?.push(output);
                sendToClient('instance', data.id, data.state)
            });

            child.on('close', async (code) => {
                console.log(`ℹ️  Process exited with code ${code}`, data.id);
                try {
                    //console.log("🍀🍀🍀🍀stdoutData", stdoutData, "🍀🍀🍀🍀");
                    data.state.output[type].normal = stdoutData
                    //console.log("🍀🍀🍀🍀stderrData", stderrData, "🍀🍀🍀🍀");
                    data.state.output[type].error = stderrData
                    await Promise.all([
                        insertOne("instances", data.id, data), // Schreibe die Daten in die Datenbank
                    ]);
                } catch (err) {
                    console.error("❌ Error writing to database:", data.id, err);
                }

                if (code === 0) {
                    resolve();
                } else {
                    resolve(`ℹ️ Process exited with code ${code}`, data.id);
                }
            });

            child.on('error', (err) => {
                console.error("❌ Error spawning process:", data.id, err);
                resolve(err);
            });
        });
    }
}
