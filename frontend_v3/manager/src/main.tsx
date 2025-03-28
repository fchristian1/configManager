import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "../../html/site/style/main.css";
import "./tailwind.css";
import App from "./App.tsx";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";

createRoot(document.getElementById("root")!).render(
    <>
        <BrowserRouter>
            <Routes>
                <Route path="manager" element={<App />}>
                    <Route
                        path="projects"
                        element={
                            <>
                                Projects<Outlet></Outlet>
                            </>
                        }
                    >
                        <Route
                            path="pipeline"
                            element={
                                <>
                                    Pipeline<Outlet></Outlet>
                                </>
                            }
                        >
                            <Route path="tasks" element={<>Tasks</>} />
                        </Route>
                        <Route path="systems" element={<>Systems</>} />
                    </Route>
                    <Route path="environments" element={<>Environments</>} />
                    <Route
                        path="software"
                        element={
                            <>
                                Software<Outlet></Outlet>
                            </>
                        }
                    >
                        <Route path="configs" element={<>Configs</>} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </>
);
