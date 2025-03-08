import { ReactNode } from "react";

interface MainLayoutProps {
    children: ReactNode;
}
export function Manager({ children }: MainLayoutProps) {
    return (
        <div>
            Manager
            {children}
        </div>
    );
}
