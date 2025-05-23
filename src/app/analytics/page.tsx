import { motion } from "framer-motion";
import AnalyticsCharts from "@/components/analytics/AnalyticsCharts";
import { useQueries } from "@tanstack/react-query";
import { fetchAnalyticsData } from "@/services/api";
import { LoadingPage } from "@/components/ui/loading-spinner";

export default function AnalyticsPage() {
  const currentDate = new Date();
  const thirtyDaysAgo = new Date(currentDate);
  thirtyDaysAgo.setDate(currentDate.getDate() - 30);
  
  const [
    { data: analyticsData, isLoading }
  ] = useQueries({
    queries: [
      {
        queryKey: ['/api/analytics'],
        queryFn: () => fetchAnalyticsData(thirtyDaysAgo.toISOString(), currentDate.toISOString()),
        staleTime: 5 * 60 * 1000, // 5 minutes
      }
    ]
  });

  if (isLoading && !analyticsData) {
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
        dailyTransactions={analyticsData?.dailyTransactions || []}
        paymentMethods={analyticsData?.paymentMethods || []}
        userActivity={analyticsData?.userActivity || []}
        transactionStatus={analyticsData?.transactionStatus || []}
        loading={isLoading}
      />
    </motion.div>
  );
}
