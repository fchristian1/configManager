import fs from 'fs';
import path from 'path';

export const dataPath = path.join("./data/", 'user.json');
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, '[]');
}

export const getAll = () => {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
};

export const saveAll = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}