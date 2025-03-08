import { useState } from "react";
export function IndexTodo() {
    const [todos, setTodos] = useState([
        { id: 1, parent: 0, title: "Todo 1", done: false },
        { id: 2, parent: 0, title: "Todo 2", done: false },
        { id: 3, parent: 1, title: "Todo 3", done: false },
        { id: 4, parent: 3, title: "Todo 4", done: false },
        { id: 5, parent: 3, title: "Todo 5", done: false },
        { id: 6, parent: 2, title: "Todo 6", done: false },
        { id: 7, parent: 2, title: "Todo 7", done: false },
        { id: 8, parent: 7, title: "Todo 8", done: false },
        { id: 9, parent: 8, title: "Todo 9", done: false },
    ]);
    return <>TodoListe</>;
}
