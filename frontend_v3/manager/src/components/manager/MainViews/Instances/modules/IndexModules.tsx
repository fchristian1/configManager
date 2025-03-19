import { useEffect, useState } from "react";
import { ManagerUserData } from "../../../Manager";
import { fetcher } from "../../../../../services/common/fetcher";
import { InstanceModule } from "./InstanceModule";
import { RepositoryModule } from "./RepositoryModule";
import { ScriptModule } from "./ScriptModule";

type SideMenuProps = {
    token: string;
    mainView: { type: string; id: string };
    setMainView: (mainView: { type: string; id: string }) => void;
    dataChanged: boolean;
    setDataChanged: (dataChanged: boolean) => void;
    managerUserData: ManagerUserData;
};
export type ModulesConfigData = {
    id: string;
    title: string;
    type: string;
    description: string;
    options: ModulesConfigDataOptions;
};
export type ModulesConfigDataOptions = {
    title: string;
    instanceId: string;
    [key: string]: any;
};
export type ModulesData = {
    id: string;
    type: string;
    instanceId: string;
    [key: string]: any;
};
export function Modules({}: SideMenuProps) {
    const [modulesConfigData, setModulesConfigData] = useState<
        ModulesConfigData[] | null
    >();
    const [modulesData, setModulesData] = useState<ModulesData[] | null>(null);
    const [typesList, setTypesList] = useState<string[]>();
    const getModulesConfigData = async () => {
        const response = await fetcher("modulesconfig", {
            method: "GET",
        });
        setModulesConfigData(response);
    };
    const getModulesData = async () => {
        const response = await fetcher("modules", {
            method: "GET",
        });
        setModulesData(response);
    };
    const createTypesList = () => {
        //create types list with no duplicates
        const typesList = modulesConfigData?.map((item) => item.type) ?? [];
        const uniqueTypesList = Array.from(new Set(typesList));
        setTypesList(uniqueTypesList);
    };
    useEffect(() => {
        (async () => await getModulesConfigData())();
        (async () => await getModulesData())();
    }, []);
    useEffect(() => {
        createTypesList();
    }, [modulesConfigData]);
    useEffect(() => {
        console.log(typesList);
    }, [typesList]);
    return (
        <div className="flex flex-col gap-2 my-2">
            {typesList?.map((type, i) => (
                <div key={i}>
                    {type === "instanceModule" && (
                        <InstanceModule modulesData={modulesData} />
                    )}
                    {type === "repositoryModule" && (
                        <RepositoryModule modulesData={modulesData} />
                    )}
                    {type === "scriptModule" && (
                        <ScriptModule modulesData={modulesData} />
                    )}
                </div>
            ))}
        </div>
    );
}
