import fs from 'fs';
import path from 'path';


export const dataPath = path.join("./data/", 'todos.json');
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, '[]');
}

export const getAll = (userId) => {
    const data = fs.readFileSync(dataPath, 'utf8');
    const todos = JSON.parse(data);
    return todos.filter(todo => todo.userId === userId);
};

export const saveAll = (data, userId) => {

    const allData = fs.readFileSync(dataPath, 'utf8');
    const allTodos = JSON.parse(allData);
    const newTodos = allTodos.filter(todo => todo.userId !== userId);
    newTodos.push(...data);
    fs.writeFileSync(dataPath, JSON.stringify(newTodos, null, 2));
}