import { Menu, Bell, Moon, Sun, LogOut, User, Settings, AlertTriangle, ArrowUpDown, ArrowDownLeft, Send } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
    const [showSystemControlsDialog, setShowSystemControlsDialog] = useState(false);
    const [systemControls, setSystemControls] = useState({
        swapEnabled: true,
        withdrawalEnabled: true,
        transferEnabled: true,
        sosActivated: false
    });

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

    const handleSystemControlsClick = () => {
        setShowSystemControlsDialog(true);
    };

    const handleSystemControlsClose = () => {
        setShowSystemControlsDialog(false);
    };

    const handleSystemControlToggle = (control: keyof typeof systemControls) => {
        setSystemControls(prev => ({
            ...prev,
            [control]: !prev[control]
        }));

        // Here you would typically make an API call to update the system setting
        console.log(`Toggling ${control}:`, !systemControls[control]);
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
                        onClick={handleSystemControlsClick}
                        className="p-1 rounded-md hover:bg-gray-100"
                        aria-label="System Controls"
                    >
                        <Settings className="h-5 w-5 text-gray-500" />
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

            {/* System Controls Dialog */}
            <Dialog open={showSystemControlsDialog} onOpenChange={setShowSystemControlsDialog}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5 text-blue-600" />
                            System Controls
                        </DialogTitle>
                        <DialogDescription>
                            Toggle system-wide features and emergency controls. Changes take effect immediately.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Transaction Controls */}
                        <div className="space-y-4">
                            <h4 className="font-medium text-sm text-gray-900">Transaction Controls</h4>

                            <div className="space-y-4">
                                {/* Swap Control */}
                                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${systemControls.swapEnabled ? 'bg-green-100' : 'bg-red-100'}`}>
                                            <ArrowUpDown className={`h-4 w-4 ${systemControls.swapEnabled ? 'text-green-600' : 'text-red-600'}`} />
                                        </div>
                                        <div>
                                            <Label className="font-medium text-sm">Swap Functionality</Label>
                                            <p className="text-xs text-gray-500">Allow users to swap cryptocurrencies</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={systemControls.swapEnabled}
                                        onCheckedChange={() => handleSystemControlToggle('swapEnabled')}
                                    />
                                </div>

                                {/* Withdrawal Control */}
                                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${systemControls.withdrawalEnabled ? 'bg-green-100' : 'bg-red-100'}`}>
                                            <ArrowDownLeft className={`h-4 w-4 ${systemControls.withdrawalEnabled ? 'text-green-600' : 'text-red-600'}`} />
                                        </div>
                                        <div>
                                            <Label className="font-medium text-sm">Withdrawal Functionality</Label>
                                            <p className="text-xs text-gray-500">Allow users to withdraw funds</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={systemControls.withdrawalEnabled}
                                        onCheckedChange={() => handleSystemControlToggle('withdrawalEnabled')}
                                    />
                                </div>

                                {/* Transfer Control */}
                                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${systemControls.transferEnabled ? 'bg-green-100' : 'bg-red-100'}`}>
                                            <Send className={`h-4 w-4 ${systemControls.transferEnabled ? 'text-green-600' : 'text-red-600'}`} />
                                        </div>
                                        <div>
                                            <Label className="font-medium text-sm">Transfer Functionality</Label>
                                            <p className="text-xs text-gray-500">Allow users to transfer funds</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={systemControls.transferEnabled}
                                        onCheckedChange={() => handleSystemControlToggle('transferEnabled')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Emergency Controls */}
                        <div className="space-y-4">
                            <h4 className="font-medium text-sm text-gray-900">Emergency Controls</h4>

                            <div className="flex items-center justify-between p-3 border-2 border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${systemControls.sosActivated ? 'bg-red-200' : 'bg-gray-100'}`}>
                                        <AlertTriangle className={`h-4 w-4 ${systemControls.sosActivated ? 'text-red-700' : 'text-gray-500'}`} />
                                    </div>
                                    <div>
                                        <Label className="font-medium text-sm">SOS Mode</Label>
                                        <p className="text-xs text-gray-500">Emergency system lockdown - disables all operations</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={systemControls.sosActivated}
                                    onCheckedChange={() => handleSystemControlToggle('sosActivated')}
                                    className="data-[state=checked]:bg-red-600"
                                />
                            </div>
                        </div>

                        {/* Current Status Summary */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <h5 className="font-medium text-sm mb-2">Current Status</h5>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${systemControls.swapEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    Swap: {systemControls.swapEnabled ? 'Enabled' : 'Disabled'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${systemControls.withdrawalEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    Withdrawal: {systemControls.withdrawalEnabled ? 'Enabled' : 'Disabled'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${systemControls.transferEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    Transfer: {systemControls.transferEnabled ? 'Enabled' : 'Disabled'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${systemControls.sosActivated ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                    SOS: {systemControls.sosActivated ? 'Activated' : 'Normal'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={handleSystemControlsClose}
                            className="w-full"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </header>
    );
}
