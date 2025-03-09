import React from "react";

function EditorStatus({ editorMenu, setEditorMenu, activeFile, setActiveFile, files, setFiles }) {
    return (
        <div className="mt-auto flex gap-2">
            <div>Status: save</div>|<div>System: docker-compose</div>|<div>Type: YAML</div>
        </div>
    );
}

export default EditorStatus;
