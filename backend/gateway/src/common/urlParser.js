export function urlParser(url) {
    const apiversion = url.match(/\/api\/(v[0-9])\//)[1];
    const apiname = url.match(/\/api\/v[0-9]\/([a-zA-Z]*)/)[1];
    const apipath = url.match(/\/api\/v[0-9]\/[a-zA-Z]*(\/.*)/)?.[1] ?? "";
    return { apiname, apiversion, apipath };
}