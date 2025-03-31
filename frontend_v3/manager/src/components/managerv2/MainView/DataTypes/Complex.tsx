import { useContext, useState } from "react";
import { IconTrash } from "../../../Icons/Trash";
import { v4 as UUID } from "uuid";
import { ManagerContext, ManagerContextType } from "../../ManagerProvider";

type SideMenuProps = {
    onChange: any;
    name: string;
    value: any;
    dataType: any;
    moduleData: any;
};
export function DTComplex({
    onChange,
    name,
    value,
    dataType,
    moduleData,
}: SideMenuProps) {
    const managerContext = useContext<ManagerContextType>(ManagerContext);
    const [data, setData] = useState<any>(value ?? []);
    const handleAdd = async () => {
        const newData = [...data, createComplexObject()];

        setData(newData);
        onChange(null, name, newData);
    };
    const handleDel = async (id: string) => {
        const newData = data.filter((d: any) => d.id != id);
        setData(newData);
        onChange(null, name, newData);
    };
    const handleChange = async (n: any, value: string, id: string) => {
        const newData = data.map((d: any) => {
            if (d.id == id) {
                return { ...d, [n]: value };
            }
            return d;
        });
        setData(newData);
        onChange(null, name, newData);
    };
    const createComplexObject = () => {
        const newComplexObject = [
            ...[{ id: UUID() }],
            ...dataType.map((dt: any) => {
                return { [dt.name]: "" };
            }),
        ];
        return newComplexObject.reduce((acc: any, obj: any) => {
            const key = Object.keys(obj)[0];
            acc[key] = "";
            return acc;
        });
    };
    return (
        <div className="flex flex-col gap-2">
            {data.map((d: any, i: number) => {
                return (
                    <div
                        key={i}
                        className="flex flex-row items-center px-1 border border-gray-300 rounded"
                    >
                        {dataType &&
                            dataType.map((dt: any, ii: number) => {
                                return (
                                    dt.type == "string" && (
                                        <div
                                            key={ii}
                                            className="flex flex-col gap-2 p-2"
                                        >
                                            <label>{dt.title}</label>
                                            <input
                                                value={d[dt.name]}
                                                type="text"
                                                name={dt.name}
                                                onChange={(e) =>
                                                    handleChange(
                                                        dt.name,
                                                        e.target.value,
                                                        d.id
                                                    )
                                                }
                                                id=""
                                            />
                                        </div>
                                    )
                                );
                            })}
                        <div
                            onClick={() => handleDel(d.id)}
                            className="text-red-500 pointer"
                        >
                            <IconTrash></IconTrash>
                        </div>
                    </div>
                );
            })}
            <div>
                <button
                    onClick={handleAdd}
                    className="!py-1 !text-black button"
                >
                    Add {name}
                </button>
            </div>
            {managerContext?.debug.showJSON && (
                <>
                    <pre className="text-xs">Type Name: {name}</pre>
                    <pre className="text-xs">
                        data:{JSON.stringify(data, null, 2)}
                    </pre>
                    <pre className="text-xs">
                        dataType:{JSON.stringify(dataType, null, 2)}
                    </pre>
                    <pre className="text-xs">
                        value:{JSON.stringify(value, null, 2)}
                    </pre>
                    <pre className="text-xs">
                        moduleData:{JSON.stringify(moduleData, null, 2)}
                    </pre>
                </>
            )}
        </div>
    );
}
