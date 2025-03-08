import { ReactNode } from "react";
// @ts-ignore
import htmlContent from "../../../../html/site/components/navtag.html";
interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
            <main>{children}</main>
            <footer>Footer</footer>
        </>
    );
}
