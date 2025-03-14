import { useState } from "react";

type SideMenuProps = {
    children: React.ReactNode;
};

export function SideMenu({ children }: SideMenuProps) {
    const [showSideMenu, setShowSideMenu] = useState(false);
    return (
        <aside className={showSideMenu ? "open" : "normal"}>
            <span
                onClick={() => {
                    setShowSideMenu(!showSideMenu);
                }}
                id="asideMenuIcon"
            >
                X
            </span>
            <div>{children}</div>
        </aside>
    );
}
