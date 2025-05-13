import { Transaction } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { CreditCard, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TransactionDetailsDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TransactionDetailsDialog({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailsDialogProps) {
  if (!transaction) return null;

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "cancelled":
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Transaction Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p className="text-lg font-semibold">#{transaction.id}</p>
            </div>
            <Badge className={cn("font-medium", getStatusColor(transaction.status))}>
              <span className="flex items-center gap-1">
                {getStatusIcon(transaction.status)}
                {transaction.status}
              </span>
            </Badge>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">User</p>
              <div className="flex items-center">
                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center font-medium", getAvatarColor(transaction.userName))}>
                  {getInitials(transaction.userName)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{transaction.userName}</p>
                  <p className="text-xs text-gray-500">{transaction.userEmail}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-base font-semibold">
                  ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-base">
                  {format(new Date(transaction.date), "MMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="text-base">
                  {format(new Date(transaction.date), "h:mm a")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="text-base">
                  {transaction.paymentMethod || "Credit Card"}
                </p>
              </div>
            </div>
          </div>

          {transaction.details && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-gray-500 mb-2">Transaction Details</p>
                <div className="grid grid-cols-2 gap-4">
                  {transaction.details.map((detail, index) => (
                    <div key={index}>
                      <p className="text-sm text-gray-500">{detail.label}</p>
                      <p className="text-base">{detail.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {transaction.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-gray-500 mb-2">Notes</p>
                <p className="text-sm bg-gray-50 p-3 rounded-md">{transaction.notes}</p>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:justify-between sm:gap-0">
          {transaction.status === "Pending" && (
            <>
              <Button
                variant="destructive"
                size="sm"
              >
                Cancel Transaction
              </Button>
              <Button
                size="sm"
              >
                Approve Transaction
              </Button>
            </>
          )}
          {transaction.status !== "Pending" && (
            <div className="w-full flex justify-end">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
