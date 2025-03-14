import { Manager } from "./components/manager/Manager";
import { MainLayout } from "./components/layout/MainLayout";

function App() {
    return (
        <>
            <MainLayout>
                <Manager></Manager>
            </MainLayout>
        </>
    );
}

export default App;
