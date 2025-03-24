import { useContext, useEffect, useState } from "react";
import { ManagerContext, ManagerContextType } from "../ManagerProvider";
import { ObjectItem } from "./ObjectItem";
import { fetcher } from "../../../services/common/fetcher";

type SideMenuProps = { parent: string; parentId: string };

export function ObjectList({ parent, parentId }: SideMenuProps) {
    const managerContext = useContext<ManagerContextType>(ManagerContext);
    const [data, setData] = useState<any[]>([]); // Zustand für die geladenen Daten
    const fetchData = async () => {
        const filteredObjects = managerContext?.configData.objects.filter(
            (object: any) => object.parent === parent
        );
        const fetchedData = await Promise.all(
            filteredObjects.map(async (object: any) => {
                const response = await fetcher(
                    `data/${object.dbname}${
                        parentId && `/parentid/${parentId}`
                    }`
                );
                return { ...object, data: response }; // Kombiniere Objekt mit geladenen Daten
            })
        );

        setData(fetchedData); // Geladene Daten in den Zustand setzen
    };
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        fetchData();
    }, [managerContext?.reload]);

    return (
        <>
            {data.map((object: any) => (
                <ObjectItem
                    key={object.dbname}
                    data={object.data}
                    object={object}
                    parentId={parentId}
                />
            ))}
        </>
    );
}
