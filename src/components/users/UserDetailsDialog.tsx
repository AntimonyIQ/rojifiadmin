import { Transaction, User } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
// @ts-ignore
import { AlertCircle, User as UserIcon, CreditCard, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useFetchUserTransactions } from "@/hooks/useTransaction";

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserDetailsDialog({
  user,
  open,
  onOpenChange,
}: UserDetailsDialogProps) {
  if (!user) return null;

  const { data: recentTransactions } = useFetchUserTransactions(user.id);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-green-100 text-green-700",
      "bg-blue-100 text-blue-700",
      "bg-purple-100 text-purple-700",
      "bg-indigo-100 text-indigo-700",
      "bg-pink-100 text-pink-700",
    ];

    // Simple hash function to get consistent color for a name
    const hash = name.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    return colors[hash % colors.length];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            User Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row items-start gap-4 py-4">
          <div
            className={cn(
              "h-16 w-16 rounded-full flex items-center justify-center text-xl font-medium",
              getAvatarColor(user.fullname)
            )}
          >
            {getInitials(user.fullname)}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">{user.fullname}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <Badge className={cn("mt-2", getStatusColor(user.status))}>
              {user.status}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            {/* <TabsTrigger value="activity">Activity</TabsTrigger> */}
          </TabsList>
          <TabsContent value="profile" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500">Phone</p>
                <p className="text-sm">
                  {user.phone === null ? "N/A" : user.phone}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500">Date Joined</p>
                <p className="text-sm">
                  {format(new Date(user.joined_at), "MMMM d, yyyy")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500">User ID</p>
                <p className="text-sm">{user.id}</p>
              </div>
              <div className="space-y-1">
                {/* <p className="text-xs font-medium text-gray-500">Last Login</p> */}
                {/* <p className="text-sm">{format(new Date(user.lastLoginDate), "MMM d, yyyy, h:mm a")}</p> */}
              </div>
              <div className="space-y-1 md:col-span-2">
                <p className="text-xs font-medium text-gray-500">Address</p>
                <p className="text-sm">
                  {user.address_line_one + " " + user.address_line_two}
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="transactions" className="mt-4">
            <div className="rounded-md border">
              <div className="py-4 px-4 flex items-center justify-between border-b">
                <h3 className="text-sm font-medium">Recent Transactions</h3>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
              {recentTransactions && recentTransactions.length > 0 ? (
                <div className="divide-y">
                  {recentTransactions.map((transaction: Transaction) => (
                    <div
                      key={transaction.id}
                      className="px-4 py-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {transaction.id}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(
                              new Date(transaction.created_at),
                              "MMM d, yyyy"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {transaction.currency.symbol}
                          {transaction.amount}
                        </p>
                        <Badge
                          className={cn(
                            "text-xs",
                            getStatusColor(transaction.status)
                          )}
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500 flex flex-col items-center">
                  <CreditCard className="h-8 w-8 text-gray-400 mb-2" />
                  <p>No recent transactions</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="activity" className="mt-4">
            <div className="rounded-md border">
              <div className="py-4 px-4 flex items-center justify-between border-b">
                <h3 className="text-sm font-medium">Activity Log</h3>
                <p className="text-xs text-gray-500">Last 7 days</p>
              </div>
              {/* {user.activityLog && user.activityLog.length > 0 ? (
                <div className="divide-y">
                  {user.activityLog.map((log, i) => (
                    <div key={i} className="px-4 py-3 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                        {log.type === "login" ? (
                          <UserIcon className="h-4 w-4 text-gray-700" />
                        ) : log.type === "transaction" ? (
                          <CreditCard className="h-4 w-4 text-gray-700" />
                        ) : (
                          <Clock className="h-4 w-4 text-gray-700" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{log.description}</p>
                        <p className="text-xs text-gray-500">{format(new Date(log.timestamp), "MMM d, yyyy, h:mm a")}</p>
                        {log.details && <p className="text-xs text-gray-600 mt-1">{log.details}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500 flex flex-col items-center">
                  <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                  <p>No activity logs found</p>
                </div>
              )} */}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
