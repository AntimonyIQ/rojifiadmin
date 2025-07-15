import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useIssueVirtualAccounts } from "@/hooks/useAccounts";
import { useToast } from "@/hooks/use-toast";

export default function UserIssueVirtualAccountDialog({
  user,
  open,
  onOpenChange,
}: {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate, isPending } = useIssueVirtualAccounts();
  const { toast } = useToast();

  const handleIssue = () => {
    mutate(
      { id: user?.id },
      {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: "Virtual account issued successfully",
          });
          onOpenChange(false);
        },
        onError: () => {
          toast({
            title: "Failed!",
            description: "Failed to issue virtual account",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Issue Virtual Account</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600">
          Are you sure you want to issue a virtual account for{" "}
          <span className="font-medium">{user?.fullname}</span>?
        </p>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleIssue}
            disabled={isPending}
            className="bg-primary"
          >
            {isPending ? "Processing..." : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
