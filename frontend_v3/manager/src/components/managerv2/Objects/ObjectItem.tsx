import { useContext, useState } from "react";
import { IconMinusSquare } from "../../Icons/MinusSquare";
import { IconPlusSquare } from "../../Icons/PlusSquare";
import { Item } from "./Item";
import {
    ManagerContext,
    ManagerContextType,
    setMainView,
} from "../ManagerProvider";

type SideMenuProps = { object: any; data: any; parentId: string };
export function ObjectItem({ object, data, parentId }: SideMenuProps) {
    const [uuid, _] = useState(crypto.randomUUID());
    const managerContext = useContext<ManagerContextType>(ManagerContext);
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="flex flex-row items-center gap-2">
                <div className="pointer" onClick={() => setOpen(!open)}>
                    <div className="hover:bg-gray-500 rounded">
                        {!open && <IconPlusSquare></IconPlusSquare>}
                        {open && <IconMinusSquare></IconMinusSquare>}
                    </div>
                </div>

                <div
                    className={
                        " font-bold text-nowrap pointer rounded px-1 " +
                        (managerContext?.mainView?.itemId?.split(":")[0] ===
                            uuid &&
                        managerContext?.mainView?.itemId?.split(":")[1] !==
                            "new"
                            ? " bg-gray-300 hover:bg-gray-400 "
                            : " hover:bg-gray-200 ")
                    }
                    onClick={() => {
                        if (managerContext) {
                            setMainView({
                                managerContext,
                                mainView: object.dbname,
                                dbname: object.dbname,
                                parentId,
                                modus: "list",
                                itemId: uuid,
                            });
                        }
                    }}
                >
                    {object.name === "" ? "noname" : object.name}
                </div>
            </div>
            {open && (
                <div className="ml-5">
                    {data.map((item: any) => (
                        <Item key={item.id} item={item} object={object}></Item>
                    ))}
                    <div
                        className={
                            " text-gray-500 text-nowrap pointer rounded px-1 " +
                            (managerContext?.mainView?.itemId?.split(":")[0] ===
                                uuid &&
                            managerContext?.mainView?.itemId?.split(":")[1] ===
                                "new"
                                ? " bg-gray-300 hover:bg-gray-400 "
                                : " hover:bg-gray-200 ")
                        }
                        onClick={() => {
                            if (managerContext) {
                                setMainView({
                                    managerContext,
                                    mainView: object.link,
                                    dbname: object.dbname,
                                    parentId: parentId,
                                    itemId: uuid + ":new",
                                    modus: "new",
                                });
                            }
                        }}
                    >
                        Add new {object.singularName} ...
                    </div>
                </div>
            )}
        </>
    );
}
