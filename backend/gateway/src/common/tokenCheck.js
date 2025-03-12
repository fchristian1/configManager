import { apifetch } from "../apifetch.js";

export async function tokenCheckFetch(token) {
    try {
        let response = await apifetch('auth', 'v1', '/token', null, { method: 'POST', headers: { 'Authorization': token } })
        if (response.message === 'ok') {
            return true;
        }
        return false;
    } catch (err) {
        console.error(err);
        return false;
    }
}