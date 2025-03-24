import { useContext, useEffect, useState } from "react";
import { ManagerContext, ManagerContextType } from "../ManagerProvider";
import { fetcher } from "../../../services/common/fetcher";
import { ItemView } from "./Item/View";
import { ItemEdit } from "./Item/Edit";
type SideMenuProps = {};
export function Item({}: SideMenuProps) {
    const managerContext = useContext<ManagerContextType>(ManagerContext);
    const object = managerContext?.configData.objects.find(
        (o: any) => o.link === managerContext?.mainView.link
    );
    const [data, setData] = useState<any>(null); // Zustand für die geladenen Daten
    const [show, setShow] = useState<string>("view"); // Zustand für die Anzeige des Editiermodus
    useEffect(() => {
        setShow("view");
    }, []);
    useEffect(() => {
        setShow("view");
    }, [data]);
    useEffect(() => {
        const fetchData = async () => {
            const fetchedData = await Promise.all([
                fetcher(
                    `data/${object.dbname}/id/${managerContext?.mainView.itemId}`
                ),
            ]);

            setData(fetchedData[0]); // Geladene Daten in den Zustand setzen
        };

        fetchData();
    }, [managerContext]);
    return (
        <div>
            <div>
                {object.singularName} {data?.name}
            </div>
            <button
                className={" button " + (show === "edit" ? " active " : "")}
                onClick={() => {
                    if ("view" === show) {
                        setShow("edit");
                    }
                    if ("edit" === show) {
                        setShow("view");
                    }
                }}
            >
                Edit
            </button>
            {show === "view" && <ItemView data={data}></ItemView>}
            {show === "edit" && (
                <ItemEdit
                    data={data}
                    setData={setData}
                    show={show}
                    setShow={setShow}
                ></ItemEdit>
            )}

            {managerContext?.debug.showJSON && (
                <>
                    <pre id="json" className="text-xs">
                        {JSON.stringify({ data: data }, null, 2)}
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
