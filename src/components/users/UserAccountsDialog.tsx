import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

export default function UserAccountsDialog({
  user,
  open,
  onOpenChange,
}: {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [_userId, setUserId] = useState<string | null>(null);
  // console.log("user:", user);

  useEffect(() => {
    if (user?.id) setUserId(user.id);
  }, [user]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{user?.fullname}'s Account Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="virtual" className="mt-4">
          <TabsList className="w-full grid grid-cols-2 justify-start gap-4">
            <TabsTrigger value="virtual">Virtual Accounts</TabsTrigger>
            <TabsTrigger value="linked">Linked Bank Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="virtual" className="pt-4">
          </TabsContent>

          <TabsContent value="linked" className="pt-4">
            <p className="text-sm text-gray-600">No linked bank accounts.</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
