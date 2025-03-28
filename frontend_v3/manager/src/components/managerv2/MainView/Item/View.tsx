import { useContext } from "react";
import { ManagerContext, ManagerContextType } from "../../ManagerProvider";
type SideMenuProps = { data: any };
export function ItemView({ data }: SideMenuProps) {
    const managerContext = useContext<ManagerContextType>(ManagerContext);

    return (
        <div>
            {managerContext?.configData.objects
                .find((o: any) => o.link === managerContext?.mainView.link)
                .dataType.map((dt: any, i: number) => {
                    return (
                        <div className="flex flex-row" key={i}>
                            {!(dt.type === "uuid" || dt.type === "id") && (
                                <div>{dt.title}:&nbsp;</div>
                            )}

                            {dt.type === "string" && (
                                <div>{data?.[dt.name]}</div>
                            )}
                            {dt.type === "multiline" && (
                                <div>{data?.[dt.name]}</div>
                            )}
                            {dt.type === "selection" && (
                                <div>{data?.[dt.name]}</div>
                            )}
                            {dt.type === "stringstring" && (
                                <div>
                                    {data?.keyvalue?.data?.map(
                                        (d: any, i: number) => (
                                            <div key={i}>
                                                {d.key}:{" "}
                                                {d.value &&
                                                    d.value != "" &&
                                                    "..."}{" "}
                                                <br />
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                            {dt.type === "object" && (
                                <div>
                                    {data?.[dt.name]?.data?.map(
                                        (d: any, i: number) => {
                                            return (
                                                <div key={i}>
                                                    {d.name}
                                                    {i + 1 <
                                                        data?.[dt.name]?.data
                                                            ?.length && ", "}
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                            {dt.type === "file" && (
                                <div>
                                    {data?.file?.data?.map(
                                        (d: any, i: number) => (
                                            <div key={i}>{d.filename}</div>
                                        )
                                    )}
                                </div>
                            )}

                            {dt.type === "modules" && (
                                <div>
                                    {managerContext?.configData?.modules?.find(
                                        (m: any) =>
                                            m.link ===
                                                data?.[dt.name]?.link.split(
                                                    ":"
                                                )[1] || ""
                                    )?.title ?? ""}
                                </div>
                            )}

                            {dt.type === "informations" && (
                                <ul>
                                    {dt.dataType.map((d: any, i: number) => (
                                        <li key={i}>
                                            {d.title}
                                            {d.name === "ip" && (
                                                <span> {data?.ips}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                })}
        </div>
    );
}
