import fs from 'fs';

export function getListOfFiles(path, extension) {
    return fs.readdirSync(path).filter(file => file.endsWith(extension));
}
export function getFileContent(path) {
    return fs.readFileSync(path, 'utf8');
}