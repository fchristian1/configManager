import { useContext } from "react";
import { ManagerContext, ManagerContextType } from "../ManagerProvider";
import { List } from "./List";
import { Item } from "./Item";
import { New } from "./New";

type SideMenuProps = {};

export function Main({}: SideMenuProps) {
    const managerContext = useContext<ManagerContextType>(ManagerContext);

    return (
        <div>
            {managerContext?.debug.showJSON && (
                <pre className="text-xs">
                    {JSON.stringify(
                        { mainView: managerContext?.mainView },
                        null,
                        2
                    )}
                </pre>
            )}
            {managerContext?.mainView.modus === "list" && (
                <>
                    <List></List>
                </>
            )}
            {managerContext?.mainView.modus === "item" && (
                <>
                    <Item></Item>
                </>
            )}
            {managerContext?.mainView.modus === "new" && (
                <>
                    <New></New>
                </>
            )}
        </div>
    );
}
