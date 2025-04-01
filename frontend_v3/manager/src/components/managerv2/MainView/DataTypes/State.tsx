import { useEffect, useRef, useState } from "react";
import { IconMinusSquare } from "../../../Icons/MinusSquare";
import { IconPlusSquare } from "../../../Icons/PlusSquare";
import { ConsoleOutput } from "../../../common/ConsoleOutput";

interface SideMenuProps {
    data: { id: string; state: any };
    setData: (data: any) => void;
    name: string;
}

export function DTState({ data, setData, name }: SideMenuProps) {
    const [state, setState] = useState<any>(data?.state);
    const [openKey, setOpenKey] = useState<string | null>(null);
    const [accordionVisible, setAccordionVisible] = useState<boolean>(true);
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
            socket.send(JSON.stringify({ name, id: data.id }));
            reconnectTimeoutRef.current &&
                clearTimeout(reconnectTimeoutRef.current);
        };

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.data) {
                setState(msg.data);

                const keys = Object.keys(msg.data?.output || {});
                const latestKey = keys[keys.length - 1];

                if (!accordionVisible) {
                    setHasNewData(true);
                    setNewDataCount((prev) => prev + 1);
                    return;
                }

                fromSocketRef.current = true;
                setOpenKey(latestKey);
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
            accordionVisible &&
            openKey &&
            fromSocketRef.current &&
            scrollRefs.current[openKey]
        ) {
            scrollRefs.current[openKey]?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
            fromSocketRef.current = false; // zurücksetzen
        }
    }, [openKey, accordionVisible]);

    // Scroll log content to bottom
    useEffect(() => {
        if (accordionVisible && contentScrollRef.current) {
            contentScrollRef.current.scrollTo({
                top: contentScrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [state?.output, openKey, accordionVisible]);

    return (
        <>
            <div ref={topRef}></div>
            <div className="flex gap-2 mb-2">
                <button
                    onClick={() =>
                        topRef.current?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="bg-gray-100 px-2 py-1 border rounded"
                >
                    ^ Scroll to top
                </button>
                <button
                    onClick={() => setOpenKey(null)}
                    className="bg-gray-100 px-2 py-1 border rounded"
                >
                    Close all
                </button>

                <button
                    onClick={() => {
                        setAccordionVisible(!accordionVisible);
                        setHasNewData(false);
                        setNewDataCount(0);
                    }}
                    className="relative bg-gray-100 px-2 py-1 border rounded"
                >
                    {accordionVisible ? "Hide output" : "Show output"}

                    {!accordionVisible && (
                        <span className="bg-red-600 ml-2 px-2 rounded-full text-white">
                            {newDataCount}
                        </span>
                    )}
                </button>
            </div>

            {accordionVisible && state?.output && (
                <ul>
                    {Object.keys(state.output).map((key, i) => (
                        <li
                            key={i}
                            ref={(el) => {
                                scrollRefs.current[key] = el;
                            }}
                            className="mb-2 border border-gray-300 rounded"
                        >
                            <div
                                onClick={() =>
                                    setOpenKey(openKey === key ? null : key)
                                }
                                className="flex flex-row items-center gap-2 bg-gray-200 px-2 py-1 cursor-pointer"
                            >
                                {openKey === key ? (
                                    <IconMinusSquare />
                                ) : (
                                    <IconPlusSquare />
                                )}
                                {key}
                            </div>
                            {openKey === key && (
                                <div
                                    ref={contentScrollRef}
                                    className="bg-black p-2 max-h-[70vh] overflow-y-auto text-white"
                                >
                                    {Object.entries(
                                        state.output[key] as Record<
                                            string,
                                            any[]
                                        >
                                    ).map(([subKey, entries]) => (
                                        <div key={subKey} className="mb-2">
                                            {entries.length > 0 && (
                                                <strong>{subKey}</strong>
                                            )}
                                            <div className="pl-2 text-xs">
                                                {entries.map((d, iii) => (
                                                    <div key={iii}>
                                                        <ConsoleOutput
                                                            output={d}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
