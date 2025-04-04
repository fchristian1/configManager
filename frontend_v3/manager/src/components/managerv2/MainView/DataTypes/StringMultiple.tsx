import { useContext, useState } from "react";
import { ManagerContext, ManagerContextType } from "../../ManagerProvider";
import { v4 as UUID } from "uuid";

type SideMenuProps = {
    onChange: any;
    value: string;
    data: any;
    name: string;
};
export function DTStringMultiple({
    onChange,
    value,
    data,
    name,
}: SideMenuProps) {
    const managerContext = useContext<ManagerContextType>(ManagerContext);
    const [editData, setEditData] = useState<any[]>([...(data ?? [])]);
    return (
        <>
            <div className="flex flex-col gap-2 p-1 border border-gray-300 rounded-md">
                {editData
                    ?.sort((a, b) => a.pos - b.pos)
                    .map((kv: any, i) => {
                        return (
                            <div className="flex gap-2" key={i}>
                                <input
                                    type="text"
                                    name={kv?.id}
                                    //value htmlescaped
                                    value={kv?.[name]}
                                    onChange={(e) => {
                                        const newEditData = editData.map(
                                            (ed) => {
                                                if (ed.id === kv.id) {
                                                    return {
                                                        ...ed,
                                                        [name]: e.target.value,
                                                    };
                                                }
                                                return ed;
                                            }
                                        );
                                        console.log(newEditData);

                                        setEditData(newEditData);
                                        onChange(e, name, newEditData);
                                    }}
                                ></input>
                                <button
                                    className="button"
                                    onClick={() => {
                                        const newEditData = editData
                                            .filter((ed) => ed.id !== kv.id)
                                            .sort((a, b) => a.pos - b.pos)
                                            .map((ed, i) => {
                                                return { ...ed, pos: i };
                                            });
                                        setEditData(newEditData);
                                        onChange(
                                            {
                                                target: {
                                                    name: name,
                                                    value: newEditData,
                                                },
                                            },
                                            name,
                                            newEditData
                                        );
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        );
                    })}
                <button
                    className="!p-1 w-full !text-black button"
                    onClick={() => {
                        setEditData([
                            ...editData,
                            {
                                id: UUID(),
                                [name]: "",
                                pos: editData.length,
                            },
                        ]);
                    }}
                >
                    Add new {name}
                </button>
            </div>
            {managerContext?.debug.showJSON && (
                <pre id="json" className="text-xs">
                    {JSON.stringify({ editData: editData }, null, 2)}
                </pre>
            )}
        </>
    );
}
