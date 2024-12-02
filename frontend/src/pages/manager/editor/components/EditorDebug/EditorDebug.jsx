import React, { useEffect } from "react";

function EditorDebug({ editorMenu, setEditorMenu, activeFile, setActiveFile, files, setFiles }) {
    useEffect(() => {
        editorMenu != "" && console.log("editorMenu", editorMenu);
    }, [editorMenu]);
    return (
        <div>
            <div className="font-bold">EditorDebug</div>
            <div>EditorMenu: {editorMenu}</div>
        </div>
    );
}

export default EditorDebug;
