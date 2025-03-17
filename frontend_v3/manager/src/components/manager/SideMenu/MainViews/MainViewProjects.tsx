import { useEffect, useState } from "react";
import { fetcher } from "../../../../services/common/fetcher";
import { ManagerUserData } from "../../Manager";

type SideMenuProps = { token: string };
export function MainViewProjects({ token }: SideMenuProps) {
    const [projects, setProjects] =
        useState<ManagerUserData | null>(null);
    useEffect(() => {
        console.log("fetching projects");
        fetcher<ManagerUserData>(
            "projects",
            null,
            "GET",
            token
        ).then((data) => {
            setProjects(data);
        });
    }, []);
    return <div>MainViewProjects</div>;
}
