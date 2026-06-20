import {Outlet} from "react-router-dom";
import Sidebar from "./Sidebar";
import {useState} from "react";

export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app-layout">
            <Sidebar
                open={sidebarOpen}
                onOpen={() => setSidebarOpen(true)}
                onClose={() => setSidebarOpen(false)}
            />

            {sidebarOpen && (
                <div
                    className="overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <main className="main-content">
                <Outlet/>
            </main>
        </div>
    );
}