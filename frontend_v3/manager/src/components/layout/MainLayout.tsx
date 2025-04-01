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
            const navScript = document.createElement("script");
            navScript.src = "/scripts/nav.js";
            navScript.async = true;
            scriptRef.current.appendChild(navScript);

            const mainScript = document.createElement("script");
            mainScript.src = "/scripts/main.js";
            mainScript.async = true;
            scriptRef.current.appendChild(mainScript);
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navigation */}
            <div dangerouslySetInnerHTML={{ __html: navTag }} />

            {/* Hauptinhalt, wächst um den Platz zwischen Nav und Footer zu füllen */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <div
                className="bg-gray-200 w-full"
                dangerouslySetInnerHTML={{
                    __html: footerTag,
                }}
            />

            {/* Scripte */}
            <div ref={scriptRef}></div>
        </div>
    );
}
