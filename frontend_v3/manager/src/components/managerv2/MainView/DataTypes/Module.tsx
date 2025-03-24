import { useContext, useEffect, useState } from "react";
import { ManagerContext, ManagerContextType } from "../../ManagerProvider";
import { fetcher } from "../../../../services/common/fetcher";
import { data } from "react-router";

type SideMenuProps = {
    modules: any[];
    name: string;
    data: any;
    moduleData: any;
    setEditData: any;
    onChange: any;
};
export function DTModule({
    modules,
    name,
    data,
    moduleData,
    setEditData,
    onChange,
}: SideMenuProps) {
    const managerContext = useContext<ManagerContextType>(ManagerContext);
    return (
        <div className="flex flex-col">
            <select
                onChange={(e) => onChange(e, name, { link: e.target.value })}
                name={name}
                value={moduleData?.link}
            >
                <option>---</option>
                {modules.map((m: any, i: number) => {
                    return (
                        <option key={i} value={m}>
                            {
                                managerContext?.configData.modules.find(
                                    (module: any) =>
                                        module.link === m.split(":")[1]
                                ).title
                            }
                        </option>
                    );
                })}
            </select>
            {moduleData && moduleData.link != "---" && (
                <div className="flex flex-col gap-2 p-2 border border-gray-300 rounded-md">
                    {managerContext?.configData.modules
                        .find(
                            (module: any) =>
                                module.link ===
                                    moduleData.link?.split(":")[1] || ""
                        )
                        ?.dataType?.map((dt: any, i: number) => {
                            return (
                                dt.type === "string" && (
                                    <div className="" key={i}>
                                        <div>{dt.title}</div>
                                        <input
                                            onChange={(e) =>
                                                onChange(e, name, {
                                                    [e.target.name]:
                                                        e.target.value,
                                                })
                                            }
                                            type="text"
                                            className="flex justify-between items-center bg-transparent disabled:opacity-50 shadow-sm px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring ring-offset-background w-[180px] h-9 data-[placeholder]:text-muted-foreground text-sm [&>span]:line-clamp-1 whitespace-nowrap disabled:cursor-not-allowed"
                                            name={dt.name}
                                            value={moduleData[dt.name]}
                                        />
                                    </div>
                                )
                            );
                        })}
                </div>
            )}
            {managerContext?.debug.showJSON && <pre></pre>}
        </div>
    );
}
