
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./assets/components/LoginPage";
import Home from "./assets/components/Home";

import PatientEntry from "./assets/components/PatientEntry";
import ReportEntry from "./assets/components/ReportEntry";
import AddDepartment from "./assets/components/AddDepartment";
import Testsetup from "./assets/components/Testsetup";
import PrintSetup from "./assets/components/PrintSetup";
import Setting from "./assets/components/Setting";
import Dashboard from "./assets/components/Dashboard";
import ServiceQueue from "./assets/components/ServiceQueue";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />
    },
    {
        path: "/Home",
        element: <Home />,
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: "ServiceQueue",
                element: <ServiceQueue />
            },
            {
                path: "Search", // Legacy path alias
                element: <ServiceQueue />
            },
            {
                path: "PatientEntry",
                element: <PatientEntry />
            },
            {
                path: "ReportEntry",
                element: <ReportEntry />
            },
            {
                path: "AddDepartment",
                element: <AddDepartment />
            },
            {
                path: "Testsetup",
                element: <Testsetup />
            },
            {
                path: "PrintSetup",
                element: <PrintSetup />
            },
            {
                path: "Setting",
                element: <Setting />
            },
            {
                path: "*",
                element: <Dashboard /> // Fallback for 404s within Home
            }
        ]
    },
    {
        path: "*",
        element: <LoginPage /> // Global fallback
    }
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
