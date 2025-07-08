import { Transaction, TransactionStatusPayload } from "@/types";
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
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Copy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  useReverseTransaction,
  useUpdateTransaction,
} from "@/hooks/useTransaction";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const [actionLoading, setActionLoading] = useState<
    "cancel" | "approve" | null
  >(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { mutate, isPending } = useUpdateTransaction();

  const { mutate: reverseTransaction, isPending: isTransactionReversing } =
    useReverseTransaction();

  const { toast } = useToast();

  if (!transaction) return null;

  const handleTransactionUpdate = (
    status: "successful" | "pending" | "failed" | "reversed",
    action: "cancel" | "approve"
  ) => {
    setActionLoading(action);

    const payload: TransactionStatusPayload = {
      status,
    };
    mutate(
      { id: transaction.id, payload },
      {
        onSettled: () => {
          setActionLoading(null);
        },
      }
    );
  };

  const handleTransactionReversal = (id: string) => {
    reverseTransaction(id!!, {
      onSuccess: () => {
        toast({
          title: "Successful",
          description: "Transaction reversed successfully!",
        });
        onOpenChange(false);
      },
    });
  };

  const handleCopyTransactionId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
      case "successful":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      case "reversed":
        return "bg-orange-100 text-orange-800";
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

    const hash = name.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    return colors[hash % colors.length];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto hide-scrollbar">
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
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{transaction.reference}</p>
                {copiedId === transaction.reference ? (
                  <span className="text-sm text-green-500">Copied ✓</span>
                ) : (
                  <Copy
                    className="size-5 cursor-pointer"
                    onClick={() =>
                      handleCopyTransactionId(transaction.reference)
                    }
                  />
                )}
              </div>
            </div>
            <Badge
              className={cn("font-medium", getStatusColor(transaction.status))}
            >
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
                <div
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center font-medium",
                    getAvatarColor(transaction.user.fullname)
                  )}
                >
                  {getInitials(transaction.user.fullname)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {transaction.user.fullname}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Amount</p>
                <p className="font-semibold">
                  {transaction.currency.symbol} {transaction.amount}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Merchant Fee</p>
                <p>
                  {transaction.currency.symbol} {transaction.merchant_fee}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Net Amount</p>
                <p>
                  {transaction.currency.symbol} {transaction.net_amount}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Type</p>
                <p className="capitalize">{transaction.type}</p>
              </div>
              <div>
                <p className="text-gray-500">Balance Before</p>
                <p>
                  {transaction.currency.symbol} {transaction.balance_before_tx}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Balance After</p>
                <p>
                  {transaction.currency.symbol} {transaction.balance_after_tx}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Payment Description</p>
                <p>{transaction.description}</p>
              </div>
              <div>
                <p className="text-gray-500">Created At</p>
                <p>
                  {format(
                    new Date(transaction.created_at),
                    "MMM d, yyyy h:mm a"
                  )}
                </p>
              </div>
              {transaction.completed_at && (
                <div>
                  <p className="text-gray-500">Completed At</p>
                  <p>
                    {format(
                      new Date(transaction.completed_at),
                      "MMM d, yyyy h:mm a"
                    )}
                  </p>
                </div>
              )}
              {transaction.beneficiary_account_name && (
                <div>
                  <p className="text-gray-500">Beneficiary Name</p>
                  <p>{transaction.beneficiary_account_name}</p>
                </div>
              )}
              {transaction.beneficiary_account_number && (
                <div>
                  <p className="text-gray-500">Beneficiary Account</p>
                  <p>{transaction.beneficiary_account_number}</p>
                </div>
              )}
              {transaction.beneficiary_bank_name && (
                <div>
                  <p className="text-gray-500">Beneficiary Bank</p>
                  <p>{transaction.beneficiary_bank_name}</p>
                </div>
              )}
              {transaction.sender_account_name && (
                <div>
                  <p className="text-gray-500">Sender Name</p>
                  <p>{transaction.sender_account_name}</p>
                </div>
              )}
              {transaction.sender_account_number && (
                <div>
                  <p className="text-gray-500">Sender Account</p>
                  <p>{transaction.sender_account_number}</p>
                </div>
              )}
              {transaction.reversed_by && (
                <div className="col-span-2">
                  <p className="text-gray-500">Reversed By</p>
                  <p>{transaction.reversed_by}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:justify-between sm:gap-0">
          {transaction.status === "pending" && (
            <>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleTransactionUpdate("failed", "cancel")}
                disabled={isPending}
              >
                {actionLoading === "cancel"
                  ? "Cancelling..."
                  : "Cancel Transaction"}
              </Button>
              <Button
                size="sm"
                onClick={() => handleTransactionUpdate("successful", "approve")}
                disabled={isPending}
              >
                {actionLoading === "approve"
                  ? "Approving..."
                  : "Approve Transaction"}
              </Button>
            </>
          )}
          {transaction.status !== "reversed" && (
            <Button
              size="sm"
              variant={"secondary"}
              onClick={() => handleTransactionReversal(transaction.id)}
              disabled={isTransactionReversing}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTransactionReversing ? "Reversing..." : "Reverse Transaction"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
