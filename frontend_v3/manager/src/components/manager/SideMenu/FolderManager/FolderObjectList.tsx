import {
    findType,
    ManagerDataData,
    ManagerUserData,
    SetMain,
    TypeData,
    ViewUserData,
} from "../../Manager";
import { Folder } from "./Folder";

type SideMenuProps = {
    managerDataData: ManagerDataData | null;
    viewUserData: ViewUserData | null;
    typeData: TypeData[];
    type: TypeData[] | null;
    managerUserData: ManagerUserData;
    parentId: string | null;
    setMain: SetMain;
};
export function FolderObjectList({
    managerDataData,
    viewUserData,
    typeData,
    type,
    managerUserData,
    parentId,
    setMain,
}: SideMenuProps) {
    const td = findType(typeData, managerDataData?.type ?? "");
    if (td?.childrens) {
        return (
            <>
                {managerDataData?.data.map((d, i) => {
                    const setMainFunction = () =>
                        setMain[td.link.one as keyof typeof setMain](d.id);
                    return (
                        <div key={i}>
                            <Folder
                                key={d.id}
                                folderName={d.name}
                                managerDataData={managerDataData}
                                typeData={typeData}
                                viewUserData={viewUserData}
                                type={td?.childrens ?? null}
                                managerUserData={managerUserData}
                                comeFrom="FolderObjectList"
                                parentId={d.id}
                                setMain={setMain}
                                setMainFunction={setMainFunction}
                            ></Folder>
                        </div>
                    );
                })}
                <div
                    style={{ cursor: "pointer" }}
                    className="hover:bg-gray-200 px-1 rounded text-gray-400 hover:text-black whitespace-nowrap"
                    onClick={() =>
                        setMain[(td?.link.one + "New") as keyof typeof setMain](
                            ""
                        )
                    }
                >
                    Add a {type?.[0].singularName} ...
                </div>
            </>
        );
    } else {
        return (
            <>
                {managerDataData?.data.map((d) => {
                    const td = findType(typeData, managerDataData?.type);

                    if (d.parentId == parentId) {
                        const setMainFunction = () =>
                            setMain[td?.link.one as keyof typeof setMain](d.id);
                        return (
                            <div
                                style={{
                                    cursor: "pointer",
                                }}
                                className="bg-gray-100 hover:bg-gray-200 px-1 rounded font-mono"
                                onClick={setMainFunction}
                                key={d.id}
                            >
                                {d.name}
                            </div>
                        );
                    }
                })}
                <div
                    style={{ cursor: "pointer" }}
                    className="hover:bg-gray-200 px-1 rounded text-gray-400 hover:text-black whitespace-nowrap"
                    onClick={() => {
                        console.log(td?.link.one + "New");
                        setMain[(td?.link.one + "New") as keyof typeof setMain](
                            "",
                            parentId ?? ""
                        );
                    }}
                >
                    Add a {type?.[0].singularName} ...
                </div>
            </>
        );
    }
}
