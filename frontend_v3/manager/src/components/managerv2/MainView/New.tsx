import { useContext } from "react";
import { ManagerContext, ManagerContextType } from "../ManagerProvider";
import { Title } from "./DataTypes/Title";
import { DTString } from "./DataTypes/String";
import { DTSelection } from "./DataTypes/Selection";
import { DTMultiline } from "./DataTypes/Multiline";
import { DTModule } from "./DataTypes/Module";

type SideMenuProps = {};
export function New({}: SideMenuProps) {
    const managerContext = useContext<ManagerContextType>(ManagerContext);
    const name = managerContext?.configData.objects.find(
        (o: any) => o.link === managerContext?.mainView.link
    ).singularName;
    return (
        <div>
            <div>New {name}</div>

            <div className="flex flex-col gap-2">
                {managerContext?.configData.objects
                    .find((o: any) => o.link === managerContext?.mainView.link)
                    .dataType.map((dt: any, i: number) => {
                        return (
                            <div key={i}>
                                {!(dt.type === "uuid" || dt.type === "id") && (
                                    <Title>{dt.title}:</Title>
                                )}

                                {dt.type === "string" && (
                                    <DTString value=""></DTString>
                                )}
                                {dt.type === "multiline" && (
                                    <DTMultiline value=""></DTMultiline>
                                )}
                                {dt.type === "selection" && (
                                    <DTSelection
                                        values={dt.values}
                                    ></DTSelection>
                                )}
                                {dt.type === "modules" && (
                                    <DTModule modules={dt.modules}></DTModule>
                                )}
                            </div>
                        );
                    })}
                <button className="button">Save</button>
                <button className="button">Cancel</button>
            </div>

            {managerContext?.debug.showJSON && (
                <pre id="json" className="text-xs">
                    {JSON.stringify(
                        {
                            object: managerContext?.configData.objects.find(
                                (o: any) =>
                                    o.link === managerContext?.mainView.link
                            ),
                        },
                        null,
                        2
                    )}
                </pre>
            )}
        </div>
    );
}
