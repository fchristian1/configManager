import { use, useEffect, useState } from "react";
import { Modules, ModulesConfigData, ModulesData } from "./IndexModules";

type SideMenuProps = {
    i: number;
    type: { type: string; typeDescription: string } | null;
    mainView: { type: string; id: string };
    modulesConfigData: ModulesConfigData[] | null;
    modulesData: ModulesData[] | null;
    setModulesData: (modulesData: ModulesData[] | null) => void;
    eventMenuOpen: { i: number | null; event: boolean };
    setEventMenuOpen: (eventMenuOpen: {
        i: number | null;
        event: boolean;
    }) => void;
};
export function Module({
    i,
    type,
    mainView,
    modulesData,
    setModulesData,
    modulesConfigData,

    eventMenuOpen,
    setEventMenuOpen,
}: SideMenuProps) {
    const [menu, setMenu] = useState<number | null>(null);
    const [selected, setSelected] = useState<{
        name: string;
        id: string;
    } | null>(null);
    const handleClick = async () => {
        setEventMenuOpen({ i: i, event: !eventMenuOpen.event });
    };
    const handleSelect = (item: { name: string; id: string } | null) => {
        setSelected(item);
        if (modulesData?.find((module) => module.type === type?.type)) {
            console.log("module already exists:", type?.type);
            const newModulesData = modulesData?.map((module) => {
                if (module.type === type?.type) {
                    return {
                        ...module,
                        moduleConfigId: item?.id ?? "",
                    };
                }
                return module;
            });
            item?.id && setModulesData(newModulesData);
            !item?.id &&
                setModulesData(
                    modulesData?.filter((module) => module.type !== type?.type)
                );
        } else {
            console.log("module does not exist:", type?.type);
            const newModulesData: ModulesData = {
                id: crypto.randomUUID(),
                type: type?.type ?? "",
                moduleConfigId: item?.id ?? "",
                instanceId: mainView.id,
            };
            item?.id && modulesData?.push(newModulesData);
        }

        setEventMenuOpen({ i: i, event: !eventMenuOpen.event });
    };
    useEffect(() => {
        if (eventMenuOpen.i !== i) {
            setMenu(null);
        }
        if (eventMenuOpen.i === i) {
            if (menu === i) {
                setMenu(null);
            } else {
                setMenu(i);
            }
        }
    }, [eventMenuOpen]);
    return (
        <div>
            <div>{type?.typeDescription}</div>
            <div className="inline-block relative">
                <div className="">
                    {!selected && (
                        <button
                            onClick={() => handleClick()}
                            className="button"
                        >
                            Add ...
                        </button>
                    )}
                    {selected && (
                        <button
                            onClick={() => handleClick()}
                            className="button"
                        >
                            {selected.name}
                        </button>
                    )}
                </div>

                {menu == i && (
                    <div
                        id="menu"
                        className="top-0 left-full z-10 absolute bg-gray-100 shadow-md ml-2 px-3 py-2 border border-gray-400 rounded"
                    >
                        <div>Selection:</div>
                        <div>
                            <button
                                key={i}
                                onClick={() => handleSelect(null)}
                                style={{ cursor: "pointer" }}
                                className="hover:bg-gray-200 px-1 rounded text-gray-400 hover:text-black whitespace-nowrap"
                            >
                                empty
                            </button>
                        </div>
                        {modulesConfigData?.map((item, i) => {
                            if (item.type === type?.type) {
                                return (
                                    <button
                                        key={i}
                                        onClick={() =>
                                            handleSelect({
                                                id: item.id,
                                                name: item.title,
                                            })
                                        }
                                        style={{ cursor: "pointer" }}
                                        className="hover:bg-gray-200 px-1 rounded text-gray-400 hover:text-black whitespace-nowrap"
                                    >
                                        {item.title}
                                    </button>
                                );
                            }
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
