import { useContext, useState } from "react";
import { ObjectList } from "./Objects/ObjectList";
import { Main } from "./MainView/Main";
import { ManagerContext, setDebug } from "./ManagerProvider";

type SideMenuProps = {};

export function Manager({}: SideMenuProps) {
    const managerContext = useContext<any>(ManagerContext);
    const [showSideMenu, setShowSideMenu] = useState(false);
    return (
        <>
            <aside className={showSideMenu ? "open" : "normal"}>
                <span
                    onClick={() => {
                        setShowSideMenu(!showSideMenu);
                    }}
                    id="asideMenuIcon"
                >
                    X
                </span>

                <div>
                    <ObjectList
                        parent="#object:root"
                        parentId={""}
                    ></ObjectList>
                    <button
                        className={
                            "button " +
                            (managerContext.debug.showJSON && " active ")
                        }
                        onClick={() =>
                            setDebug({
                                managerContext,
                                showJSON: !managerContext.debug.showJSON,
                                showDebug: managerContext.debug.showDebug,
                            })
                        }
                    >
                        ShowJSON
                    </button>
                    <button
                        className={
                            "button " +
                            (managerContext.debug.showDebug && " active ")
                        }
                        onClick={() =>
                            setDebug({
                                managerContext,
                                showJSON: managerContext.debug.showJSON,
                                showDebug: !managerContext.debug.showDebug,
                            })
                        }
                    >
                        ShowDebug
                    </button>
                </div>
            </aside>
            <div className="w-full">
                <Main></Main>
                {managerContext.debug.showDebug && (
                    <pre className="text-xs">
                        {JSON.stringify(managerContext, null, 2)}
                    </pre>
                )}
            </div>
        </>
    );
}
