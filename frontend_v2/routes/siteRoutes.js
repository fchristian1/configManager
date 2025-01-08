const __dirname = process.cwd();


export const guideRoute = (req, res) => {
    res.sendFile(`${__dirname}/page/guide/guide.html`);
}

export const managerRoute = (req, res) => {
    res.sendFile(`${__dirname}/page/manager/manager.html`);
}
export const managerDashRoute = (req, res) => {
    res.sendFile(`${__dirname}/page/manager/dash/dash.html`);
}
//manager projects
export const managerProjectsRoute = (req, res) => {
    res.sendFile(`${__dirname}/page/manager/projects/projects.html`);
}

//manager servers
export const managerServersRoute = (req, res) => {
    res.sendFile(`${__dirname}/page/manager/servers/servers.html`);
}
//manager files
export const managerFilesRoute = (req, res) => {
    res.sendFile(`${__dirname}/page/manager/files/files.html`);
}