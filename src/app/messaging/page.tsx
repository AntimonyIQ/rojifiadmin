import { motion } from "framer-motion";
import MessageTable from "@/components/messaging/MessageTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, Suspense } from "react";
import CreateMessageDialog from "@/components/messaging/CreateMessageDialog";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { useFetchAllMessages } from "@/hooks/useCommunications";

export default function MessagingPage() {
    const [page, setPage] = useState(1);
    const { data, isFetching, isLoading } = useFetchAllMessages(page);

    const total = data?.metadata?.total || 0;
    const totalPages = Math.ceil(total / 10);

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

                <MessageTable
                    messages={data?.data ?? []}
                    loading={isFetching || isLoading}
                />

                {/* pagination */}
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            disabled={page >= totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>

                <CreateMessageDialog
                    open={showCreateDialog}
                    onOpenChange={setShowCreateDialog}
                />
            </motion.div>
        </Suspense>
    );
}
