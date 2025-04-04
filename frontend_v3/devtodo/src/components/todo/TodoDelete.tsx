import { IconTrash } from "../icons/Trash";

export function TodoDelete({ todo, handleDeleteTodo }: any) {
    return (
        <>
            {handleDeleteTodo && (
                <button
                    className="flex justify-center items-center bg-gray-200 hover:bg-red-300 border border-gray-400 rounded w-7 h-7 aspect-square text-red-500"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteTodo && handleDeleteTodo(todo)}
                >
                    <IconTrash />
                </button>
            )}
            {!handleDeleteTodo && (
                <button
                    disabled
                    className="flex justify-center items-center bg-gray-50 border border-gray-200 rounded w-7 h-7 aspect-square text-gray-300"
                    onClick={() => handleDeleteTodo && handleDeleteTodo(todo)}
                >
                    <IconTrash />
                </button>
            )}
        </>
    );
}
