import { ReactNode, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useSidebar } from "@/hooks/use-sidebar";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { session, SessionData } from "@/session/session";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { collapsed } = useSidebar();
    const [, setLocation] = useLocation();
    const sd: SessionData = session.getUserData();

    useEffect(() => {
        // Only redirect if explicitly not logged in, avoid redirect loops
        if (sd && sd.isLoggedIn === false) {
            setLocation("/");
        }
    }, [sd?.isLoggedIn, setLocation]);

    if (!sd || !sd.isLoggedIn || !sd.user) {
        return null;
    }

    return (
        <div className="h-screen flex overflow-hidden bg-gray-50">
            <Sidebar />
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${collapsed ? "ml-16" : "ml-64"
                    }`}
            >
                <TopBar />
                <motion.main
                    className="flex-1 overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="p-6">{children}</div>
                </motion.main>
            </div>
        </div>
    );
}
