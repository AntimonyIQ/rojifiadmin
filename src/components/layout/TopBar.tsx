import { Menu, Bell, Moon, Sun, LogOut, User } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { useState } from "react";
import { session } from "@/session/session";

export default function TopBar() {
    const { collapsed, toggleSidebar } = useSidebar();
    const [location] = useLocation();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const getTitle = () => {
        const pathSegments = location.split("/");
        const page = pathSegments[1];

        if (!page) return "Dashboard";

        const capitalizedPage = page.charAt(0).toUpperCase() + page.slice(1);
        return page === "dashboard" ? `${capitalizedPage} Overview` : capitalizedPage;
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const handleLogoutClick = () => {
        setShowLogoutDialog(true);
    };

    const handleLogoutConfirm = () => {
        session.logout();
        window.location.href = '/';
    };

    const handleLogoutCancel = () => {
        setShowLogoutDialog(false);
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-6">
                <div className="flex items-center">
                    {collapsed && (
                        <Button
                            onClick={toggleSidebar}
                            variant="ghost"
                            size="icon"
                            className="p-1 mr-4 rounded-md hover:bg-gray-100"
                            aria-label="Expand sidebar"
                        >
                            <Menu className="h-5 w-5 text-gray-500" />
                        </Button>
                    )}
                    <h1 className="text-lg font-semibold text-gray-800">{getTitle()}</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="p-1 rounded-md hover:bg-gray-100 relative"
                        aria-label="Notifications"
                    >
                        <Bell className="h-5 w-5 text-gray-500" />
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-destructive"></span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleDarkMode}
                        className="p-1 rounded-md hover:bg-gray-100"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? (
                            <Sun className="h-5 w-5 text-gray-500" />
                        ) : (
                            <Moon className="h-5 w-5 text-gray-500" />
                        )}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="p-1 rounded-md hover:bg-gray-100"
                                aria-label="User menu"
                            >
                                <User className="h-5 w-5 text-gray-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogoutClick}
                                className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Logout Confirmation Dialog */}
            <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <LogOut className="h-5 w-5 text-red-600" />
                            Confirm Logout
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to logout? You will need to sign in again to access the admin panel.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:gap-2">
                        <Button
                            variant="outline"
                            onClick={handleLogoutCancel}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleLogoutConfirm}
                            className="flex-1"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </header>
    );
}
