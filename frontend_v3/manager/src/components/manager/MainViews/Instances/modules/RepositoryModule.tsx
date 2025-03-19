import { ModulesData } from "./IndexModules";

type SideMenuProps = {
    modulesData: ModulesData[] | null;
};
export function RepositoryModule({}: SideMenuProps) {
    return (
        <div className="">
            <div>Repository:</div>
            <div className="bg-gray-300 px-2 py-1 border-3 border-gray-500 rounded-2xl text-gray-500">
                <button className="button">Add...</button>
            </div>
        </div>
    );
}
