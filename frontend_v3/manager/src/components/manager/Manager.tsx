import { useEffect, useState } from "react";
import { FolderManager } from "./SideMenu/FolderManager/IndexFolderManager";
import { SideMenu } from "./SideMenu/IndexSideMenu";

import { MainView } from "./MainViews/MainView";
import { getAll } from "../../services/data";
import { FolderInstancesList } from "./SideMenu/FolderManager/FolderInstancesList";
import { data } from "react-router";

export type TypeData = {
    type: string;
    name: string;
    link: { all: string; one: string };
    singularName: string;
    childrens?: TypeData[];
};

export type ManagerUserData = {
    userId: string;
    data: ManagerDataData[];
};
export type ManagerDataData = {
    type: string;
    data: ManagerDataDataData[];
};
export type ManagerDataDataData = {
    id: string;
    name: string;
    description: string;
    parentId?: string;
};
export type ViewUserData = {
    userId: string;
    data: ViewData[];
};
export type ViewData = {
    id: string;
    folderOpen: boolean;
};

export type SetMain = {
    setProjects: (id?: string) => void;
    setProject: (id: string) => void;
    setProjectNew: (id: string, parentId?: string) => void;
    setSoftwares: (id?: string) => void;
    setSoftware: (id: string) => void;
    setSoftwareNew: (id: string, parentId?: string) => void;
    setInstances: (id?: string) => void;
    setInstance: (id: string) => void;
    setInstanceNew: (id: string, parentId?: string) => void;
};
export function findType(
    typeData: TypeData[],
    type: string
): TypeData | null {
    for (const item of typeData) {
        if (item.type === type) {
            return item;
        }
        if (item.childrens) {
            const found = findType(item.childrens, type);
            if (found) return found;
        }
    }
    return null;
}
export function Manager() {
    const typeData: TypeData[] = [
        {
            type: "projects",
            name: "Projects",
            singularName: "Project",
            link: { all: "setProjects", one: "setProject" },
            childrens: [
                {
                    type: "instances",
                    name: "Instances",
                    singularName: "Instance",
                    link: {
                        all: "setInstances",
                        one: "setInstance",
                    },
                },
            ],
        },
        {
            type: "softwares",
            name: "Software",
            singularName: "Software",
            link: {
                all: "setSoftwares",
                one: "setSoftware",
            },
        },
    ];
    const [viewUserData, setViewStatusData] =
        useState<ViewUserData | null>(null);
    const [mainView, setMainView] = useState<{
        type: string;
        id: string;
        parentId?: string;
    }>({
        type: "projects",
        id: "",
    });
    const [dataChanged, setDataChanged] = useState(false);
    const [managerUserData, setManagerUserData] =
        useState<ManagerUserData>({
            userId: "",
            data: [],
        });
    const setMain: SetMain = {
        setProjects: (id?: string) => {
            setMainView({ type: "projects", id: id ?? "" });
        },
        setProject: (id: string) => {
            setMainView({ type: "project", id: id });
        },
        setProjectNew: (id: string, parentId?: string) => {
            setMainView({
                type: "projectNew",
                id: id,
                parentId,
            });
        },
        setSoftwares: (id?: string) => {
            setMainView({
                type: "softwares",
                id: id ?? "",
            });
        },
        setSoftware: (id: string) => {
            setMainView({ type: "software", id: id });
        },
        setSoftwareNew: (id: string, parentId?: string) => {
            setMainView({
                type: "softwareNew",
                id: id,
                parentId,
            });
        },
        setInstances: (id?: string) => {
            setMainView({
                type: "instances",
                id: id ?? "",
            });
        },
        setInstance: (id: string) => {
            setMainView({ type: "instance", id: id });
        },
        setInstanceNew: (id: string, parentId?: string) => {
            setMainView({
                type: "instanceNew",
                id: id,
                parentId,
            });
        },
    };
    const fetchData = async () => {
        const getManagerData: ManagerUserData = {
            userId: localStorage.getItem("userId") ?? "",
            data: [
                {
                    type: "projects",
                    data: [],
                },
                {
                    type: "softwares",
                    data: [],
                },
                {
                    type: "instances",
                    data: [],
                },
            ],
        };

        // Hole die Daten asynchron und aktualisiere die Kopie
        const updatedData = await Promise.all(
            getManagerData.data.map(async (item) => {
                const dataFromApi = await getAll(item.type);
                return {
                    ...item,
                    data: dataFromApi ?? [],
                };
            })
        );

        // Aktualisiere den Zustand mit neuen Daten
        const updatedManagerData = {
            ...getManagerData,
            data: updatedData,
        };

        const viewStatusData: ViewUserData = {
            userId: updatedManagerData.userId,
            data: [],
        };

        setViewStatusData(viewStatusData);
        setManagerUserData(updatedManagerData);
    };

    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        fetchData();
    }, [dataChanged]);

    return (
        <>
            <SideMenu>
                <FolderManager>
                    <FolderInstancesList
                        managerDataData={null}
                        managerUserData={managerUserData}
                        viewUserData={viewUserData}
                        typeData={typeData}
                        type={null}
                        parentId={null}
                        setMain={setMain}
                    ></FolderInstancesList>
                </FolderManager>
            </SideMenu>
            <div>
                <MainView
                    managerUserData={managerUserData}
                    dataChanged={dataChanged}
                    setDataChanged={setDataChanged}
                    mainView={mainView}
                    setMainView={setMainView}
                ></MainView>
            </div>
        </>
    );
}
