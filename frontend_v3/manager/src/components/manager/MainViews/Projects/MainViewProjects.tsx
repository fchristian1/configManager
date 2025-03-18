import { useState } from "react";
import { ManagerUserData } from "../../Manager";

type SideMenuProps = { token: string };
export function MainViewProjects({ token }: SideMenuProps) {
    const [projects, setProjects] =
        useState<ManagerUserData | null>(null);

    return <div>MainViewProjects</div>;
}
