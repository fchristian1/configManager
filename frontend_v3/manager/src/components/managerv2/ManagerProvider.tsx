import { createContext, useEffect, useState, ReactNode } from "react";
import { fetcher } from "../../services/common/fetcher";

// Typen für den Context definieren
type MainView = {
    link: string;
    itemId?: string;
    parentId?: string;
    modus: string;
};

export type ManagerContextType = {
    sideMenuSelected: string;
    setData: (data: ManagerContextType) => void;
    mainView: MainView;
    configData: any;
    debug: { showJSON: boolean; showDebug: boolean };
} | null;

// Context erstellen
export const ManagerContext = createContext<ManagerContextType>(null);

// Funktion zur Änderung der Hauptansicht
export const setMainView = ({
    managerContext,
    mainView,
    itemId,
    parentId,
    modus,
}: {
    managerContext: ManagerContextType;
    mainView: string;
    itemId?: string;
    parentId?: string;
    modus: string;
}) => {
    if (!managerContext) return;

    managerContext.setData({
        ...managerContext,
        sideMenuSelected: itemId ?? "",
        mainView: {
            link: mainView,
            itemId,
            parentId,
            modus,
        },
    });
};
export const setDebug = ({
    managerContext,
    showJSON = false,
    showDebug = false,
}: {
    managerContext: ManagerContextType;
    showJSON: boolean;
    showDebug: boolean;
}) => {
    if (!managerContext) return;

    managerContext.setData({
        ...managerContext,
        debug: {
            showJSON,
            showDebug,
        },
    });
};

// Props-Typ für den Provider
type ManagerProviderProps = {
    children: ReactNode;
};

export const ManagerProvider = ({ children }: ManagerProviderProps) => {
    const [data, setData] = useState<ManagerContextType>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetcher("configs/manager", {
                    method: "GET",
                });

                setData({
                    sideMenuSelected: "",
                    setData,
                    mainView: {
                        link: "projects",
                        parentId: "",
                        modus: "list",
                    },

                    configData: response.configData,
                    debug: { showJSON: false, showDebug: false },
                });
            } catch (e: any) {
                console.error(e);
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <ManagerContext.Provider value={data}>
            {children}
        </ManagerContext.Provider>
    );
};
