import { Menu, Bell, HelpCircle } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function TopBar() {
  const { collapsed, toggleSidebar } = useSidebar();
  const [location] = useLocation();

  // Get the title based on the current path
  const getTitle = () => {
    const pathSegments = location.split("/");
    const page = pathSegments[1];

    if (!page) return "Dashboard";

    // Capitalize first letter and add "Overview" for dashboard
    const capitalizedPage = page.charAt(0).toUpperCase() + page.slice(1);
    return page === "dashboard" ? `${capitalizedPage} Overview` : capitalizedPage;
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
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="p-1 rounded-md hover:bg-gray-100"
              aria-label="Help"
            >
              <HelpCircle className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
