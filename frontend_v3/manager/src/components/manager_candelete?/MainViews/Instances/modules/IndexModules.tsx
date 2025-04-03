import { useEffect, useState } from "react";
import { ManagerUserData } from "../../../Manager";
import { fetcher } from "../../../../../services/common/fetcher";
import { Module } from "./Module";

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
    typeDescription: string;
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
    type: string | null;
    instanceId: string;
    moduleConfigId: string;
    [key: string]: any;
};
export function Modules({ mainView }: SideMenuProps) {
    const [modulesConfigData, setModulesConfigData] = useState<
        ModulesConfigData[] | null
    >(null);
    const [modulesData, setModulesData] = useState<ModulesData[] | null>(null);
    const [typesList, setTypesList] = useState<
        {
            type: string;
            typeDescription: string;
        }[]
    >();
    const [eventMenuOpen, setEventMenuOpen] = useState<{
        i: number | null;
        event: boolean;
    }>({ i: null, event: false });
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
        const typesList =
            modulesConfigData?.map((item) => {
                return {
                    type: item.type,
                    typeDescription: item.typeDescription,
                };
            }) ?? [];
        const uniqueTypesList = typesList.filter(
            (item, index, self) =>
                index ===
                self.findIndex(
                    (t) =>
                        t.type === item.type &&
                        t.typeDescription === item.typeDescription
                )
        );
        setTypesList(uniqueTypesList);
    };
    useEffect(() => {
        (async () => await getModulesConfigData())();
        (async () => await getModulesData())();
    }, []);
    useEffect(() => {
        createTypesList();
    }, [modulesConfigData]);
    useEffect(() => {}, [typesList]);
    return (
        <div className="flex flex-col gap-2 my-2">
            {typesList?.map((item, i) => (
                <div key={i}>
                    {
                        <Module
                            i={i}
                            mainView={mainView}
                            modulesConfigData={modulesConfigData}
                            type={{
                                type: item.type,
                                typeDescription: item.typeDescription,
                            }}
                            modulesData={modulesData}
                            setModulesData={setModulesData}
                            eventMenuOpen={eventMenuOpen}
                            setEventMenuOpen={setEventMenuOpen}
                        />
                    }
                </div>
            ))}
            {JSON.stringify(modulesData, null, 2)}
        </div>
    );
}
