import { useState } from "react";
import { fetcher } from "../../../../services/common/fetcher";

type SideMenuProps = {
    token: string;
    dataChanged: boolean;
    mainView: { type: string; id: string };
    setMainView: (mainView: {
        type: string;
        id: string;
    }) => void;
    setDataChanged: (dataChanged: boolean) => void;
};
export function MainViewProjectNew({
    dataChanged,
    mainView,
    setMainView,
    setDataChanged,
}: SideMenuProps) {
    const [newProject, setNewProject] = useState({
        name: "",
        description: "",
    });
    const sendNewProject = async () => {
        const response = await fetcher("projects", {
            method: "POST",
            body: JSON.stringify(newProject),
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(response);
    };
    const onclickSave = () => {
        sendNewProject();
        setDataChanged(!dataChanged);
        setMainView({ type: "projects", id: "" });
    };
    return (
        <div className="">
            <div>Create a New Project</div>

            <table className="tableInput">
                <tbody>
                    <tr>
                        <td>
                            <label htmlFor="name">
                                Name:
                            </label>
                        </td>
                        <td>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={newProject.name}
                                onChange={(e) =>
                                    setNewProject({
                                        ...newProject,
                                        name: e.target
                                            .value,
                                    })
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="description">
                                Description:
                            </label>
                        </td>
                        <td>
                            <input
                                type="text"
                                name="description"
                                id="description"
                                value={
                                    newProject.description
                                }
                                onChange={(e) =>
                                    setNewProject({
                                        ...newProject,
                                        description:
                                            e.target.value,
                                    })
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <button
                                onClick={onclickSave}
                                className="button"
                            >
                                Save
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
