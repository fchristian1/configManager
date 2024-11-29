
export function getSystemName(fileContent) {
    const lines = fileContent.split('\n');
    //console.log("lines", lines);
    const contextLine = lines.find(line => line.trim().startsWith('{{') && line.includes('}}:'));
    if (!contextLine) {
        return null;
    }
    const name = contextLine.match(/{{(.*?):(.*?)}}:/);
    //console.log("name", name[1]);
    return name[2];
}
export function getSystemType(fileContent) {
    const lines = fileContent.split('\n');
    //console.log("lines", lines);
    const contextLine = lines.find(line => line.trim().startsWith('{{') && line.includes('}}:'));
    if (!contextLine) {
        return null;
    }
    const name = contextLine.match(/{{(.*?):(.*?)}}:/);
    //console.log("name", name[1]);
    return name[1];
}
export function getSystemContent(fileContent) {
    const lines = fileContent.split('\n');
    const content = lines.filter((line) => (!line.startsWith('#') && line != ""));
    return content;
}