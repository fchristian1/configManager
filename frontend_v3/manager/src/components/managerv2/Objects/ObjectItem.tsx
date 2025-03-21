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
                        " text-nowrap pointer rounded px-1 " +
                        (managerContext?.sideMenuSelected.split(":")[0] ===
                            uuid &&
                        managerContext?.sideMenuSelected.split(":")[1] !== "new"
                            ? " bg-gray-300 hover:bg-gray-400 "
                            : " hover:bg-gray-200 ")
                    }
                    onClick={() => {
                        if (managerContext) {
                            setMainView({
                                managerContext,
                                mainView: object.dbname,
                                parentId,
                                modus: "list",
                                itemId: uuid,
                            });
                        }
                    }}
                >
                    {object.name}
                </div>
            </div>
            {open && (
                <div className="ml-6">
                    {data.map((item: any) => (
                        <Item key={item.id} item={item} object={object}></Item>
                    ))}
                    <div
                        className={
                            " text-nowrap pointer rounded px-1 " +
                            (managerContext?.sideMenuSelected.split(":")[0] ===
                                uuid &&
                            managerContext?.sideMenuSelected.split(":")[1] ===
                                "new"
                                ? " bg-gray-300 hover:bg-gray-400 "
                                : " hover:bg-gray-200 ")
                        }
                        onClick={() => {
                            if (managerContext) {
                                setMainView({
                                    managerContext,
                                    mainView: object.link,
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
