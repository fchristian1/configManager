import { ReactNode, useEffect, useRef } from "react";
// @ts-ignore
import navTag from "../../../../html/site/components/navtag.html";
// @ts-ignore
import footerTag from "../../../../html/site/components/footertag.html";

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
        if (scriptRef.current) {
            const script = document.createElement("script");
            script.src = "/scripts/main.js"; // Falls du ein externes Skript hast
            script.async = true;
            scriptRef.current.appendChild(script);
        }
    }, []);
    return (
        <>
            <div dangerouslySetInnerHTML={{ __html: navTag }}></div>
            <main className="flex flex-col justify-center">{children}</main>
            <div
                dangerouslySetInnerHTML={{
                    __html: footerTag,
                }}
            ></div>
            <div ref={scriptRef}></div>
        </>
    );
}
