import React, { useState, version } from "react";
import EditorMenu from "./EditorMenu/EditorMenu";
import EditorEdit from "./EditorEdit/EditorEdit";
import EditorStatus from "./EditorStatus/EditorStatus";
import EditorTab from "./EditorTab/EditorTab";
import EditorDebug from "./EditorDebug/EditorDebug";

function EditorMain() {
    const [debug, setDebug] = useState(false);
    const [editorMenu, setEditorMenu] = useState("");
    const [activeFile, setActiveFile] = useState({ id_file: "e637bee6-bfb6-4102-9050-66bb876f38b5" });
    const [files, setFiles] = useState([
        {
            id: "e637bee6-bfb6-4102-9050-66bb876f38b5",
            filename: "docker-compose.yml",
            title: "nginx,mongodb",
            description: "",
            system: "docker-compose",
            type: "YAML",
            content: [
                {
                    version: 1,
                    content: [
                        { row: 1, col: 1, text: "version: '3.1'" },
                        { row: 2, col: 1, text: "services:" },
                        { row: 3, col: 2, text: "nginx:" },
                        { row: 4, col: 3, text: "image: nginx:latest" },
                        { row: 5, col: 3, text: "ports:" },
                        { row: 6, col: 4, text: "- 8080:80" },
                        { row: 7, col: 2, text: "mongodb:" },
                        { row: 8, col: 3, text: "image: mongo:latest" },
                        { row: 9, col: 3, text: "ports:" },
                        { row: 10, col: 4, text: "- 27017:27017" },
                    ],
                },
            ],
        },
    ]);
    return (
        <div className="flex h-full flex-col overflow-hidden">
            <EditorMenu
                editorMenu={editorMenu}
                setEditorMenu={setEditorMenu}
                activeFile={activeFile}
                setActiveFile={setActiveFile}
                files={files}
                setFiles={setFiles}
            ></EditorMenu>
            <EditorTab
                editorMenu={editorMenu}
                setEditorMenu={setEditorMenu}
                activeFile={activeFile}
                setActiveFile={setActiveFile}
                files={files}
                setFiles={setFiles}
            ></EditorTab>
            <EditorEdit
                editorMenu={editorMenu}
                setEditorMenu={setEditorMenu}
                activeFile={activeFile}
                setActiveFile={setActiveFile}
                files={files}
                setFiles={setFiles}
            ></EditorEdit>
            <EditorStatus
                editorMenu={editorMenu}
                setEditorMenu={setEditorMenu}
                activeFile={activeFile}
                setActiveFile={setActiveFile}
                files={files}
                setFiles={setFiles}
            ></EditorStatus>
            {debug && (
                <EditorDebug
                    editorMenu={editorMenu}
                    setEditorMenu={setEditorMenu}
                    activeFile={activeFile}
                    setActiveFile={setActiveFile}
                    files={files}
                    setFiles={setFiles}
                ></EditorDebug>
            )}
        </div>
    );
}

export default EditorMain;
