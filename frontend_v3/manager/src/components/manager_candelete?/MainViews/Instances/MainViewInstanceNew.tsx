import { useState } from "react";
import { fetcher } from "../../../../services/common/fetcher";

type SideMenuProps = {
    token: string;
    dataChanged: boolean;
    mainView: {
        type: string;
        id: string;
        parentId?: string;
    };
    setMainView: (mainView: {
        type: string;
        id: string;
        parentId?: string;
    }) => void;
    setDataChanged: (dataChanged: boolean) => void;
};
export function MainViewInstanceNew({
    dataChanged,
    mainView,
    setMainView,
    setDataChanged,
}: SideMenuProps) {
    const [newInstance, setNewInstance] = useState({
        name: "",
        description: "",
        parentId: mainView.parentId,
    });
    const sendNewInstance = async () => {
        const response = await fetcher("instances", {
            method: "POST",
            body: JSON.stringify(newInstance),
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    };
    const onclickSave = async () => {
        const res = await sendNewInstance();
        if (res.message === "addOne") {
            setDataChanged(!dataChanged);
            setMainView({ type: "instances", id: "" });
        } else {
            console.log("Error");
        }
    };
    return (
        <div className="">
            <div>Create a New Instance</div>
            <table className="tableInput">
                <tbody>
                    <tr>
                        <td>
                            <label htmlFor="name">Name:</label>
                        </td>
                        <td>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={newInstance.name}
                                onChange={(e) =>
                                    setNewInstance({
                                        ...newInstance,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="description">Description:</label>
                        </td>
                        <td>
                            <input
                                type="text"
                                name="description"
                                id="description"
                                value={newInstance.description}
                                onChange={(e) =>
                                    setNewInstance({
                                        ...newInstance,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <button onClick={onclickSave} className="button">
                                Save
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
