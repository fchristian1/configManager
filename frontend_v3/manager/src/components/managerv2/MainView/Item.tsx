import { useContext, useEffect, useState } from "react";
import { ManagerContext, ManagerContextType } from "../ManagerProvider";
import { Title } from "./DataTypes/Title";
import { DTString } from "./DataTypes/String";
import { DTSelection } from "./DataTypes/Selection";
import { DTMultiline } from "./DataTypes/Multiline";
import { DTModule } from "./DataTypes/Module";
import { fetcher } from "../../../services/common/fetcher";
type SideMenuProps = {};
export function Item({}: SideMenuProps) {
    const managerContext = useContext<ManagerContextType>(ManagerContext);
    const object = managerContext?.configData.objects.find(
        (o: any) => o.link === managerContext?.mainView.link
    );
    const [data, setData] = useState<any>(null); // Zustand für die geladenen Daten
    useEffect(() => {
        const fetchData = async () => {
            const fetchedData = await Promise.all([
                fetcher(
                    `/data/${object.dbname}/id/${managerContext?.mainView.itemId}`
                ),
            ]);

            setData(fetchedData); // Geladene Daten in den Zustand setzen
        };

        fetchData();
    }, [managerContext]);
    return (
        <div>
            <div>
                {object.singularName} {data?.name}
            </div>

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
                                        value={data?.[0]?.[dt.name]}
                                    ></DTString>
                                )}
                                {dt.type === "multiline" && (
                                    <DTMultiline
                                        value={data?.[0]?.[dt.name]}
                                    ></DTMultiline>
                                )}
                                {dt.type === "selection" && (
                                    <DTSelection
                                        values={dt.values}
                                    ></DTSelection>
                                )}
                                {dt.type === "modules" && (
                                    <DTModule modules={dt.modules}></DTModule>
                                )}
                            </div>
                        );
                    })}
                <button className="button">Save</button>
                <button className="button">Cancel</button>
            </div>

            {managerContext?.debug.showJSON && (
                <>
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
                    <pre id="json" className="text-xs">
                        {JSON.stringify({ data: data }, null, 2)}
                    </pre>
                </>
            )}
        </div>
    );
}
