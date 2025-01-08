const __dirname = process.cwd();


export const adminRoute = (req, res) => {
    res.sendFile(`${__dirname}/page/admin/admin.html`);
}