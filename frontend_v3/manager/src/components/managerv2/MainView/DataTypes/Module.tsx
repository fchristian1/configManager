import { useContext } from "react";
import { ManagerContext, ManagerContextType } from "../../ManagerProvider";
import { fetcher } from "../../../../services/common/fetcher";
import { DTComplex } from "./Complex";

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
    const onChangeComplex = (e: any, n: string, data: any) => {
        const newData = { ...moduleData, [n]: data };

        setEditData(newData);
        onChange(e, name, newData);
    };
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
                                    moduleData.link?.toString().split(":")[1] ||
                                ""
                        )
                        ?.dataType?.map((dt: any, i: number) => {
                            if (dt.type === "selection" && dt.link) {
                                const collection = dt.link.split(":")[1];
                                fetcher(`data/${collection}`, {
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                }).then((res) => {
                                    dt.values = [
                                        { name: "---", id: "" },
                                        ...res,
                                    ];
                                });
                            }
                            return (
                                (dt.type === "string" && (
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
                                )) ||
                                (dt.type === "complex" && (
                                    <div className="" key={i}>
                                        <div>{dt.title}</div>
                                        <DTComplex
                                            onChange={onChangeComplex}
                                            name={dt.name}
                                            dataType={dt.dataType}
                                            value={moduleData[dt.name]}
                                            moduleData={moduleData}
                                        ></DTComplex>
                                    </div>
                                )) ||
                                (dt.type == "selection" && (
                                    <div className="" key={i}>
                                        <div>{dt.title}</div>
                                        <select
                                            onChange={(e) =>
                                                onChange(e, name, {
                                                    [e.target.name]:
                                                        e.target.value,
                                                })
                                            }
                                            name={dt.name}
                                            value={moduleData[dt.name]}
                                        >
                                            {dt.values.map(
                                                (v: any, i: number) => {
                                                    return (
                                                        <option
                                                            key={i}
                                                            value={v.id}
                                                        >
                                                            {v.name}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                    </div>
                                ))
                            );
                        })}
                </div>
            )}
            {managerContext?.debug.showJSON && (
                <pre>1{JSON.stringify(moduleData)}</pre>
            )}
        </div>
    );
}
