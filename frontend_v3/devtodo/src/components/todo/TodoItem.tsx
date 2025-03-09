import React from "react";
import { TodoDelete } from "./TodoDelete";

type TodoItemProps = {
    children?: React.ReactNode;
    todo: any;
};

export function TodoItem({ children, todo }: TodoItemProps) {
    return (
        <div style={{ marginLeft: 16, marginTop: 8 }}>
            <div className="row" style={{ display: "flex", alignItems: "center" }}>
                <div>
                    <input type="checkbox" name="" id="" />
                </div>
                <div style={{ marginLeft: 16 }}>{todo.title}</div>
                <TodoDelete todo={todo}></TodoDelete>
            </div>
            {children}
        </div>
    );
}
