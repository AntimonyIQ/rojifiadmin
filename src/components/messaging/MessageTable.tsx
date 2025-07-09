import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import EditMessageDialog from "./EditMessageDialog";
import { useDeleteMessage, useResendMessage } from "@/hooks/useCommunications";

interface MessageTableProps {
  messages: any[];
  loading: boolean;
}

export default function MessageTable({ messages, loading }: MessageTableProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [resendOpen, setResendOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const { mutate: resendMessage, isPending: isResendingMessage } =
    useResendMessage();
  const { mutate: deleteMessage, isPending: isDeletingMessage } =
    useDeleteMessage();

  const handleEdit = (message: any) => {
    setSelectedMessage(message);
    setEditOpen(true);
  };

  const handleResend = (id: string) => {
    resendMessage(id, {
      onSuccess: () => {
        setResendOpen(false);
      },
    });
  };

  const handleDelete = (id: string) => {
    console.log("Deleting message:", id);
    deleteMessage(id, {
      onSuccess: () => {
        setDeleteOpen(false);
      },
    });
  };

  if (loading) {
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Sent Via</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sent At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages?.map((message) => (
            <TableRow key={message.id}>
              <TableCell>{message.subject}</TableCell>
              <TableCell className="max-w-md truncate">
                {message.body}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="mr-1">
                  {message.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    message.status === "sent"
                      ? "success"
                      : message.status === "failed"
                      ? "destructive"
                      : "warning"
                  }
                >
                  {message.status}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(message.created_at), "MMM d, yyyy HH:mm")}
              </TableCell>

              <TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="p-1 rounded-md hover:bg-muted">
                      <MoreVertical className="size-5 text-gray-600" />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-40 p-2"
                    align="end"
                    side="bottom"
                  >
                    <div className="space-y-1 text-sm">
                      <button
                        onClick={() => handleEdit(message)}
                        className="w-full text-left px-2 py-1.5 hover:bg-muted rounded-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMessage(message);
                          setResendOpen(true);
                        }}
                        className="w-full text-left px-2 py-1.5 hover:bg-muted rounded-md"
                      >
                        Resend
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMessage(message);
                          setDeleteOpen(true);
                        }}
                        className="w-full text-left px-2 py-1.5 hover:bg-muted text-red-600 rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditMessageDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        message={selectedMessage}
      />

      <ConfirmDialog
        open={resendOpen}
        onOpenChange={setResendOpen}
        isLoading={isResendingMessage}
        title="Resend Message?"
        message="Are you sure you want to resend this message?"
        onConfirm={() => handleResend(selectedMessage?.id)}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        isLoading={isDeletingMessage}
        title="Delete Message?"
        message="This action cannot be undone. Proceed?"
        onConfirm={() => handleDelete(selectedMessage?.id)}
      />
    </div>
  );
}
