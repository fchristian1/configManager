import { useEffect, useState } from "react";
import { FolderManager } from "./SideMenu/FolderManager/IndexFolderManager";
import { SideMenu } from "./SideMenu/IndexSideMenu";

import { MainView } from "./SideMenu/MainViews/MainView";
import { getAll } from "../../services/data";
import { FolderInstancesList } from "./SideMenu/FolderManager/FolderInstancesList";

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
    setProjectNew: (id: string) => void;
    setSoftwares: (id?: string) => void;
    setSoftware: (id: string) => void;
    setSoftwareNew: (id: string) => void;
    setInstances: (id?: string) => void;
    setInstance: (id: string) => void;
    setInstanceNew: (id: string) => void;
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
    }>({
        type: "projects",
        id: "",
    });

    const [managerUserData, setManagerData] =
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
        setProjectNew: (id: string) => {
            setMainView({ type: "projectNew", id: id });
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
        setSoftwareNew: (id: string) => {
            setMainView({ type: "softwareNew", id: id });
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
        setInstanceNew: (id: string) => {
            setMainView({ type: "instanceNew", id: id });
        },
    };
    const fetchData = async () => {
        const getManagerData: ManagerUserData = {
            userId: localStorage.getItem("userId") ?? "",
            data: [
                {
                    type: "projects",
                    data: [
                        {
                            id: "6653b8af-a8fb-498c-b0b5-131260cbb67d",
                            name: "Project 1",
                        },
                        {
                            id: "5fd649ee-ac11-48b1-ba71-58abf0c32712",
                            name: "Project 2",
                        },
                    ],
                },
                {
                    type: "softwares",
                    data: [
                        {
                            id: "3dacc65e-4445-4830-af44-386969571181",
                            name: "Software 1",
                        },
                    ],
                },
                {
                    type: "instances",
                    data: [
                        {
                            parentId:
                                "6653b8af-a8fb-498c-b0b5-131260cbb67d",
                            id: "3dacc65e-4445-4830-af44-386969571181",
                            name: "Instance 1",
                        },
                    ],
                },
            ],
        };
        getManagerData.data.forEach(async (item) => {
            const dataFromApi = await getAll(item.type);
            item.data = dataFromApi ?? [];
        });
        const viewStatusData: ViewUserData = {
            userId: getManagerData.userId,
            data: [],
        };
        setViewStatusData(viewStatusData);
        setManagerData(getManagerData);
    };

    useEffect(() => {
        fetchData();
    }, []);
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
                <MainView mainView={mainView}></MainView>
            </div>
        </>
    );
}
