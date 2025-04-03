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
export function MainViewSoftware({
    mainView,
    setMainView,
    dataChanged,
    setDataChanged,
    managerUserData,
}: SideMenuProps) {
    const getData = () => {
        const softwares = managerUserData.data.find(
            (item) => item.type === "softwares"
        );
        const software = softwares?.data.find(
            (item) => item.id === mainView.id
        );
        return software;
    };
    const deleteSoftware = async () => {
        const response = await fetcher(`softwares/${mainView.id}`, {
            method: "DELETE",
        });
        return response;
    };
    const onclickDelete = async () => {
        const res = await deleteSoftware();
        if (res.message == "deleteOne") {
            setDataChanged(!dataChanged);
            setMainView({ type: "softwares", id: "" });
        } else {
            console.log("error");
        }
    };
    const updateSoftware = async () => {
        const response = await fetcher(`softwares/${mainView.id}`, {
            method: "PUT",
            body: JSON.stringify(softwareData),
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    };
    const onClickSave = async () => {
        const res = await updateSoftware();
        if (res.message == "updateOne") {
            setDataChanged(!dataChanged);
        } else {
            console.log("error");
        }
    };
    const [softwareData, setSoftwareData] =
        useState<ManagerDataDataData | null>(null);
    const [softwareDataBeforEdit, setSoftwareDataBeforEdit] =
        useState<ManagerDataDataData | null>(null);
    const [showDelete, setShowDelete] = useState(false);
    const [showDelete2, setShowDelete2] = useState(false);
    const [edit, setEdit] = useState(false);
    useEffect(() => {
        setSoftwareData(getData() ?? null);
    }, [mainView.id, managerUserData]);

    return (
        <div>
            <div>Software: {softwareData?.name}</div>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Name:</td>
                            {!edit && <td>{softwareData?.name}</td>}
                            {edit && (
                                <td>
                                    <input
                                        type="text"
                                        value={softwareData?.name || ""}
                                        onChange={(e) =>
                                            setSoftwareData(
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
                            {!edit && <td>{softwareData?.description}</td>}
                            {edit && (
                                <td>
                                    <input
                                        type="text"
                                        value={softwareData?.description}
                                        onChange={(e) =>
                                            setSoftwareData(
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
                            setSoftwareDataBeforEdit(softwareData);
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
                                setSoftwareData(softwareDataBeforEdit);
                            }}
                            className="button"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                setEdit(!edit);
                                console.log(softwareData);
                                onClickSave();
                                setSoftwareDataBeforEdit(null);
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
                            {showDelete && <p>Delete the Software?</p>}
                            <p>
                                &nbsp;
                                {showDelete2 && (
                                    <>
                                        Are you sure you want to delete the
                                        Software?
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
