
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: string;
  title: string;
  body: string;
  sentVia: string[];
  sentAt: string;
  status: "sent" | "failed" | "pending";
}

export default function MessageTable() {
  // Sample message data
  const messages: Message[] = [
    {
      id: "1",
      title: "Welcome to Rojifi",
      body: "Thank you for joining our platform. We're excited to have you on board!",
      sentVia: ["Email", "Push"],
      sentAt: "2023-05-01T10:30:00Z",
      status: "sent"
    },
    {
      id: "2",
      title: "Transaction Confirmation",
      body: "Your transaction #123456 has been successfully processed.",
      sentVia: ["Email"],
      sentAt: "2023-05-05T14:25:00Z",
      status: "sent"
    },
    {
      id: "3",
      title: "Account Verification",
      body: "Please verify your account to access all features.",
      sentVia: ["Push"],
      sentAt: "2023-05-10T09:15:00Z",
      status: "pending"
    },
    {
      id: "4",
      title: "Payment Reminder",
      body: "Your monthly payment is due in 3 days.",
      sentVia: ["Email", "Push"],
      sentAt: "2023-05-12T11:45:00Z",
      status: "failed"
    }
  ];
  const loading = false; // Will be replaced with actual loading state

  if (loading) {
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id}>
              <TableCell>{message.title}</TableCell>
              <TableCell className="max-w-md truncate">{message.body}</TableCell>
              <TableCell>
                {message.sentVia.map((via) => (
                  <Badge key={via} variant="secondary" className="mr-1">
                    {via}
                  </Badge>
                ))}
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
                {format(new Date(message.sentAt), "MMM d, yyyy HH:mm")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
