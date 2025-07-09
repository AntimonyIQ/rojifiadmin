import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useUpdateMessage } from "@/hooks/useCommunications";
import { LoaderCircle } from "lucide-react";

interface EditMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: {
    id: string;
    subject: string;
    body: string;
  } | null;
}

export default function EditMessageDialog({
  open,
  onOpenChange,
  message,
}: EditMessageDialogProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const { mutate: updateMessage, isPending } = useUpdateMessage();

  useEffect(() => {
    if (message) {
      setSubject(message.subject);
      setBody(message.body);
    }
  }, [message]);

  const handleUpdate = () => {
    updateMessage(
      { id: message?.id!!, subject, body },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
          />
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Message Body"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isPending}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <LoaderCircle className="size-6 animate-spin duration-300" />
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
