import { useState } from "react";
import { IconMinusSquare } from "../../../Icons/MinusSquare";
import { IconPlusSquare } from "../../../Icons/PlusSquare";
import {
    ManagerDataData,
    ManagerUserData,
    SetMain,
    TypeData,
    ViewUserData,
} from "../../Manager";
import { FolderObjectList } from "./FolderObjectList";
import { FolderInstancesList } from "./FolderInstancesList";

type SideMenuProps = {
    folderName: string;
    managerDataData: ManagerDataData;
    typeData: TypeData[];
    viewUserData: ViewUserData | null;
    type: TypeData[] | null;
    managerUserData: ManagerUserData;
    comeFrom: string;
    parentId: string | null;
    setMain: SetMain;
    setMainFunction: any;
};
export function Folder({
    folderName,
    managerDataData,
    typeData,
    viewUserData,
    type,
    managerUserData,
    comeFrom,
    parentId,
    setMain,
    setMainFunction,
}: SideMenuProps) {
    const [openClose, setOpenClose] = useState<boolean>(false);
    return (
        <div>
            <div className="items-center row">
                {openClose ? (
                    <div
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            setOpenClose(false);
                        }}
                    >
                        <IconMinusSquare />
                    </div>
                ) : (
                    <div
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            setOpenClose(true);
                        }}
                    >
                        <IconPlusSquare />
                    </div>
                )}
                <div
                    style={{ cursor: "pointer" }}
                    className={
                        "hover:bg-gray-200 px-1 rounded " +
                        (comeFrom === "FolderSystemList"
                            ? " font-bold  "
                            : " font-mono bg-gray-100")
                    }
                    onClick={setMainFunction}
                >
                    {folderName}
                </div>
            </div>
            <div className="ml-5">
                {/* {JSON.stringify(managerDataDataDatas)} */}
                {openClose && comeFrom === "FolderSystemList" && (
                    <FolderObjectList
                        managerDataData={managerDataData}
                        viewUserData={viewUserData}
                        typeData={typeData}
                        type={type}
                        managerUserData={managerUserData}
                        parentId={parentId}
                        setMain={setMain}
                    ></FolderObjectList>
                )}
                {openClose && comeFrom === "FolderObjectList" && (
                    <FolderInstancesList
                        managerDataData={managerDataData}
                        viewUserData={viewUserData}
                        typeData={typeData}
                        type={type}
                        managerUserData={managerUserData}
                        parentId={parentId}
                        setMain={setMain}
                    ></FolderInstancesList>
                )}
            </div>
        </div>
    );
}
