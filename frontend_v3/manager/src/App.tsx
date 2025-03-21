import { Manager } from "./components/managerv2/Manager";
import { MainLayout } from "./components/layout/MainLayout";
import { ManagerProvider } from "./components/managerv2/ManagerProvider";

function App() {
    return (
        <>
            <MainLayout>
                <ManagerProvider>
                    <Manager></Manager>
                </ManagerProvider>
            </MainLayout>
        </>
    );
}

export default App;
