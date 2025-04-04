import React, { useEffect } from "react";
import { Todo } from "./IndexTodo";
import test from "node:test";

type TodoItemProps = {
    children?: React.ReactNode;
    todo: any;
    edit: any;
    setEdit: any;
    handleEditTodo: any;
    childsDone: any;
    color: string;
};

export function TodoItem({
    children,
    childsDone,
    todo,
    edit,
    setEdit,
    handleEditTodo,
    color,
}: TodoItemProps) {
    const handleChangeSave = (todo: Todo) => {
        handleEditTodo(todo) && setEdit(null);
    };
    useEffect(() => {
        //get HTML element by id title and focus and mark it
        const title = document.getElementById("title");
        title && (title as HTMLInputElement).focus();
        title && (title as HTMLInputElement).select();
    }, []);
    return (
        <div className="flex items-center w-full">
            <div className="flex flex-row gap-2 w-full text-nowrap">
                <div className="flex justify-center items-center w-7 h-7">
                    <input
                        onChange={() => {
                            todo.done = !todo.done;
                            handleChangeSave(todo);
                        }}
                        disabled={!childsDone}
                        checked={todo.done}
                        className="w-7 h-7"
                        type="checkbox"
                        name=""
                        id=""
                    />
                </div>
                {edit != todo && !todo.done && todo.title == "" && (
                    <div
                        className={
                            color +
                            " flex items-center ml-1 w-full h-7 hover:text-amber-800"
                        }
                        onClick={() => setEdit(todo)}
                    >
                        ---
                    </div>
                )}
                {edit != todo && !todo.done && (
                    <div
                        className={
                            color +
                            " flex items-center ml-1 w-full h-7 hover:text-amber-800"
                        }
                        onClick={() => setEdit(todo)}
                    >
                        {todo.title}
                    </div>
                )}
                {edit != todo && todo.done && (
                    <div
                        className={
                            color +
                            " flex items-center ml-1 w-full h-7 hover:text-amber-800"
                        }
                        onClick={() => setEdit(todo)}
                    >
                        {todo.title}
                    </div>
                )}
                {edit == todo && (
                    <>
                        <input
                            id="title"
                            type="text"
                            className="bg-white w-full h-7"
                            onChange={(e) => {
                                todo.title = e.target.value;
                            }}
                            onBlur={() => handleChangeSave(todo)}
                            onMouseOver={(e) => {
                                (e.target as HTMLInputElement).focus();
                                (e.target as HTMLInputElement).select();
                            }}
                            onKeyDown={(e) => {
                                e.key === "Enter" && handleChangeSave(todo);
                            }}
                            defaultValue={todo.title}
                        />
                        <button
                            className="flex justify-center items-center bg-gray-200 hover:bg-gray-400 border border-gray-500 hover:border-amber-500 rounded w-7 h-7 aspect-square"
                            onClick={() => handleChangeSave(todo)}
                        >
                            OK
                        </button>
                    </>
                )}
            </div>
            {children}
        </div>
    );
}
