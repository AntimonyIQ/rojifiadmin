import { motion } from "framer-motion";
import { Users, UserCheck, ArrowUpRight } from "lucide-react";
import KpiCard from "@/components/dashboard/KpiCard";
import TransactionVolumeChart from "@/components/dashboard/TransactionVolumeChart";
import RecentTransactionsTable from "@/components/dashboard/RecentTransactionsTable";
import { ITransaction } from "@/interface/interface";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const [transactions, setTransactions] = useState<Array<ITransaction>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [openDetails, setOpenDetails] = useState<boolean>(false);

    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate);
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);

    useEffect(() => {
        fetchTransactions();
    }, []); // Remove currentDate dependency to prevent infinite re-renders

    const fetchTransactions = async () => {
        setLoading(true);
        try {

            setTransactions([]);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="Total Users"
                    value={"0"}
                    percentageChange={0}
                    icon={Users}
                    iconColor="text-green-500"
                    iconBgColor="bg-green-50"
                    loading={true}
                />

                <KpiCard
                    title="Total Daily Transactions"
                    value={"0"}
                    percentageChange={0}
                    icon={ArrowUpRight}
                    iconColor="text-blue-500"
                    iconBgColor="bg-blue-50"
                    loading={true}
                    fieldKey="Transaction"
                />

                <KpiCard
                    title="Total Transactions"
                    value={"0"}
                    percentageChange={0}
                    icon={ArrowUpRight}
                    iconColor="text-blue-500"
                    iconBgColor="bg-blue-50"
                    loading={true}
                    fieldKey="Transaction"
                />

                <KpiCard
                    title="Active Users"
                    value={"0"}
                    percentageChange={0}
                    icon={UserCheck}
                    iconColor="text-purple-500"
                    iconBgColor="bg-purple-50"
                    loading={true}
                />
            </div>

            {/** Dialog modal to show total transactions for each currency */}
            <div>
                <Dialog open={openDetails} onOpenChange={setOpenDetails}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Total Transactions</DialogTitle>
                            <DialogDescription>
                                View the total transactions for each currency.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline">Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <TransactionVolumeChart />
            </div>

            <RecentTransactionsTable
                transactions={transactions}
                loading={loading}
            />
        </motion.div>
    );
}
