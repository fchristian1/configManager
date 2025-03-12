import { ReactNode, useEffect, useRef } from "react";
// @ts-ignore
import navTag from "../../../../html/site/components/navtag.html";
// @ts-ignore
interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const scriptRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scriptRef.current) {
            const script = document.createElement("script");
            script.src = "/scripts/nav.js"; // Falls du ein externes Skript hast
            script.async = true;
            scriptRef.current.appendChild(script);
        }
    }, []);
    return (
        <>
            <div dangerouslySetInnerHTML={{ __html: navTag }}></div>
            <main>{children}</main>
            <footer>Footer</footer>
            <div ref={scriptRef}></div>
        </>
    );
}
