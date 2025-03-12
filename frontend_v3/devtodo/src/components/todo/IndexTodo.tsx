import { JSX, useEffect, useState } from "react";
import { TodoItem } from "./TodoItem";
import { TodoAdd } from "./TodoAdd";
import { TodoDelete } from "./TodoDelete";
import { IconChevronDown } from "../icons/ChevronDown";
import { IconChevronRight } from "../icons/ChevronRight";
import { v4 as uuid } from "uuid";
import { getAll, saveAll } from "../../apiConnector";
import { IconArrowDown } from "../icons/ArrowDown";
import { IconArrowUp } from "../icons/ArrowUp";

export type Todo = {
    id: any;
    parent: number;
    title: string;
    done: boolean;
    open: boolean;
    position: number;
    userId: string;
};

export function IndexTodo() {
    useEffect(() => {
        (async function get() {
            const todos = await getAll();
            setTodos(todos);
        })();
    }, []);
    const [todos, setTodos] = useState([
        // { id: 1, parent: 0, title: "Todo 1", done: false, open: true },
        // { id: 2, parent: 0, title: "Todo 2", done: false, open: true },
        // { id: 3, parent: 1, title: "Todo 3", done: false, open: true },
        // { id: 4, parent: 3, title: "Todo 4", done: false, open: true },
        // { id: 5, parent: 3, title: "Todo 5", done: false, open: true },
        // { id: 6, parent: 2, title: "Todo 6", done: false, open: true },
        // { id: 7, parent: 2, title: "Todo 7", done: false, open: true },
        // { id: 8, parent: 7, title: "Todo 8", done: false, open: true },
        // { id: 9, parent: 8, title: "Todo 9", done: false, open: true },
    ] as Todo[]);
    const [edit, setEdit] = useState<Todo | null>(null);
    const [deleteQuestion, setDeleteQuestion] = useState<Todo | null>(null);

    const isChildesDone = (parent: number) => {
        const todos = getTodosByParentId(parent);
        if (todos.length > 0) return todos.every((t) => t.done);
        if (todos.length == 0) return true;
        return false;
    };
    const handleSetTodos = (todos: Todo[]) => {
        saveAll(todos).then(() => setTodos(todos));
    };
    const handleEditTodo = (todo: Todo) => {
        console.log(todo);
        const newTodos = todos.map((t) => {
            if (t.id === todo.id) {
                return todo;
            }
            return t;
        });
        handleSetTodos(newTodos);
        return true;
    };
    const handleNewTodo = (parentId: any) => {
        const newTodo = {
            id: uuid(),
            userId: "1",
            parent: parentId,
            title: "New Todo",
            done: false,
            open: true,
            position: getTodosByParentId(parentId).length,
        };
        setEdit(newTodo);
        handleSetTodos([
            ...todos.map((t) => {
                if (parentId == t.id) t.open = true;
                return t;
            }),
            newTodo,
        ]);
    };
    const handleDeleteTodo = (todo: Todo) => {
        setDeleteQuestion(todo);
    };
    const handleDeleteTodo2 = (todo: Todo) => {
        const newTodos = todos.filter((t) => t.id !== todo.id);
        handleSetTodos(newTodos);
        setDeleteQuestion(null);
    };
    const handleOpenCloseTodo = (todo: Todo) => {
        handleSetTodos(
            todos.map((t) => {
                if (t.id === todo.id) {
                    t.open = !t.open;
                }
                return t;
            })
        );
    };
    const handleSortUp = (todo: Todo) => {
        if (todo.position == 0) return;

        const todoToReplace = todos.find((t) => t.parent === todo.parent && t.position === todo.position - 1);
        if (!todoToReplace) return;

        const todoToGoUp = { ...todo, position: todo.position - 1 };
        const updatedTodoToReplace = { ...todoToReplace, position: todoToReplace.position + 1 };

        const newTodos = todos.map((t) => {
            if (t.id === todoToReplace.id) {
                return updatedTodoToReplace;
            }
            if (t.id === todo.id) {
                return todoToGoUp;
            }
            return t;
        });

        handleSetTodos(newTodos);
    };
    const handleSortDown = (todo: Todo) => {
        const todosByParent = getTodosByParentId(todo.parent);
        if (todo.position == todosByParent.length - 1) return;

        const todoToReplace = todos.find((t) => t.parent === todo.parent && t.position === todo.position + 1);
        if (!todoToReplace) return;

        const todoToGoDown = { ...todo, position: todo.position + 1 };
        const updatedTodoToReplace = { ...todoToReplace, position: todoToReplace.position - 1 };

        const newTodos = todos.map((t) => {
            if (t.id === todoToReplace.id) {
                return updatedTodoToReplace;
            }
            if (t.id === todo.id) {
                return todoToGoDown;
            }
            return t;
        });

        handleSetTodos(newTodos);
    };

    const getTodosByParentId = (parent: number) => {
        return todos.filter((todo) => todo.parent === parent).sort((a, b) => a.position - b.position);
    };
    const showTodos = (parent: number, level: number): JSX.Element => {
        const todos = getTodosByParentId(parent);
        return (
            <>
                {todos.map((t) => {
                    const children = showTodos(t.id, level + 1);
                    const childrenLength = children.props.children.length;
                    return (
                        <div key={t.id}>
                            <div className="flex items-center hover:bg-gray-300 p-2 border hover:border-gray-400 border-transparent rounded w-full row">
                                <div className="flex items-center gap-1 w-full row" style={{ marginLeft: level * 16 }}>
                                    <TodoAdd handleNewTodo={handleNewTodo} parentId={t.id}></TodoAdd>

                                    {childrenLength == 0 && <div className="flex justify-center items-center w-7 h-7"></div>}
                                    {childrenLength > 0 && (
                                        <div
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleOpenCloseTodo(t)}
                                            className="flex justify-center items-center h-7"
                                        >
                                            <div className="hover:text-amber-500">
                                                {t.open && <IconChevronDown></IconChevronDown>}
                                                {!t.open && <IconChevronRight></IconChevronRight>}
                                            </div>
                                        </div>
                                    )}
                                    <TodoItem
                                        childsDone={isChildesDone(t.id)}
                                        handleEditTodo={handleEditTodo}
                                        edit={edit}
                                        setEdit={setEdit}
                                        todo={t}
                                    ></TodoItem>
                                    <TodoDelete handleDeleteTodo={childrenLength == 0 && handleDeleteTodo} todo={t}></TodoDelete>
                                    <div className="flex">
                                        <div style={{ cursor: "pointer" }} onClick={() => handleSortUp(t)}>
                                            <IconArrowUp></IconArrowUp>
                                        </div>
                                        <div style={{ cursor: "pointer" }} onClick={() => handleSortDown(t)}>
                                            <IconArrowDown></IconArrowDown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {t.open && children}
                        </div>
                    );
                })}
            </>
        );
    };
    return (
        <>
            <div className="flex gap-2 border border-gray-300 rounded min-w-[640px] col">
                <div className="flex gap-2 row">
                    {<TodoAdd handleNewTodo={handleNewTodo} parentId={0}></TodoAdd>}
                    {todos.length == 0 && "<-- Create a new Todo"}
                </div>
                <div className="flex gap-1 col">{showTodos(0, 0)}</div>
                {deleteQuestion && (
                    <div className="top-0 right-0 bottom-0 left-0 absolute flex justify-center items-center">
                        <div className="top-0 right-0 bottom-0 left-0 absolute justify-center items-center bg-gray-300 opacity-50 w-full h-full"></div>
                        <div className="top-0 right-0 bottom-0 left-0 absolute justify-center items-center w-full h-full">
                            <div className="flex justify-center items-center gap-2 w-full h-full">
                                <div className="flex gap-2 bg-white p-4 border border-gray-400 rounded row">
                                    Delete?
                                    <button onClick={() => handleDeleteTodo2(deleteQuestion)} className="hover:bg-red-500 px-2 border border-black rounded h-7">
                                        Yes
                                    </button>
                                    <button onClick={() => setDeleteQuestion(null)} className="hover:bg-green-500 px-2 border border-black rounded h-7">
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
