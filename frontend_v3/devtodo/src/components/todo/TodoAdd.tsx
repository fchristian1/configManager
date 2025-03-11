import { IconPlusCircle } from "../icons/PlusCircle";

interface TodoAddProps {
    parentId: number;
    handleNewTodo: (parentId: number) => void;
}

export function TodoAdd({ parentId, handleNewTodo }: TodoAddProps) {
    return (
        <button
            title="Add new todo"
            onClick={() => handleNewTodo(parentId)}
            className="flex justify-center items-center bg-gray-200 hover:bg-gray-400 border border-gray-500 hover:border-amber-500 rounded w-7 h-7 aspect-square"
        >
            <IconPlusCircle />
        </button>
    );
}
