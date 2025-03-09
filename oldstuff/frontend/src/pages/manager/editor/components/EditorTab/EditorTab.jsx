import React from "react";

function EditorTab({ editorMenu, setEditorMenu, activeFile, setActiveFile, files, setFiles }) {
    return (
        <div className="py-1">
            <ul className="flex gap-[1px]">
                <li className="border border-black">
                    <button
                        className="hover:bg-gray-300  "
                        onClick={(event) => {
                            event.stopPropagation();
                            console.log("datename");
                        }}
                    >
                        dateiname.yaml
                    </button>
                    <button
                        className="hover:bg-red-300 px-1"
                        onClick={(event) => {
                            event.stopPropagation();
                            console.log("x");
                        }}
                    >
                        ❌
                    </button>
                </li>
                <li className="border border-black">
                    <button
                        className="hover:bg-gray-300"
                        onClick={(event) => {
                            event.stopPropagation();
                            console.log("datename");
                        }}
                    >
                        dateiname2.yaml
                    </button>
                    <button
                        className="hover:bg-red-300 px-1"
                        onClick={(event) => {
                            event.stopPropagation();
                            console.log("x");
                        }}
                    >
                        ❌
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default EditorTab;
