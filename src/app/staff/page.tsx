
import { motion } from "framer-motion";

export default function StaffManagementPage() {


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Staff Management</h2>

    </motion.div>
  );
};
