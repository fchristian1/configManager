import { tokenCheckFetch } from "./common/tokenCheck.js";

const apis = [
    { name: 'todos', url: 'http://backend_todos:3000', token: true, },
    { name: 'auth', url: 'http://backend_auth:3000', token: false, }
];

export async function apifetch(apiname, apiversion, apipath, res, req) {
    const api = apis.find(api => api.name === apiname);
    if (!api) {
        console.error(`API ${apiname} not found`);
        return;
    }
    if (api.token) {
        const token = req.headers.authorization;
        if (!token) {
            console.error('No token');
            res.status(401).json({ message: "no token" });
            return;
        }

        const tokenCheck = await tokenCheckFetch(token);
        if (!tokenCheck) {
            console.error('Token check failed');
            res.status(401).json({ message: "nok" });
            return;
        }
    }
    const url = `${api.url}/api/${apiversion}/${apiname}${apipath}`;
    console.log(url);
    const request = {
        method: req.method,
        headers: { ...req.headers },
        body: req.body
    };
    delete request.headers['content-length'];

    return fetch(url, request)
        .then(res => res.json())
        .catch(err => console.error(err));
}