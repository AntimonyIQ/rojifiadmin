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
import { useState } from "react";
import { ITransaction } from "@/interface/interface";
import { TransactionStatus } from "@/enums/enums";

interface TransactionDetailsDialogProps {
    transaction: ITransaction | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function TransactionDetailsDialog({
    transaction,
    open,
    onOpenChange,
}: TransactionDetailsDialogProps) {
    const [actionLoading, _setActionLoading] = useState<
        "cancel" | "approve" | null
    >(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    if (!transaction) return null;

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
                                        getAvatarColor(transaction.userId.fullName)
                                    )}
                                >
                                    {getInitials(transaction.userId.fullName)}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium">
                                        {transaction.userId.fullName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {transaction.userId.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Amount</p>
                                <p className="font-semibold">
                                    {transaction.beneficiaryCountryCode} {transaction.amount}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Merchant Fee</p>
                                <p>
                                    {transaction.fees[0].currency} {transaction.fees[0].amount}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Net Amount</p>
                                <p>
                                    {transaction.beneficiaryCountryCode} {transaction.amount}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Type</p>
                                <p className="capitalize">{transaction.type}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Payment Description</p>
                                <p>{transaction.purposeOfPayment}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Created At</p>
                                <p>
                                    {format(
                                        new Date(transaction.createdAt),
                                        "MMM d, yyyy h:mm a"
                                    )}
                                </p>
                            </div>
                            {transaction.beneficiaryAccountName && (
                                <div>
                                    <p className="text-gray-500">Beneficiary Name</p>
                                    <p>{transaction.beneficiaryAccountName}</p>
                                </div>
                            )}
                            {transaction.beneficiaryAccountNumber && (
                                <div>
                                    <p className="text-gray-500">Beneficiary Account</p>
                                    <p>{transaction.beneficiaryAccountNumber}</p>
                                </div>
                            )}
                            {transaction.beneficiaryBankName && (
                                <div>
                                    <p className="text-gray-500">Beneficiary Bank</p>
                                    <p>{transaction.beneficiaryBankName}</p>
                                </div>
                            )}
                            {transaction.senderName && (
                                <div>
                                    <p className="text-gray-500">Sender Name</p>
                                    <p>{transaction.senderName}</p>
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
                                onClick={() => { }}
                                disabled={true}
                            >
                                {actionLoading === "cancel"
                                    ? "Cancelling..."
                                    : "Cancel Transaction"}
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => { }}
                                disabled={true}
                            >
                                {actionLoading === "approve"
                                    ? "Approving..."
                                    : "Approve Transaction"}
                            </Button>
                        </>
                    )}
                    {transaction.status !== TransactionStatus.FAILED && (
                        <Button
                            size="sm"
                            variant={"secondary"}
                            onClick={() => { }}
                            disabled={true}
                            className="disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {true ? "Reversing..." : "Reverse Transaction"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
