import { useContext, useState } from "react";
import { ManagerContext, setMainView } from "../ManagerProvider";
import { ObjectList } from "./ObjectList";
import { IconPlusSquare } from "../../Icons/PlusSquare";
import { IconMinusSquare } from "../../Icons/MinusSquare";

type SideMenuProps = { item: any; object: any };
export function Item({ item, object }: SideMenuProps) {
    const managerContext = useContext<any>(ManagerContext);
    const [open, setOpen] = useState(false);
    return (
        <div key={item.id}>
            <div className="flex flex-row items-center gap-2">
                {managerContext.configData.objects.filter(
                    (o: any) => o.parent === `#object:${object.link}`
                ).length > 0 && (
                    <div className="pointer" onClick={() => setOpen(!open)}>
                        <div className="hover:bg-gray-500 rounded">
                            {!open && <IconPlusSquare></IconPlusSquare>}
                            {open && <IconMinusSquare></IconMinusSquare>}
                        </div>
                    </div>
                )}
                <div
                    className={
                        " text-nowrap pointer rounded px-1 " +
                        (managerContext?.sideMenuSelected.split(":")[0] ===
                            item.id &&
                        managerContext?.sideMenuSelected.split(":")[1] !== "new"
                            ? " bg-gray-300 hover:bg-gray-400 "
                            : " hover:bg-gray-200 ")
                    }
                    onClick={() => {
                        if (managerContext) {
                            setMainView({
                                managerContext,
                                mainView: object.link,
                                itemId: item.id,
                                parentId: item.parentId,
                                modus: "item",
                            });
                        }
                    }}
                >
                    {item.name}
                </div>
            </div>
            {open &&
                managerContext.configData.objects
                    .filter((o: any) => o.parent === `#object:${object.link}`)
                    .map((_: any, i: number) => {
                        return (
                            <div key={i} className="ml-6">
                                <ObjectList
                                    parent={`#object:${object.link}`}
                                    parentId={item.id}
                                ></ObjectList>
                            </div>
                        );
                    })}
        </div>
    );
}
