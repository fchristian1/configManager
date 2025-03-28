import { useContext, useEffect, useState } from "react";
import { ManagerContext, ManagerContextType } from "../../ManagerProvider";
import { fetcher } from "../../../../services/common/fetcher";
import { IconTrash } from "../../../Icons/Trash";
import { IconArrowUp } from "../../../Icons/ArrowUp";
import { IconArrowDown } from "../../../Icons/ArrowDown";
import { v4 as UUID } from "uuid";

type SideMenuProps = {
    onChange: any;
    dataType: any;
    value: string;
    data: any;
    name: string;
};
export function DTObject({
    onChange,
    dataType,
    value,
    data,
    name,
}: SideMenuProps) {
    const managerContext = useContext<ManagerContextType>(ManagerContext);
    const [editData, setEditData] = useState<any[]>([...(data ?? [])]);
    const [objectData, setObjectData] = useState<any[]>([]);
    const addNew = () => {
        setEditData([
            ...editData,
            { id: UUID(), pos: editData.length, objectId: "", name: "" },
        ]);
    };
    const deleteOne = (id: string) => {
        const newData = editData.filter((li) => li.id !== id);
        setEditData(newData);
        sortWithNewPos(newData);
    };
    const moveItem = (id: string, direction: "up" | "down") => {
        const index = editData.findIndex((li) => li.id === id);
        const newIndex = direction === "up" ? index - 1 : index + 1;

        // Grenzen prüfen
        if (newIndex < 0 || newIndex >= editData.length) return;

        const newData = [...editData];

        // Positionen tauschen
        const tempPos = newData[index].pos;
        newData[index].pos = newData[newIndex].pos;
        newData[newIndex].pos = tempPos;

        // Items im Array tauschen
        [newData[index], newData[newIndex]] = [
            newData[newIndex],
            newData[index],
        ];

        setEditData(newData);
        sortWithNewPos(newData);
    };

    const moveUp = (id: string) => moveItem(id, "up");
    const moveDown = (id: string) => moveItem(id, "down");

    const sortWithNewPos = (data: any) => {
        const newData = [...data].sort((a, b) => a.pos - b.pos);
        setEditData(newData.map((li, i) => ({ ...li, pos: i })));
    };
    const isInEditData = (id: string, objectId: string): boolean => {
        const match = editData.find((li) => li.objectId === objectId);

        // Wenn kein Eintrag mit dem objectId existiert, ist es gültig
        if (!match) return true;

        // Wenn ein Eintrag mit gleicher objectId, aber anderer id existiert → ungültig
        if (match.id !== id) return false;

        return true;
    };

    useEffect(() => {
        (async () => {
            const dbname = managerContext?.configData?.objects.find(
                (object: any) => object.link === dataType.name
            ).dbname;
            const response = await fetcher(`data/${dbname}`);
            setObjectData(response);
        })();
    }, []);
    useEffect(() => {
        onChange(null, dataType.name, editData);
    }, [editData]);
    return (
        <>
            {!dataType.multiple && <div>single</div>}
            {dataType.multiple && (
                <>
                    {editData.map((d, i) => {
                        return (
                            <div className="flex justify-between" key={i}>
                                <select
                                    onChange={(e) => {
                                        const newData = [
                                            ...editData.map((li) => {
                                                if (li.id === d.id) {
                                                    return {
                                                        ...li,
                                                        objectId:
                                                            e.target.value,
                                                        name: objectData.find(
                                                            (obj) =>
                                                                obj.id ===
                                                                e.target.value
                                                        )?.name,
                                                    };
                                                }
                                                return li;
                                            }),
                                        ];

                                        setEditData(newData);
                                    }}
                                >
                                    <option value="---">---</option>
                                    {objectData.map((obj, i) => {
                                        return (
                                            <>
                                                {isInEditData(d.id, obj.id) && (
                                                    <option
                                                        className="w-4 h-4"
                                                        key={i}
                                                        value={obj.id}
                                                        selected={
                                                            d.objectId ===
                                                            obj.id
                                                        }
                                                    >
                                                        Name: {obj.name}
                                                        Version: {obj.version}
                                                        Desc: {obj.description}
                                                    </option>
                                                )}
                                            </>
                                        );
                                    })}
                                </select>
                                <div>
                                    <button
                                        className="font-bold"
                                        onClick={() => moveUp(d.id)}
                                    >
                                        <IconArrowUp></IconArrowUp>
                                    </button>
                                    <button
                                        className="font-bold"
                                        onClick={() => moveDown(d.id)}
                                    >
                                        <IconArrowDown></IconArrowDown>
                                    </button>
                                    <button
                                        className="ml-3 font-bold text-red-500"
                                        onClick={() => deleteOne(d.id)}
                                    >
                                        <IconTrash></IconTrash>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    <div>
                        <button
                            disabled={objectData.length <= editData.length}
                            onClick={addNew}
                            className={
                                " !py-1  button cursor-pointer " +
                                (objectData.length <= editData.length
                                    ? " !text-gray-300 "
                                    : " !text-black ")
                            }
                        >
                            Add
                        </button>
                    </div>
                </>
            )}
        </>
    );
}
