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
export function MainViewSoftwareNew({
    dataChanged,
    mainView,
    setMainView,
    setDataChanged,
}: SideMenuProps) {
    const [newSoftware, setNewSoftware] = useState({
        name: "",
        description: "",
    });
    const sendNewSoftware = async () => {
        const response = await fetcher("softwares", {
            method: "POST",
            body: JSON.stringify(newSoftware),
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(response);
    };
    const onclickSave = () => {
        sendNewSoftware();
        setDataChanged(!dataChanged);
        setMainView({ type: "softwares", id: "" });
    };
    return (
        <div className="">
            <div>Create a New Software</div>

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
                                value={newSoftware.name}
                                onChange={(e) =>
                                    setNewSoftware({
                                        ...newSoftware,
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
                                    newSoftware.description
                                }
                                onChange={(e) =>
                                    setNewSoftware({
                                        ...newSoftware,
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
