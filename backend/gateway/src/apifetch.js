import { tokenCheckFetch } from "./common/tokenCheck.js";

const apis = [
    { name: 'todos', url: 'http://backend_todos:3000', token: true, protocol: "http" },
    { name: 'auth', url: 'http://backend_auth:3000', token: false, protocol: "http" },
    { name: 'manager', url: 'http://backend_manager:3000', token: true, protocol: "http" },
    { name: "controller", url: "http://backend_controller:3000", token: false, protocol: "http" },
    { name: 'commander', url: 'http://backend_commander:3000', token: false, protocol: "ws" },
];

export async function apifetch(apiname, apiversion, apipath, res, req) {
    const api = apis.find(api => api.name === apiname);
    if (!api) {
        res.status(404).json({ message: "API not found" });
        return Error(`API ${apiname} not found`);
    }

    if (api.token) {
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ message: "no token !" });
            return Error('No token');
        }

        const tokenCheck = await tokenCheckFetch(token);
        if (!tokenCheck) {
            res.status(401).json({ message: "no token!" });
            return Error('Token check failed');
        }

    }
    const url = `${api.url}/api/${apiversion}/${apiname}${apipath}`;
    if (api.protocol === "http") {
        const request = {
            method: req.method ?? null,
            headers: { ...req.headers ?? null },
            body: req.body ?? null,
        };
        delete request.headers['content-length'];

        return fetch(url, request)
            .then(res => res.json())
            .catch(err => console.error(err));
    }

}