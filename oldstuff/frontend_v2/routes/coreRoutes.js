const __dirname = process.cwd();


export const loginGet = (req, res) => {
    res.sendFile(`${__dirname}/page/login.html`);
}

export const loginPost = (req, res) => {
    console.log(req.body);
    res.send('POST request to the homepage');
}

export const registerGet = (req, res) => {
    res.sendFile(`${__dirname}/page/register.html`);
}

export const registerPost = (req, res) => {
    console.log(req.body);
    res.send('POST request to the homepage');
}