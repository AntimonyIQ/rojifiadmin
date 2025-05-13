
import { motion } from "framer-motion";
import MessageTable from "@/components/messaging/MessageTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, Suspense } from "react";
import CreateMessageDialog from "@/components/messaging/CreateMessageDialog";
import { LoadingPage } from "@/components/ui/loading-spinner";

export default function MessagingPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <Suspense fallback={<LoadingPage />}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 bg-white min-h-screen p-6"
      >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Messaging</h2>
        <Button onClick={() => setShowCreateDialog(true)} variant="default">
          <Plus className="h-4 w-4 mr-2" />
          Create Message
        </Button>
      </div>

      <MessageTable />
      
      <CreateMessageDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </motion.div>
    </Suspense>
  );
}
