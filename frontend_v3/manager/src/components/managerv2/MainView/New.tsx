import { useContext, useEffect, useState } from "react";
import { ManagerContext, ManagerContextType } from "../ManagerProvider";
import { Title } from "./DataTypes/Title";
import { DTString } from "./DataTypes/String";
import { DTSelection } from "./DataTypes/Selection";
import { DTMultiline } from "./DataTypes/Multiline";
import { DTModule } from "./DataTypes/Module";
import { fetcher } from "../../../services/common/fetcher";
import { data } from "react-router";
import { DTStringString } from "./DataTypes/StringString";

type SideMenuProps = {};
export function New({}: SideMenuProps) {
    const managerContext = useContext<ManagerContextType>(ManagerContext);
    const name = managerContext?.configData.objects.find(
        (o: any) => o.link === managerContext?.mainView.link
    ).singularName;
    const [newData, setNewData] = useState<any>({});
    const handleOnChange = (e: any) => {
        setNewData({
            ...newData,
            [e.target.name]: e.target.value,
            parentId: managerContext?.mainView.parentId,
        });
    };
    const handleOnCangeModule = async (
        e: any,
        typeName: any,
        moduleData: any
    ) => {
        setNewData({
            ...newData,
            [typeName]: { ...newData[typeName], ...moduleData },
        });
    };
    const handleOnCangeStringString = async (
        e: any,
        typeName: any,
        data: any
    ) => {
        setNewData({
            ...newData,
            [typeName]: { ...newData[typeName], data },
        });
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
                                {!(dt.type === "uuid" || dt.type === "id") && (
                                    <Title>{dt.title}:</Title>
                                )}

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
                                        data={newData?.[dt.name]}
                                        onChange={handleOnChange}
                                    ></DTSelection>
                                )}
                                {dt.type === "modules" && (
                                    <DTModule
                                        onChange={handleOnCangeModule}
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
