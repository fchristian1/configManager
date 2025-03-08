import { Outlet } from "react-router";
import { Manager } from "./components/manager/Manager";
import { MainLayout } from "./components/layout/MainLayout";

function App() {
    return (
        <>
            <MainLayout>
                <Manager>
                    <Outlet></Outlet>
                </Manager>
            </MainLayout>
        </>
    );
}

export default App;
