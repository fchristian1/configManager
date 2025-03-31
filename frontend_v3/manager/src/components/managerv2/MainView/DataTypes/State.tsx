import { useEffect, useRef, useState } from "react";
import { ConsoleOutput } from "../../../common/ConsoleOutput";
import { IconPlusSquare } from "../../../Icons/PlusSquare";
import { IconMinusSquare } from "../../../Icons/MinusSquare";

type SideMenuProps = { data: any; setData: any; name: string };

export function DTState({ data, setData, name }: SideMenuProps) {
    const [state, setState] = useState<any>(data?.state);
    const [show, setShow] = useState<any>({});
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connectWebSocket = () => {
        //console.log("Versuche, WebSocket-Verbindung herzustellen...");
        const socket = new WebSocket("ws://localhost:8888");
        socketRef.current = socket;

        socket.onopen = () => {
            //console.log("Verbindung zum Server hergestellt");
            socket.send(JSON.stringify({ name, id: data.id }));
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        };

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            //console.log("ws:message:", msg.data);

            // Aktualisiere den Zustand basierend auf der Nachricht
            if (msg.data) {
                setState(msg.data);
            }
        };

        socket.onerror = (error) => {
            console.error("WebSocket-Fehler:", error);
        };

        socket.onclose = () => {
            //console.log("WebSocket-Verbindung geschlossen");
            // Versuche, die Verbindung nach einer kurzen Verzögerung wiederherzustellen
            if (!reconnectTimeoutRef.current) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    connectWebSocket();
                }, 1000); // 1 Sekunde warten, bevor erneut versucht wird
            }
        };
    };

    useEffect(() => {
        // WebSocket-Verbindung herstellen
        connectWebSocket();

        // Cleanup-Funktion: WebSocket-Verbindung schließen
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        };
    }, [data?.id, name]);

    useEffect(() => {
        setState(data?.state);
    }, [data]);

    useEffect(() => {
        //console.log("state:", state);
    }, [state]);

    return (
        <>
            {state && (
                <>
                    State:
                    <ul>
                        {state?.commander && (
                            <li className="ml-2">Status: {state?.commander}</li>
                        )}
                        {state?.ips && (
                            <li className="ml-2">
                                IPs:
                                <ul>
                                    {state?.ips.map((ip: any) => (
                                        <li className="ml-2" key={ip}>
                                            {ip}
                                        </li>
                                    ))}
                                    {state?.ips.length === 0 && (
                                        <li className="ml-2">No IPs</li>
                                    )}
                                </ul>
                            </li>
                        )}
                        {state?.error && (
                            <li className="ml-2">
                                Errors:
                                <ul>
                                    {Object.keys(state?.error).map((key) => (
                                        <li className="ml-2" key={key}>
                                            {key}:{state?.error[key].toString()}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        )}

                        {state?.output && (
                            <li className="ml-2">
                                <div className="flex items-center gap-1">
                                    {(!show?.output ||
                                        show?.output == false) && (
                                        <div
                                            onClick={() => {
                                                setShow({
                                                    ...show,
                                                    output: true,
                                                });
                                            }}
                                            className="pointer"
                                        >
                                            <IconPlusSquare></IconPlusSquare>
                                        </div>
                                    )}
                                    {show?.output && (
                                        <div
                                            onClick={() => {
                                                setShow({
                                                    ...show,
                                                    output: false,
                                                });
                                            }}
                                            className="pointer"
                                        >
                                            <IconMinusSquare></IconMinusSquare>
                                        </div>
                                    )}
                                    Outputs:
                                </div>
                                <ul>
                                    {show?.output &&
                                        Object.keys(state?.output).map(
                                            (output, i) => {
                                                return (
                                                    <li
                                                        key={i}
                                                        className="ml-2"
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            {(!show?.[output] ||
                                                                show?.[
                                                                    output
                                                                ] == false) && (
                                                                <div
                                                                    onClick={() => {
                                                                        setShow(
                                                                            {
                                                                                ...show,
                                                                                [output]:
                                                                                    true,
                                                                            }
                                                                        );
                                                                    }}
                                                                    className="pointer"
                                                                >
                                                                    <IconPlusSquare></IconPlusSquare>
                                                                </div>
                                                            )}
                                                            {show?.[output] && (
                                                                <div
                                                                    onClick={() => {
                                                                        setShow(
                                                                            {
                                                                                ...show,
                                                                                [output]:
                                                                                    false,
                                                                            }
                                                                        );
                                                                    }}
                                                                    className="pointer"
                                                                >
                                                                    <IconMinusSquare></IconMinusSquare>
                                                                </div>
                                                            )}
                                                            {output}:
                                                        </div>
                                                        {show?.[output] && (
                                                            <ul>
                                                                {Object.keys(
                                                                    state
                                                                        ?.output[
                                                                        output
                                                                    ]
                                                                ).map(
                                                                    (
                                                                        key,
                                                                        ii
                                                                    ) => {
                                                                        return (
                                                                            <li
                                                                                className="ml-2"
                                                                                key={
                                                                                    ii
                                                                                }
                                                                            >
                                                                                {
                                                                                    key
                                                                                }

                                                                                :
                                                                                <ul>
                                                                                    {state
                                                                                        ?.output[
                                                                                        output
                                                                                    ]?.[
                                                                                        key
                                                                                    ] &&
                                                                                        state?.output[
                                                                                            output
                                                                                        ][
                                                                                            key
                                                                                        ].map(
                                                                                            (
                                                                                                d: any,
                                                                                                iii: number
                                                                                            ) => {
                                                                                                return (
                                                                                                    <li
                                                                                                        key={
                                                                                                            iii
                                                                                                        }
                                                                                                        className="ml-2 text-xs"
                                                                                                    >
                                                                                                        <ConsoleOutput
                                                                                                            output={
                                                                                                                d
                                                                                                            }
                                                                                                        ></ConsoleOutput>
                                                                                                    </li>
                                                                                                );
                                                                                            }
                                                                                        )}
                                                                                </ul>
                                                                            </li>
                                                                        );
                                                                    }
                                                                )}
                                                            </ul>
                                                        )}
                                                    </li>
                                                );
                                            }
                                        )}
                                </ul>
                            </li>
                        )}
                    </ul>
                </>
            )}
        </>
    );
}
