import { use, useEffect, useState } from "react";
import { ModulesConfigData, ModulesData } from "./IndexModules";

type SideMenuProps = {
    i: number;
    type: { type: string; typeDescription: string } | null;
    mainView: { type: string; id: string };
    modulesConfigData: ModulesConfigData[] | null;
    modulesData: ModulesData[] | null;
    setModulesData: (modulesData: ModulesData[] | null) => void;
    eventMenuOpen: number | null;
    setEventMenuOpen: (eventMenuOpen: number | null) => void;
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
        setEventMenuOpen(i);
    };
    const handleSelect = (item: { name: string; id: string }) => {
        setSelected(item);
        setMenu(i);
    };
    useEffect(() => {
        if (menu == eventMenuOpen) {
            setMenu(null);
        } else {
            setMenu(eventMenuOpen);
        }
    }, [eventMenuOpen]);

    return (
        <div>
            {"i:" + i}
            <br />
            {"eventMenuOpen: " + eventMenuOpen}
            <br />
            {"menu: " + menu}
            <br />
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
                        <button className="button">{selected.name}</button>
                    )}
                </div>

                {menu == i && (
                    <div
                        id="menu"
                        className="top-0 left-full z-10 absolute bg-gray-100 shadow-md ml-2 px-3 py-2 border border-gray-400 rounded"
                    >
                        <div>Selection:</div>
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
