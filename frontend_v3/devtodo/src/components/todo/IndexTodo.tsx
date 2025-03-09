import { JSX, useState } from "react";
import { TodoItem } from "./TodoItem";
import { TodoAdd } from "./TodoAdd";

export type Todo = {
    id: number;
    parent: number;
    title: string;
    done: boolean;
};

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
    ] as Todo[]);
    const getTodosByParentId = (parent: number) => {
        return todos.filter((todo) => todo.parent === parent);
    };
    const showTodos = (parent: number, level: number): JSX.Element => {
        const todos = getTodosByParentId(parent);
        return (
            <>
                {todos.map((t) => {
                    const childes = showTodos(t.id, level + 1);
                    return (
                        <div key={t.id}>
                            <div className="row" style={{ marginLeft: level * 16, display: "flex", alignItems: "center" }}>
                                <TodoAdd></TodoAdd>
                                <TodoItem todo={t}></TodoItem>
                            </div>
                            {childes}
                        </div>
                    );
                })}
            </>
        );
    };
    return <div className="border border-gray-300 rounded min-w-[768px]">{showTodos(0, 0)}</div>;
}
