import { useContext, useEffect, useState } from "react";
import { ManagerContext, ManagerContextType } from "../../ManagerProvider";
import { Title } from "../DataTypes/Title";
import { DTString } from "../DataTypes/String";
import { DTMultiline } from "../DataTypes/Multiline";
import { DTSelection } from "../DataTypes/Selection";
import { DTModule } from "../DataTypes/Module";
import { fetcher } from "../../../../services/common/fetcher";
import { DTStringString } from "../DataTypes/StringString";

type SideMenuProps = { data: any; setData: any; show: any; setShow: any };
export function ItemEdit({ data, setData, show, setShow }: SideMenuProps) {
    const managerContext = useContext<ManagerContextType>(ManagerContext);
    const [editData, setEditData] = useState<any>(data); // Zustand für die editierten Daten
    const [deleteItem, setDeleteItem] = useState<
        "delete1" | "delete2" | "delete3" | ""
    >("");
    const handleOnChange = async (e: any) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value,
        });
    };
    const handleOnChangeModule = async (
        e: any,
        typeName: any,
        moduleData: any
    ) => {
        setEditData({
            ...editData,
            [typeName]: { ...editData[typeName], ...moduleData },
        });
    };
    const handleOnChangeStringString = async (
        e: any,
        typeName: any,
        data: any
    ) => {
        console.log(data);
        setEditData({
            ...editData,
            [typeName]: { ...editData[typeName], data },
        });
    };
    const handleSave = async () => {
        if (data === editData) {
            setShow("view");
            return;
        }
        const res = await fetcher(
            `data/${managerContext?.mainView.link}s/${managerContext?.mainView.itemId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: editData,
            }
        );
        if (res) setData(editData);
        managerContext?.setReload(!managerContext?.reload);
        setShow("view");
    };
    const handleDelete1 = async () => {
        setDeleteItem("delete1");
    };

    const handleDelete2 = async () => {
        setDeleteItem("delete2");
    };
    const handleDelete3 = async () => {
        setDeleteItem("delete3");
        const res = await fetcher(
            `data/${managerContext?.mainView.dbname}/${managerContext?.mainView.itemId}`,
            {
                method: "DELETE",
            }
        );
        if (res) {
            managerContext?.setReload(!managerContext?.reload);
            setShow("view");
        }
        setDeleteItem("");
        managerContext?.setReload(!managerContext?.reload);
        managerContext?.setData({
            ...managerContext,
            mainView: {
                ...managerContext?.mainView,
                link: managerContext?.mainView.link,
                modus: "list",
            },
        });
    };
    const handleNoDelete = async () => {
        setDeleteItem("");
    };
    useEffect(() => {
        setEditData(data);
    }, [data]);

    return (
        <div className="flex flex-col gap-2">
            {managerContext?.configData.objects
                .find((o: any) => o.link === managerContext?.mainView.link)
                .dataType.map((dt: any, i: number) => {
                    return (
                        <div key={i}>
                            {!(dt.type === "uuid" || dt.type === "id") && (
                                <Title>{dt.title}:</Title>
                            )}

                            {dt.type === "string" && (
                                <DTString
                                    onChange={handleOnChange}
                                    value={editData?.[dt.name]}
                                    name={dt.name}
                                ></DTString>
                            )}
                            {dt.type === "stringstring" && (
                                <DTStringString
                                    onChange={handleOnChangeStringString}
                                    value={editData?.[dt.name] ?? ""}
                                    data={editData?.keyvalue?.data}
                                    name={dt.name}
                                ></DTStringString>
                            )}
                            {dt.type === "multiline" && (
                                <DTMultiline
                                    onChange={handleOnChange}
                                    value={editData?.[dt.name]}
                                    name={dt.name}
                                ></DTMultiline>
                            )}
                            {dt.type === "selection" && (
                                <DTSelection
                                    onChange={handleOnChange}
                                    values={dt.values}
                                    data={editData?.[dt.name]}
                                    name={dt.name}
                                ></DTSelection>
                            )}
                            {dt.type === "modules" && (
                                <DTModule
                                    onChange={handleOnChangeModule}
                                    modules={dt.modules}
                                    data={editData}
                                    moduleData={editData?.[dt.name]}
                                    setEditData={setEditData}
                                    name={dt.name}
                                ></DTModule>
                            )}
                        </div>
                    );
                })}
            <button className="button" onClick={handleSave}>
                Save
            </button>
            <button className="button" onClick={() => setShow("view")}>
                Cancel
            </button>
            <button
                className="bg-red-500! hover:bg-red-600! text-black! button"
                onClick={handleDelete1}
            >
                Delete
            </button>

            {(deleteItem === "delete1" || deleteItem === "delete2") && (
                <div>
                    <div className="top-0 left-0 absolute bg-gray-500/50 backdrop-blur-xs w-full h-full"></div>
                    <div className="top-0 left-0 absolute w-full h-full">
                        <div className="flex justify-center items-center h-full">
                            <div className="flex flex-col items-center gap-2 bg-white/80 p-10 border border-gray-500 rounded-2xl">
                                <div className="">
                                    Are you sure you want to delete this item?
                                </div>
                                <div
                                    className={
                                        "flex " +
                                        (deleteItem === "delete1"
                                            ? "gap-2"
                                            : "gap-24")
                                    }
                                >
                                    <button
                                        onClick={() => {
                                            if (deleteItem === "delete1") {
                                                handleDelete2();
                                            } else if (
                                                deleteItem === "delete2"
                                            ) {
                                                handleDelete3();
                                            }
                                        }}
                                        className="bg-red-500! hover:bg-red-600! text-black! button"
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={handleNoDelete}
                                        className="bg-green-500! hover:bg-green-600! text-black! button"
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {managerContext?.debug.showJSON && (
                <>
                    <pre id="json" className="text-xs">
                        {JSON.stringify({ editData: editData }, null, 2)}
                    </pre>
                </>
            )}
        </div>
    );
}
