import React, { useEffect } from "react";

function EditorMenu({ editorMenu, setEditorMenu, activeFile, setActiveFile, files, setFiles }) {
    useEffect(() => {
        setEditorMenu("");
    }, [editorMenu]);
    return (
        <div>
            <ul className="flex flex-row gap-1">
                <li>
                    <button className="hover:bg-gray-300 px-2 border border-gray-500 rounded" onClick={() => setEditorMenu("new")}>
                        Neu
                    </button>
                </li>
                <li>
                    <button className="hover:bg-gray-300 px-2 border border-gray-500 rounded" onClick={() => setEditorMenu("open")}>
                        Öffnen
                    </button>
                </li>
                <li>
                    <button className="hover:bg-gray-300 px-2 border border-gray-500 rounded" onClick={() => setEditorMenu("save")}>
                        Speichern
                    </button>
                </li>
                <li>
                    <button className="hover:bg-gray-300 px-2 border border-gray-500 rounded" onClick={() => setEditorMenu("back")}>
                        ↩️
                    </button>
                </li>
                <li>
                    <button className="hover:bg-gray-300 px-2 border border-gray-500 rounded" onClick={() => setEditorMenu("forward")}>
                        ↪️
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default EditorMenu;
