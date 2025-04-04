import { useEffect, useRef, useState } from "react";
import { IconMinusSquare } from "../../../Icons/MinusSquare";
import { IconPlusSquare } from "../../../Icons/PlusSquare";
import { ConsoleOutput } from "../../../common/ConsoleOutput";
import { IconCopy } from "../../../Icons/Copy";

interface SideMenuProps {
    data: { id: string; state: any };
    setData: (data: any) => void;
    name: string;
}

export function DTState({ data, setData, name }: SideMenuProps) {
    const [state, setState] = useState<any>(data?.state);
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [tabVisible, setTabVisible] = useState<boolean>(false);
    const [hasNewData, setHasNewData] = useState(false);
    const [newDataCount, setNewDataCount] = useState(0);

    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const scrollRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});
    const contentScrollRef = useRef<HTMLDivElement | null>(null);
    const topRef = useRef<HTMLDivElement>(null);
    const fromSocketRef = useRef(false);
    const connectWebSocket = () => {
        const socket = new WebSocket("ws://localhost:8888");
        socketRef.current = socket;

        socket.onopen = () => {
            socket.send(JSON.stringify({ name, id: data?.id }));
            reconnectTimeoutRef.current &&
                clearTimeout(reconnectTimeoutRef.current);
        };

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.data) {
                setState(msg.data);

                const keys = Object.keys(msg.data?.output || {});
                const latestKey = keys[keys.length - 1];

                setHasNewData(true);
                setNewDataCount((prev) => prev + 1);

                fromSocketRef.current = true;
                setActiveTab(latestKey);
            }
        };

        socket.onclose = () => {
            if (!reconnectTimeoutRef.current) {
                reconnectTimeoutRef.current = setTimeout(
                    connectWebSocket,
                    1000
                );
            }
        };
    };
    const handleTabVisible = () => {
        setTabVisible(!tabVisible);
        setHasNewData(false);
        setNewDataCount(0);
        const keys = Object.keys(state?.output || {});
        const latestKey = keys[keys.length - 1];
        setActiveTab(latestKey);
    };
    const getInitStateColor = (state: string) => {
        switch (state) {
            case "ready":
                return "text-green-500";
            case "error":
                return "text-red-500";
            case "running":
                return "text-yellow-500";
            default:
                return "";
        }
    };
    useEffect(() => {
        connectWebSocket();
        return () => {
            socketRef.current?.close();
            reconnectTimeoutRef.current &&
                clearTimeout(reconnectTimeoutRef.current);
        };
    }, [data?.id, name]);

    useEffect(() => {
        setState(data?.state);
    }, [data]);

    // Scroll accordion title to top
    useEffect(() => {
        if (
            tabVisible &&
            activeTab &&
            fromSocketRef.current &&
            scrollRefs.current[activeTab]
        ) {
            scrollRefs.current[activeTab]?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
            fromSocketRef.current = false; // zurücksetzen
        }
    }, [activeTab, tabVisible]);

    // Scroll log content to bottom
    useEffect(() => {
        if (tabVisible && contentScrollRef.current) {
            contentScrollRef.current.scrollTo({
                top: contentScrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [state?.output, activeTab, tabVisible]);
    if (name != "instance") {
        return null;
    }
    return (
        <>
            <div>
                API: <br />
                GetState:
                <div className="ml-2">
                    http://localhost:3000/api/v1/controller/instance/{data?.id}
                    /state
                    <button
                        title="Copy to Clipboard"
                        className="mx-2 w-4 hover:text-amber-800 pointer"
                        onClick={() => {
                            navigator.clipboard.writeText(
                                `http://localhost:3000/api/v1/controller/instance/${data?.id}/state`
                            );
                        }}
                    >
                        <IconCopy></IconCopy>
                    </button>
                </div>
                Controll:
                <div className="ml-2">
                    http://localhost:3000/api/v1/controller/instance/{data?.id}
                    /(active
                    <button
                        title="Copy to Clipboard : active"
                        className="mx-2 w-4 hover:text-amber-800 pointer"
                        onClick={() => {
                            navigator.clipboard.writeText(
                                `http://localhost:3000/api/v1/controller/instance/${data?.id}/active`
                            );
                        }}
                    >
                        <IconCopy></IconCopy>
                    </button>
                    | inactive{" "}
                    <button
                        title="Copy to Clipboard : inactive"
                        className="mx-2 w-4 hover:text-amber-800 pointer"
                        onClick={() => {
                            navigator.clipboard.writeText(
                                `http://localhost:3000/api/v1/controller/instance/${data?.id}/inactive`
                            );
                        }}
                    >
                        <IconCopy></IconCopy>
                    </button>
                    | restart
                    <button
                        title="Copy to Clipboard : restart"
                        className="mx-2 w-4 hover:text-amber-800 pointer"
                        onClick={() => {
                            navigator.clipboard.writeText(
                                `http://localhost:3000/api/v1/controller/instance/${data?.id}/restart`
                            );
                        }}
                    >
                        <IconCopy></IconCopy>
                    </button>
                    )
                </div>
                Output:
                <div className="ml-2">
                    http://localhost:3000/api/v1/controller/instance/{data?.id}
                    /output
                    <button
                        title="Copy to Clipboard : output"
                        className="mx-2 w-4 hover:text-amber-800 pointer"
                        onClick={() => {
                            navigator.clipboard.writeText(
                                ` http://localhost:3000/api/v1/controller/instance/${data?.id}/output`
                            );
                        }}
                    >
                        <IconCopy></IconCopy>
                    </button>
                </div>
                Ips:{" "}
                {state?.ips?.map((ip: string, i: number) => {
                    return (
                        <div className="flex gap-2 ml-2" key={i}>
                            {ip}
                            <button
                                title="Copy to Clipboard : ip"
                                className="w-4 hover:text-amber-800 pointer"
                                onClick={() => {
                                    navigator.clipboard.writeText(ip);
                                }}
                            >
                                <IconCopy></IconCopy>
                            </button>
                            <a
                                title={"Open in new tab " + "http://" + ip}
                                target="_blank"
                                className="text-amber-500 hover:text-amber-800"
                                href={"http://" + ip}
                            >
                                http
                            </a>
                            <a
                                title={"Open in new tab " + "https://" + ip}
                                target="_blank"
                                className="text-amber-500 hover:text-amber-800"
                                href={"https://" + ip}
                            >
                                https
                            </a>
                            {i < state.ips.length - 1 && ", "}
                        </div>
                    );
                })}{" "}
                Initstate:{" "}
                <span className={getInitStateColor(state?.commander)}>
                    {state?.commander ?? ""}
                </span>
            </div>
            <div ref={topRef}></div>
            <div className="flex gap-2 mb-2">
                {/* <button
                    onClick={() =>
                        topRef.current?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="bg-gray-100 hover:bg-amber-200 px-2 py-1 border rounded pointer"
                >
                    ^ Scroll to top
                </button> */}
                {/* <button
                    onClick={() => setActiveTab(null)}
                    className="bg-gray-100 hover:bg-amber-200 px-2 py-1 border rounded pointer"
                >
                    Close all
                </button> */}

                <button
                    onClick={() => {
                        handleTabVisible();
                    }}
                    className="relative bg-gray-100 hover:bg-amber-200 px-2 py-1 border rounded pointer"
                >
                    {tabVisible ? "Hide output" : "Show output"}

                    {!tabVisible && (
                        <span className="bg-red-600 ml-2 px-2 rounded-full text-white">
                            {newDataCount > 99 ? "99+" : newDataCount}
                        </span>
                    )}
                </button>
            </div>
            {tabVisible && state?.output && (
                <div>
                    <div className="top-0 left-0 absolute bg-gray-500/50 backdrop-blur-xs w-full h-full"></div>
                    <div className="top-0 left-0 absolute w-full h-full">
                        <button
                            onClick={() => {
                                handleTabVisible();
                            }}
                            className="top-0 right-0 z-10 absolute p-4 pointer"
                        >
                            <div className="flex justify-center items-center bg-red-500 shadow shadow-black hover:shadow-inner rounded-full w-8 aspect-square font-bold text-white text-2xl">
                                <div className="flex justify-center items-center w-8 aspect-square">
                                    <div className="absolute bg-white w-5 h-[3px] rotate-45"></div>
                                    <div className="absolute bg-white w-5 h-[3px] rotate-[135deg]"></div>
                                </div>
                            </div>
                        </button>

                        <div className="top-0 right-0 bottom-0 left-0 absolute bg-white m-5 p-4 rounded-xl">
                            <>
                                <div className="flex flex-wrap gap-2 mb-2 pb-1 border-b">
                                    {Object.keys(state.output).map((key, i) => (
                                        <button
                                            key={key}
                                            onClick={() => setActiveTab(key)}
                                            className={`px-3 py-1 border rounded-t text-xs ${
                                                activeTab === key
                                                    ? "bg-white border-b-0 font-bold"
                                                    : "bg-gray-100"
                                            }`}
                                        >
                                            Output {i + 1}
                                        </button>
                                    ))}
                                </div>
                                {activeTab && (
                                    <>
                                        <div>{activeTab}</div>
                                        <div
                                            ref={contentScrollRef}
                                            className="p-2 border rounded-b max-h-[calc(100vh-135px)] overflow-y-auto"
                                        >
                                            {Object.entries(
                                                (state.output[activeTab] ??
                                                    {}) as Record<string, any[]>
                                            ).map(([subKey, entries]) => (
                                                <div
                                                    key={subKey}
                                                    className="mb-2"
                                                >
                                                    {entries.length > 0 && (
                                                        <strong>
                                                            {subKey}
                                                        </strong>
                                                    )}
                                                    <div className="pl-2 text-xs">
                                                        {entries.map(
                                                            (d, iii) => (
                                                                <div key={iii}>
                                                                    <ConsoleOutput
                                                                        output={
                                                                            d
                                                                        }
                                                                    />
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
