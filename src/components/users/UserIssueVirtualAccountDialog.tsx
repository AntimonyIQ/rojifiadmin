import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function UserIssueVirtualAccountDialog({
  user,
  open,
  onOpenChange,
}: {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {

  const handleIssue = () => {

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
            disabled={false}
          >
            Cancel
          </Button>
          <Button
            onClick={handleIssue}
            disabled={false}
            className="bg-primary"
          >
            {false ? "Processing..." : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
