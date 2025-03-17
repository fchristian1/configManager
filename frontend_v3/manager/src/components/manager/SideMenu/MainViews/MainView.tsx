import { useEffect, useState } from "react";
import { MainViewProject } from "./MainViewProject";
import { MainViewProjects } from "./MainViewProjects";
import { MainViewSoftware } from "./MainViewSoftware";
import { MainViewSoftwares } from "./MainViewSoftwares";
import { MainViewSystem } from "./MainViewSystem";
import { MainViewSystems } from "./MainViewSystems";

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
            {mainView.type === "systems" && (
                <MainViewSystems
                    token={token}
                ></MainViewSystems>
            )}
            {mainView.type === "system" && (
                <MainViewSystem
                    token={token}
                ></MainViewSystem>
            )}
        </div>
    );
}
