import React from "react";

function EditorEdit({ editorMenu, setEditorMenu, activeFile, setActiveFile, files, setFiles }) {
    const [content, setContent] = React.useState([
        { row: 1, col: 1, key: "version", value: "'3.1'" },
        { row: 2, col: 1, key: "services", value: "" },
        { row: 3, col: 2, key: "nginx", value: "" },
        { row: 4, col: 3, key: "image", value: "nginx:latest" },
        { row: 5, col: 3, key: "ports", value: "" },
        { row: 6, col: 4, key: "", value: "- 8080:80" },
        { row: 7, col: 2, key: "mongodb", value: "" },
        { row: 8, col: 3, key: "image", value: "mongo:latest" },
        { row: 9, col: 3, key: "ports", value: "" },
        { row: 10, col: 4, key: "", value: "- 27017:27017" },
    ]);
    return (
        <div className="flex-1 border border-black overflow-y-auto h-full font-mono p-1">
            {content.map((line) => (
                <div key={line.row} className="flex flex-row hover:bg-orange-50" style={{ paddingLeft: (line.col - 1) * 20 + "px" }}>
                    <div className="flex flex-row">
                        <div className="hover:bg-blue-200 rounded cursor-pointer">{line.key}</div>
                        <div className="text-gray-500">{line.key != "" && ":"}</div>
                    </div>
                    {line.key && "\u00A0"}
                    <div className="text-orange-700 hover:bg-stone-300 rounded cursor-pointer"> {line.value}</div>
                </div>
            ))}
        </div>
    );
}

export default EditorEdit;
