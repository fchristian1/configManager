import {
    ManagerDataData,
    ManagerUserData,
    SetMain,
    TypeData,
    ViewUserData,
} from "../../Manager";
import { Folder } from "./Folder";
type SideMenuProps = {
    managerUserData: ManagerUserData;
    managerDataData: ManagerDataData | null;
    viewUserData: ViewUserData | null;
    typeData: TypeData[];
    type: TypeData[] | null;
    parentId: string | null;
    setMain: SetMain;
};
export function FolderSystemsList({
    managerUserData,

    viewUserData,
    typeData,
    type,
    parentId,
    setMain,
}: SideMenuProps) {
    let td = type ?? typeData;
    return (
        <>
            {td.map((t) => {
                const setMainFunction =
                    parentId && parentId.length > 0
                        ? () =>
                              setMain[t.link.all as keyof typeof setMain](
                                  parentId
                              )
                        : () =>
                              setMain[t.link.all as keyof typeof setMain]("1");

                return (
                    <Folder
                        key={t.type}
                        folderName={t.name}
                        managerDataData={
                            managerUserData.data.find(
                                (d) => d.type === t.type
                            ) ?? {
                                type: "",
                                data: [],
                            }
                        }
                        typeData={typeData}
                        viewUserData={viewUserData}
                        type={[t]}
                        managerUserData={managerUserData}
                        comeFrom="FolderSystemList"
                        parentId={parentId}
                        setMain={setMain}
                        setMainFunction={setMainFunction}
                    ></Folder>
                );
            })}
        </>
    );
}
