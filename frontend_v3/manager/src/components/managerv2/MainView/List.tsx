import { use, useContext, useEffect, useState } from "react";
import {
    ManagerContext,
    ManagerContextType,
    setMainView,
} from "../ManagerProvider";
import { fetcher } from "../../../services/common/fetcher";

type SideMenuProps = {};
export function List({}: SideMenuProps) {
    const managerContext = useContext<ManagerContextType>(ManagerContext);
    const mainView: any = managerContext?.mainView || {};
    const [data, setData] = useState<
        { id: string; name: string; description: string }[]
    >([]);
    const [uuid, _] = useState(crypto.randomUUID());

    const [dataType, setDataType] = useState<any>(null);
    const getData = async (
        dbname: string
    ): Promise<
        {
            id: string;
            name: string;
            description: string;
            parentId: string;
        }[]
    > => {
        const res = await fetcher(`data/${dbname}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(res);

        // Example transformation to include the 'title' property
        return res.map(
            (item: {
                id: string;
                name: string;
                description: string;
                parentId: string;
            }) => ({
                ...item,
                // Assign a default or derived value for 'title'
            })
        );
    };
    useEffect(() => {
        const dbname = mainView?.dbname;
        const getdataAsync = async () => {
            if (dbname) {
                const data = await getData(dbname);
                setData(data);
            }
        };
        getdataAsync();
        setDataType(
            managerContext?.configData?.objects?.find(
                (o: any) => o.dbname === mainView?.dbname
            )
        );
    }, [mainView?.dbname]);
    return (
        <div>
            <div className="flex flex-row gap-2 p-2 border border-gray-300 rounded-se rounded-ss">
                <div className="font-bold">{dataType?.name ?? ""}</div>
            </div>
            <div className="flex flex-row gap-2 p-2 border-gray-300 border-x border-b border-b-black">
                <div className="w-[20%] font-bold">Name:</div>
                <div className="font-bold">Description:</div>
            </div>
            {data.map((d: any, i: number) => {
                let className =
                    "flex flex-row p-2 border-t border-x border-gray-300 hover:bg-amber-100 pointer ";

                if (i % 2 == 0) className += " bg-gray-100 ";
                if (i % 2 == 1) className += " ";
                if (i == data.length - 1)
                    className += " border-b border-gray-300 ";

                return (
                    <div
                        onClick={() => {
                            console.log("Clicked", d);
                            if (managerContext) {
                                setMainView({
                                    managerContext,
                                    mainView: dataType.link,
                                    dbname: dataType.dbname,
                                    itemId: d.id,
                                    parentId: d.parentId,
                                    modus: "item",
                                });
                            }
                        }}
                        key={d.id}
                        className={className}
                    >
                        <div className="w-[20%]">{d.name}</div>
                        <div>{d.description}</div>
                    </div>
                );
            })}
            <div
                onClick={() => {
                    if (managerContext) {
                        setMainView({
                            managerContext,
                            mainView: dataType.link,
                            dbname: dataType.dbname,
                            parentId: mainView?.parentId,
                            itemId: uuid + ":new",
                            modus: "new",
                        });
                    }
                }}
                className="flex flex-row gap-2 hover:bg-amber-100 p-2 border-gray-300 border-x border-b rounded-bl rounded-br text-gray-500 pointer"
            >
                Add new {(dataType?.singularName ?? "") + " ..."}
            </div>
        </div>
    );
}
