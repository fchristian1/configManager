import { useEffect, useState } from "react";
import { ManagerDataDataData, ManagerUserData } from "../../Manager";
import { fetcher } from "../../../../services/common/fetcher";

type SideMenuProps = {
    token: string;
    mainView: { type: string; id: string };
    setMainView: (mainView: { type: string; id: string }) => void;
    dataChanged: boolean;
    setDataChanged: (dataChanged: boolean) => void;
    managerUserData: ManagerUserData;
};
export function MainViewProject({
    mainView,
    setMainView,
    dataChanged,
    setDataChanged,
    managerUserData,
}: SideMenuProps) {
    const getData = () => {
        const projects = managerUserData.data.find(
            (item) => item.type === "projects"
        );
        const project = projects?.data.find((item) => item.id === mainView.id);
        return project;
    };
    const deleteProject = async () => {
        const response = await fetcher(`projects/${mainView.id}`, {
            method: "DELETE",
        });
        return response;
    };
    const onclickDelete = async () => {
        const res = await deleteProject();
        if (res.message == "deleteOne") {
            setDataChanged(!dataChanged);
            setMainView({ type: "projects", id: "" });
        } else {
            console.log("error");
        }
    };
    const updateProject = async () => {
        const response = await fetcher(`projects/${mainView.id}`, {
            method: "PUT",
            body: JSON.stringify(projectData),
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    };
    const onClickSave = async () => {
        const res = await updateProject();
        if (res.message == "updateOne") {
            setDataChanged(!dataChanged);
        } else {
            console.log("error");
        }
    };
    const [projectData, setProjectData] = useState<ManagerDataDataData | null>(
        null
    );
    const [projectDataBeforEdit, setProjectDataBeforEdit] =
        useState<ManagerDataDataData | null>(null);
    const [showDelete, setShowDelete] = useState(false);
    const [showDelete2, setShowDelete2] = useState(false);
    const [edit, setEdit] = useState(false);
    useEffect(() => {
        setProjectData(getData() ?? null);
    }, [mainView.id, managerUserData]);

    return (
        <div>
            <div>Project: {projectData?.name}</div>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Name:</td>
                            {!edit && <td>{projectData?.name}</td>}
                            {edit && (
                                <td>
                                    <input
                                        type="text"
                                        value={projectData?.name || ""}
                                        onChange={(e) =>
                                            setProjectData(
                                                (prev) =>
                                                    ({
                                                        ...prev,
                                                        name: e.target.value,
                                                    } as ManagerDataDataData)
                                            )
                                        }
                                    ></input>
                                </td>
                            )}
                        </tr>

                        <tr>
                            <td>Description:</td>
                            {!edit && <td>{projectData?.description}</td>}
                            {edit && (
                                <td>
                                    <input
                                        type="text"
                                        value={projectData?.description}
                                        onChange={(e) =>
                                            setProjectData(
                                                (prev) =>
                                                    ({
                                                        ...prev,
                                                        description:
                                                            e.target.value,
                                                    } as ManagerDataDataData)
                                            )
                                        }
                                    ></input>
                                </td>
                            )}
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                {!edit && (
                    <button
                        onClick={() => {
                            setEdit(!edit);
                            setProjectDataBeforEdit(projectData);
                        }}
                        className="button"
                    >
                        Edit
                    </button>
                )}
                {edit && (
                    <>
                        <button
                            onClick={() => {
                                setEdit(!edit);
                                setProjectData(projectDataBeforEdit);
                            }}
                            className="button"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                setEdit(!edit);
                                console.log(projectData);
                                onClickSave();
                                setProjectDataBeforEdit(null);
                            }}
                            className="button"
                        >
                            Save
                        </button>
                    </>
                )}
                <button onClick={() => setShowDelete(true)} className="button">
                    Delete
                </button>
            </div>
            {showDelete && (
                <div className="top-0 right-0 bottom-0 left-0 absolute">
                    <div className="flex justify-center items-center bg-gray-500 opacity-50 w-full h-full"></div>
                    <div className="top-0 right-0 bottom-0 left-0 absolute flex justify-center items-cente">
                        <div className="flex justify-center items-center col">
                            {showDelete && <p>Delete the Project?</p>}
                            <p>
                                &nbsp;
                                {showDelete2 && (
                                    <>
                                        Are you sure you want to delete the
                                        Project?
                                    </>
                                )}
                            </p>
                            <div className="row">
                                <button
                                    onClick={() => {
                                        showDelete && setShowDelete2(true);
                                        showDelete2 && setShowDelete(false);
                                        showDelete2 && onclickDelete();
                                        showDelete2 && setShowDelete2(false);
                                    }}
                                    className="button"
                                >
                                    Yes
                                </button>
                                {showDelete2 && <div className="mx-12"></div>}
                                <button
                                    onClick={() => {
                                        setShowDelete(false);
                                        setShowDelete2(false);
                                    }}
                                    className="button"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
