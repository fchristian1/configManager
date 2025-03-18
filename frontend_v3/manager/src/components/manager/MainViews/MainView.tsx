import { useEffect, useState } from "react";
import { MainViewProject } from "./Projects/MainViewProject";
import { MainViewProjects } from "./Projects/MainViewProjects";
import { MainViewSoftware } from "./Softwares/MainViewSoftware";
import { MainViewSoftwares } from "./Softwares/MainViewSoftwares";
import { MainViewInstance } from "./Instances/MainViewInstance";
import { MainViewInstances } from "./Instances/MainViewInstances";
import { MainViewProjectNew } from "./Projects/MainViewProjectNew";
import { MainViewSoftwareNew } from "./Softwares/MainViewSoftwareNew";
import { MainViewInstanceNew } from "./Instances/MainViewProjectNew";
import { ManagerUserData } from "../Manager";

type SideMenuProps = {
    mainView: { type: string; id: string };
    setMainView: (mainView: {
        type: string;
        id: string;
    }) => void;
    dataChanged: boolean;
    setDataChanged: (dataChanged: boolean) => void;
    managerUserData: ManagerUserData;
};
export function MainView({
    mainView,
    setMainView,
    dataChanged,
    setDataChanged,
    managerUserData,
}: SideMenuProps) {
    const [token, setToken] = useState<string>("");
    useEffect(() => {
        setToken(localStorage.getItem("token") ?? "");
    }, []);
    return (
        <div>
            {/* {mainView.type} */}
            {mainView.type === "projects" && (
                <MainViewProjects
                    token={token}
                ></MainViewProjects>
            )}
            {mainView.type === "project" && (
                <MainViewProject
                    mainView={mainView}
                    setMainView={setMainView}
                    dataChanged={dataChanged}
                    setDataChanged={setDataChanged}
                    managerUserData={managerUserData}
                    token={token}
                ></MainViewProject>
            )}
            {mainView.type === "projectNew" && (
                <MainViewProjectNew
                    token={token}
                    mainView={mainView}
                    setMainView={setMainView}
                    dataChanged={dataChanged}
                    setDataChanged={setDataChanged}
                ></MainViewProjectNew>
            )}
            {mainView.type === "software" && (
                <MainViewSoftware
                    token={token}
                ></MainViewSoftware>
            )}
            {mainView.type === "softwares" && (
                <MainViewSoftwares
                    token={token}
                ></MainViewSoftwares>
            )}
            {mainView.type === "softwareNew" && (
                <MainViewSoftwareNew
                    token={token}
                ></MainViewSoftwareNew>
            )}
            {mainView.type === "instances" && (
                <MainViewInstances
                    token={token}
                ></MainViewInstances>
            )}
            {mainView.type === "instance" && (
                <MainViewInstance
                    token={token}
                ></MainViewInstance>
            )}
            {mainView.type === "instanceNew" && (
                <MainViewInstanceNew
                    token={token}
                ></MainViewInstanceNew>
            )}
        </div>
    );
}
