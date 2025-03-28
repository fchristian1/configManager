import { useContext, useEffect, useState, useRef } from "react";
import { ManagerContext, ManagerContextType } from "../ManagerProvider";
import { Title } from "./DataTypes/Title";
import { DTString } from "./DataTypes/String";
import { DTSelection } from "./DataTypes/Selection";
import { DTMultiline } from "./DataTypes/Multiline";
import { DTModule } from "./DataTypes/Module";
import { fetcher } from "../../../services/common/fetcher";
import { DTStringString } from "./DataTypes/StringString";
import { DTFile } from "./DataTypes/File";
import { DTObject } from "./DataTypes/Object";

type SideMenuProps = {};
export function New({}: SideMenuProps) {
    const managerContext = useContext<ManagerContextType>(ManagerContext);
    const name = managerContext?.configData.objects.find(
        (o: any) => o.link === managerContext?.mainView.link
    ).singularName;

    const [newData, setNewData] = useState<any>({});
    const updateQueue = useRef<any[]>([]); // Warteschlange für Updates
    const isProcessing = useRef(false); // Status, ob gerade verarbeitet wird

    const processQueue = () => {
        if (isProcessing.current || updateQueue.current.length === 0) return;

        isProcessing.current = true;
        const nextUpdate = updateQueue.current.shift(); // Nächsten Eintrag aus der Warteschlange holen

        setNewData((prevData: any) => {
            const updatedData = nextUpdate(prevData);
            isProcessing.current = false;
            processQueue(); // Nächsten Eintrag verarbeiten
            return updatedData;
        });
    };

    const handleOnChange = (e: any) => {
        const updateFunction = (prevData: any) => ({
            ...prevData,
            [e.target.name]: e.target.value,
            parentId: managerContext?.mainView.parentId,
        });

        updateQueue.current.push(updateFunction); // Update in die Warteschlange einfügen
        processQueue(); // Verarbeitung starten
    };

    const handleOnChangeModule = async (
        e: any,
        typeName: any,
        moduleData: any
    ) => {
        const updateFunction = (prevData: any) => ({
            ...prevData,
            [typeName]: { ...prevData[typeName], ...moduleData },
        });

        updateQueue.current.push(updateFunction);
        processQueue();
    };

    const handleOnCangeStringString = async (
        e: any,
        typeName: any,
        data: any
    ) => {
        const updateFunction = (prevData: any) => ({
            ...prevData,
            [typeName]: { ...prevData[typeName], data },
        });

        updateQueue.current.push(updateFunction);
        processQueue();
    };
    const handleOnChangeObject = async (e: any, typeName: any, data: any) => {
        const updateFunction = (prevData: any) => ({
            ...prevData,
            [typeName]: { ...prevData[typeName], data },
        });

        updateQueue.current.push(updateFunction);
        processQueue();
    };

    const handleOnChangeFile = async (e: any, typeName: any, data: any) => {
        const updateFunction = (prevData: any) => ({
            ...prevData,
            [typeName]: { ...prevData[typeName], data },
        });
        updateQueue.current.push(updateFunction);
        processQueue();
    };
    const handleSave = async () => {
        const res = await fetcher(`data/${managerContext?.mainView.dbname}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: newData,
        });
        if (res) {
            managerContext?.setReload(!managerContext?.reload);

            setNewData({});
        }
    };
    const handleCancel = () => {
        //rerender this component
        managerContext?.setData({
            ...managerContext,
            mainView: {
                ...managerContext?.mainView,
                link: managerContext?.mainView.link,
                modus: "list",
            },
        });
    };
    useEffect(() => {
        setNewData({});
    }, [managerContext?.mainView]);
    return (
        <div>
            <div>New {name}</div>

            <div className="flex flex-col gap-2">
                {managerContext?.configData.objects
                    .find((o: any) => o.link === managerContext?.mainView.link)
                    .dataType.map((dt: any, i: number) => {
                        return (
                            <div key={i}>
                                {!(
                                    dt.type === "uuid" ||
                                    dt.type === "id" ||
                                    dt.type === "informations"
                                ) && <Title>{dt.title}:</Title>}
                                {dt.type === "string" && (
                                    <DTString
                                        name={dt.name}
                                        value={newData?.[dt.name] ?? ""}
                                        onChange={handleOnChange}
                                    ></DTString>
                                )}
                                {dt.type === "stringstring" && (
                                    <DTStringString
                                        onChange={handleOnCangeStringString}
                                        value={newData?.[dt.name] ?? ""}
                                        data={newData.data}
                                        name={dt.name}
                                    ></DTStringString>
                                )}
                                {dt.type === "file" && (
                                    <DTFile
                                        onChange={handleOnChangeFile}
                                        value={newData?.[dt.name] ?? ""}
                                        data={newData.data}
                                        name={dt.name}
                                    ></DTFile>
                                )}
                                {dt.type === "object" && (
                                    <DTObject
                                        onChange={handleOnChangeObject}
                                        dataType={dt}
                                        value={newData?.[dt.name] ?? ""}
                                        data={newData?.[dt.name]?.data}
                                        name={dt.name}
                                    ></DTObject>
                                )}
                                {dt.type === "multiline" && (
                                    <DTMultiline
                                        name={dt.name}
                                        value={newData?.[dt.name] ?? ""}
                                        onChange={handleOnChange}
                                    ></DTMultiline>
                                )}
                                {dt.type === "selection" && (
                                    <DTSelection
                                        name={dt.name}
                                        values={dt.values}
                                        defaultValue={dt.default}
                                        data={newData?.[dt.name]}
                                        onChange={handleOnChange}
                                    ></DTSelection>
                                )}
                                {dt.type === "modules" && (
                                    <DTModule
                                        onChange={handleOnChangeModule}
                                        name={dt.name}
                                        data={newData}
                                        moduleData={newData?.[dt.name]}
                                        setEditData={null}
                                        modules={dt.modules}
                                    ></DTModule>
                                )}
                            </div>
                        );
                    })}
                <button className="button" onClick={handleSave}>
                    Save
                </button>
                <button className="button" onClick={handleCancel}>
                    Cancel
                </button>
            </div>

            {managerContext?.debug.showJSON && (
                <>
                    <pre id="json" className="text-xs">
                        {JSON.stringify({ newData: newData }, null, 2)}
                    </pre>

                    <pre id="json" className="text-xs">
                        {JSON.stringify(
                            {
                                object: managerContext?.configData.objects.find(
                                    (o: any) =>
                                        o.link === managerContext?.mainView.link
                                ),
                            },
                            null,
                            2
                        )}
                    </pre>
                </>
            )}
        </div>
    );
}
