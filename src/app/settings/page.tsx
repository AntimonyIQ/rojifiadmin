import { motion } from "framer-motion";
import SettingsTabs from "@/components/settings/SettingsTabs";
import { useLocation } from "wouter";

export default function SettingsPage() {
  const [location] = useLocation();
  const queryParams = new URLSearchParams(location.split("?")[1] || "");
  const defaultTab = queryParams.get("tab") || "payment-channels";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-500">Manage your application preferences and configurations</p>
      </div>

      <SettingsTabs defaultTab={defaultTab} />
    </motion.div>
  );
}
