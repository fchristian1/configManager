import { useContext, useState } from "react";
import { ManagerContext, ManagerContextType } from "../../ManagerProvider";
import { v4 as UUID } from "uuid";

type SideMenuProps = {
    onChange: any;
    value: string;
    data: any;
    name: string;
};
export function DTFile({ onChange, value, data, name }: SideMenuProps) {
    const managerContext = useContext<ManagerContextType>(ManagerContext);
    const [editData, setEditData] = useState<any[]>([...(data ?? [])]);
    return (
        <>
            <div className="flex flex-col gap-2 p-1 border border-gray-300 rounded-md">
                {editData
                    ?.sort((a, b) => a.pos - b.pos)
                    .map((file: any, i) => {
                        return (
                            <div
                                className="flex flex-col gap-2 p-2 border border-gray-500 rounded"
                                key={i}
                            >
                                <label>Filename:</label>
                                <input
                                    type="text"
                                    name={file?.id}
                                    value={file?.filename}
                                    onChange={(e) => {
                                        const newEditData = editData.map(
                                            (ed) => {
                                                if (ed.id === file.id) {
                                                    return {
                                                        ...ed,
                                                        filename:
                                                            e.target.value,
                                                    };
                                                }
                                                return ed;
                                            }
                                        );
                                        setEditData(newEditData);
                                        onChange(e, name, newEditData);
                                    }}
                                ></input>
                                <label>File content:</label>

                                <textarea
                                    name={file?.id}
                                    value={file?.filecontent}
                                    onChange={(e) => {
                                        const newEditData = editData.map(
                                            (ed) => {
                                                if (ed.id === file.id) {
                                                    return {
                                                        ...ed,
                                                        filecontent:
                                                            e.target.value,
                                                    };
                                                }
                                                return ed;
                                            }
                                        );
                                        setEditData(newEditData);
                                        onChange(e, name, newEditData);
                                    }}
                                ></textarea>

                                <button
                                    className="button"
                                    onClick={() => {
                                        const newEditData = editData
                                            .filter((ed) => ed.id !== file.id)
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
                                filename: "",
                                filecontent: "",
                                pos: editData.length,
                            },
                        ]);
                    }}
                >
                    Add new file
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
