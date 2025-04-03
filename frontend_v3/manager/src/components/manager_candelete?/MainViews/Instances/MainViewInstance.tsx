import { useEffect, useState } from "react";
import { ManagerDataDataData, ManagerUserData } from "../../Manager";
import { fetcher } from "../../../../services/common/fetcher";
import { Modules } from "./modules/IndexModules";

type SideMenuProps = {
    token: string;
    mainView: { type: string; id: string };
    setMainView: (mainView: { type: string; id: string }) => void;
    dataChanged: boolean;
    setDataChanged: (dataChanged: boolean) => void;
    managerUserData: ManagerUserData;
};
export function MainViewInstance({
    token,
    mainView,
    setMainView,
    dataChanged,
    setDataChanged,
    managerUserData,
}: SideMenuProps) {
    const getData = () => {
        const instances = managerUserData.data.find(
            (item) => item.type === "instances"
        );
        const instance = instances?.data.find(
            (item) => item.id === mainView.id
        );
        return instance;
    };
    const deleteInstance = async () => {
        const response = await fetcher(`instances/${mainView.id}`, {
            method: "DELETE",
        });
        return response;
    };
    const onclickDelete = async () => {
        const res = await deleteInstance();
        if (res.message == "deleteOne") {
            setDataChanged(!dataChanged);
            setMainView({ type: "instances", id: "" });
        } else {
            console.log("error");
        }
    };
    const updateInstance = async () => {
        const response = await fetcher(`instances/${mainView.id}`, {
            method: "PUT",
            body: JSON.stringify(instanceData),
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    };
    const onClickSave = async () => {
        const res = await updateInstance();
        if (res.message == "updateOne") {
            setDataChanged(!dataChanged);
        } else {
            console.log("error");
        }
    };
    const [instanceData, setInstanceData] =
        useState<ManagerDataDataData | null>(null);
    const [instanceDataBeforEdit, setInstanceDataBeforEdit] =
        useState<ManagerDataDataData | null>(null);
    const [showDelete, setShowDelete] = useState(false);
    const [showDelete2, setShowDelete2] = useState(false);
    const [edit, setEdit] = useState(false);
    useEffect(() => {
        setInstanceData(getData() ?? null);
    }, [mainView.id, managerUserData]);

    return (
        <div>
            <div>Instance: {instanceData?.name}</div>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Name:</td>
                            {!edit && <td>{instanceData?.name}</td>}
                            {edit && (
                                <td>
                                    <input
                                        type="text"
                                        value={instanceData?.name || ""}
                                        onChange={(e) =>
                                            setInstanceData(
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
                            {!edit && <td>{instanceData?.description}</td>}
                            {edit && (
                                <td>
                                    <input
                                        type="text"
                                        value={instanceData?.description}
                                        onChange={(e) =>
                                            setInstanceData(
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
                            setInstanceDataBeforEdit(instanceData);
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
                                setInstanceData(instanceDataBeforEdit);
                            }}
                            className="button"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                setEdit(!edit);
                                console.log(instanceData);
                                onClickSave();
                                setInstanceDataBeforEdit(null);
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
                            {showDelete && <p>Delete the Instance?</p>}
                            <p>
                                &nbsp;
                                {showDelete2 && (
                                    <>
                                        Are you sure you want to delete the
                                        Instance?
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
            <Modules
                token={token}
                mainView={mainView}
                setMainView={setMainView}
                dataChanged={dataChanged}
                setDataChanged={setDataChanged}
                managerUserData={managerUserData}
            ></Modules>
        </div>
    );
}
