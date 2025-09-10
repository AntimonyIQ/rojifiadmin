import { useSidebar } from "@/hooks/use-sidebar";
import {
    ChevronLeft,
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    // UserCog,
    // MessageSquare,
    Briefcase,
    CreditCardIcon,
    Building,
    ReceiptText,
    // Projector,
    Wallet,
    UserPlus,
    Mail,
    FileText,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { session, SessionData } from "@/session/session";
import { useEffect, useState } from "react";
import { IUser } from "@/interface/interface";

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
    collapsed: boolean;
}

function NavItem({ href, icon, label, active, collapsed }: NavItemProps) {
    const content = (
        <li className="relative">
            {active && (
                <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            )}
            <Link href={href}>
                <div
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer relative
          ${active
                            ? "bg-primary-50 text-primary font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                >
                    <div
                        className={`${active ? "text-primary" : "text-gray-500"} ${collapsed ? "mx-auto" : ""
                            }`}
                    >
                        {icon}
                    </div>

                    {!collapsed && (
                        <span
                            className={`ml-3 transition-all duration-200 ${active ? "text-primary" : "text-gray-700"
                                }`}
                        >
                            {label}
                        </span>
                    )}
                </div>
            </Link>
        </li>
    );

    if (collapsed) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    {content}
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                    {label}
                </TooltipContent>
            </Tooltip>
        );
    }

    return content;
}

export default function Sidebar() {
    const { collapsed, toggleSidebar } = useSidebar();
    const [location, setLocation] = useLocation();
    const [user, setUser] = useState<IUser | null>(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const sd: SessionData = session.getUserData();

    useEffect(() => {
        if (sd) {
            setUser(sd.user);
        }
    }, [sd]);

    const handleLogout = () => {
        session.logout();
        setLocation("/"); // Use proper routing instead of hard refresh
    };

    const openLogoutModal = () => {
        setShowLogoutModal(true);
    };

    const closeLogoutModal = () => {
        setShowLogoutModal(false);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        handleLogout();
    };

    const navigationItems = [
        {
            href: "/dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
            label: "Dashboard",
        },
        {
            href: "/users",
            icon: <Users className="h-5 w-5" />,
            label: "Users",
        },
        {
            href: "/wallets",
            icon: <Wallet className="h-5 w-5" />,
            label: "Wallets",
        },
        {
            href: "/providers",
            icon: <Building className="h-5 w-5" />,
            label: "Providers",
        },
        {
            href: "/transactions",
            icon: <ReceiptText className="h-5 w-5" />,
            label: "Transactions",
        },
        {
            href: "/requested-access",
            icon: <UserPlus className="h-5 w-5" />,
            label: "Requested Access",
        },
        {
            href: "/contact-messages",
            icon: <Mail className="h-5 w-5" />,
            label: "Contact Messages",
        },
        {
            href: "/senders",
            icon: <Building className="h-5 w-5" />,
            label: "Senders",
        },
        {
            href: "/newsletters",
            icon: <FileText className="h-5 w-5" />,
            label: "Newsletters",
        },
        /*
        {
            href: "/messaging",
            icon: <MessageSquare className="h-5 w-5" />,
            label: "Messaging",
        },
        {
            href: "/staff",
            icon: <UserCog className="h-5 w-5" />,
            label: "Manage Staff",
        },
        */
        {
            href: "/otc",
            icon: <Briefcase className="h-5 w-5" />,
            label: "OTC",
        },
        {
            href: "/virtual-card",
            icon: <CreditCardIcon className="h-5 w-5" />,
            label: "Virtual Card",
        },
        /*
        {
            href: "/statements",
            icon: <Projector className="h-5 w-5" />,
            label: "Statements",
        },
        */
        {
            href: "/settings",
            icon: <Settings className="h-5 w-5" />,
            label: "Settings",
        },
    ];

    return (
        <TooltipProvider>
            <motion.aside
                className={`bg-white shadow-xl border-r border-gray-100 h-screen fixed z-10 transition-all duration-300 ease-in-out ${collapsed ? "w-[72px]" : "w-64"
                    }`}
                initial={false}
                animate={{ width: collapsed ? 72 : 256 }}
            >
                <div className="flex flex-col h-full min-h-0">
                    <div className="flex items-center justify-between h-16 md:h-20 px-4 border-b border-gray-100 flex-shrink-0">
                        {!collapsed ? (
                            <div className="flex items-center">
                                <div className="font-bold text-xl text-primary tracking-tight">
                                    Rojifi
                                </div>
                            </div>
                        ) : (
                            <div className="mx-auto">
                                <div className="h-9 w-9 rounded-md bg-primary text-white flex items-center justify-center font-bold text-lg">
                                    R
                                </div>
                            </div>
                        )}

                        {!collapsed && (
                            <Button
                                onClick={toggleSidebar}
                                variant="ghost"
                                size="icon"
                                className="p-1 rounded-full hover:bg-gray-100"
                                aria-label="Collapse sidebar"
                            >
                                <ChevronLeft className="h-5 w-5 text-gray-500 transition-transform duration-300" />
                            </Button>
                        )}
                    </div>

                    <nav className="flex-1 overflow-y-auto py-4 md:py-6 min-h-0">
                        <ul className="space-y-1 md:space-y-2 px-3">
                            {navigationItems.map((item) => (
                                <NavItem
                                    key={item.href}
                                    href={item.href}
                                    icon={item.icon}
                                    label={item.label}
                                    active={location === item.href}
                                    collapsed={collapsed}
                                />
                            ))}
                        </ul>
                    </nav>

                    <div className="border-t border-gray-100 p-3 md:p-4 flex-shrink-0">
                        <div
                            className={`flex ${collapsed ? "justify-center" : "items-center"}`}
                        >
                            {collapsed ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary-50 flex items-center justify-center text-primary font-medium cursor-pointer">
                                            {user?.email?.substring(0, 2).toUpperCase() || "AU"}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        {user?.fullName}
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <>
                                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary-50 flex items-center justify-center text-primary font-medium">
                                        {user?.email?.substring(0, 2).toUpperCase() || "AU"}
                                    </div>
                                    <div className="ml-2 md:ml-3 flex-1 min-w-0">
                                        <p className="text-xs md:text-sm font-semibold text-gray-700 truncate">
                                            {user?.fullName}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={openLogoutModal}
                                        variant="ghost"
                                        size="icon"
                                        className="ml-auto p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                                        aria-label="Logout"
                                    >
                                        <LogOut className="h-4 w-4 md:h-5 md:w-5" />
                                    </Button>
                                </>
                            )}

                            {collapsed && (
                                <Button
                                    onClick={toggleSidebar}
                                    variant="ghost"
                                    size="icon"
                                    className="absolute bottom-3 md:bottom-4 right-3.5 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                                    aria-label="Expand sidebar"
                                >
                                    <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 rotate-180 transition-transform duration-300" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Logout Confirmation Modal */}
                <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <LogOut className="h-5 w-5 text-red-500" />
                                Confirm Logout
                            </DialogTitle>
                            <DialogDescription>
                                Are you sure you want to logout from your admin account? You will need to sign in again to access the dashboard.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeLogoutModal}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={confirmLogout}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </motion.aside>
        </TooltipProvider>
    );
}
