import { motion } from "framer-motion";
// @ts-ignore
import { Users, CreditCard, DollarSign, UserCheck } from "lucide-react";
import KpiCard from "@/components/dashboard/KpiCard";
// @ts-ignore
import RevenueChart from "@/components/dashboard/RevenueChart";
import TransactionVolumeChart from "@/components/dashboard/TransactionVolumeChart";
import RecentTransactionsTable from "@/components/dashboard/RecentTransactionsTable";
// @ts-ignore
import { useQueries } from "@tanstack/react-query";
// @ts-ignore
import {fetchDashboardStats,fetchRecentTransactions,fetchChartData,} from "@/services/api";
import {
  useFetchTransactions,
  // @ts-ignore
  useFetchTransactionVolume,
} from "@/hooks/useTransaction";
import { useFetchDashboardOverview } from "@/hooks/useStaff";

export default function DashboardPage() {
  const { data: transactions, isLoading } = useFetchTransactions();
  const { data: dashboardData, isLoading: statsLoading } =
    useFetchDashboardOverview();

  const currentDate = new Date();
  const thirtyDaysAgo = new Date(currentDate);
  thirtyDaysAgo.setDate(currentDate.getDate() - 30);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          title="Total Users"
          value={dashboardData?.total_users.toLocaleString() || "0"}
          percentageChange={dashboardData?.user_growth || 0}
          icon={Users}
          iconColor="text-green-500"
          iconBgColor="bg-green-50"
          loading={statsLoading}
        />

        <KpiCard
          title="Total Transactions"
          value={dashboardData?.total_transactions?.toLocaleString() || "0"}
          percentageChange={dashboardData?.transaction_growth || 0}
          icon={CreditCard}
          iconColor="text-blue-500"
          iconBgColor="bg-blue-50"
          loading={statsLoading}
        />

        {/* <KpiCard
          title="Revenue"
          value={`$${dashboardData?.revenue.toLocaleString() || "0"}`}
          percentageChange={dashboardData?.revenue_growth || 0}
          icon={DollarSign}
          iconColor="text-indigo-500"
          iconBgColor="bg-indigo-50"
          loading={statsLoading}
        /> */}

        <KpiCard
          title="Active Users"
          value={dashboardData?.active_users.toLocaleString() || "0"}
          percentageChange={dashboardData?.active_user_growth || 0}
          icon={UserCheck}
          iconColor="text-purple-500"
          iconBgColor="bg-purple-50"
          loading={statsLoading}
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* <RevenueChart
          data={chartData?.revenue || []}
          loading={chartDataLoading}
        /> */}

        <TransactionVolumeChart
        // data={transactionVolume || []}
        // loading={chartDataLoading}
        />
      </div>

      {/* Recent Transactions Table */}
      <RecentTransactionsTable
        transactions={transactions || []}
        loading={isLoading}
      />
    </motion.div>
  );
}
