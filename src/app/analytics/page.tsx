import { motion } from "framer-motion";
import AnalyticsCharts from "@/components/analytics/AnalyticsCharts";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { useState } from "react";

export default function AnalyticsPage() {
  const currentDate = new Date();
  const thirtyDaysAgo = new Date(currentDate);
  thirtyDaysAgo.setDate(currentDate.getDate() - 30);
  const [loading, setLoading] = useState<boolean>(true);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>

      <AnalyticsCharts
        dailyTransactions={[]}
        paymentMethods={[]}
        userActivity={[]}
        transactionStatus={[]}
        loading={loading}
      />
    </motion.div>
  );
}
