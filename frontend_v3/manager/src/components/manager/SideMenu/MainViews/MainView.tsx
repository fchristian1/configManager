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

type SideMenuProps = {
    mainView: { type: string; id: string };
};
export function MainView({ mainView }: SideMenuProps) {
    const [token, setToken] = useState<string>("");
    useEffect(() => {
        setToken(localStorage.getItem("token") ?? "");
    }, []);
    return (
        <div>
            {mainView.type}
            {mainView.type === "projects" && (
                <MainViewProjects
                    token={token}
                ></MainViewProjects>
            )}
            {mainView.type === "project" && (
                <MainViewProject
                    token={token}
                ></MainViewProject>
            )}
            {mainView.type === "projectNew" && (
                <MainViewProjectNew
                    token={token}
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
