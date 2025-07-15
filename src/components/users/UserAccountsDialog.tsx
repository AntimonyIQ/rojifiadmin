import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useFetchVirtualAccounts,
  useFetchLinkedBankAccounts,
} from "@/hooks/useAccounts";
import { useEffect, useState } from "react";
import VirtualAccountCard from "../accounts/VirtualAccountsCard";

export default function UserAccountsDialog({
  user,
  open,
  onOpenChange,
}: {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  // console.log("user:", user);

  useEffect(() => {
    if (user?.id) setUserId(user.id);
  }, [user]);

  const { data: virtualAccounts, isLoading: loadingVirtuals } =
    useFetchVirtualAccounts(userId ?? "");

  const { data: linkedAccounts, isLoading: loadingLinked } =
    useFetchLinkedBankAccounts(userId ?? "");

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
            {loadingVirtuals ? (
              <div className="w-full h-[200px] flex items-center justify-center">
                <div className="w-14 h-14 border-b border-primary rounded-full animate-spin duration-300"></div>
              </div>
            ) : virtualAccounts?.length ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {virtualAccounts.map((account: any) => (
                  <VirtualAccountCard key={account.id} account={account} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                No virtual accounts linked.
              </p>
            )}
          </TabsContent>

          <TabsContent value="linked" className="pt-4">
            {loadingLinked ? (
              <div className="w-full h-[200px] flex items-center justify-center">
                <div className="w-14 h-14 border-b border-primary rounded-full animate-spin duration-300"></div>
              </div>
            ) : linkedAccounts?.length ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {linkedAccounts.map((account: any) => (
                  <div
                    key={account.id}
                    className="border rounded-xl p-4 shadow-sm space-y-2"
                  >
                    <div className="text-sm font-medium text-gray-500">
                      {account.bank_name}
                    </div>
                    <div className="text-lg font-bold">
                      {account.account_name}
                    </div>
                    <div className="text-base font-mono">
                      {account.account_number}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No linked bank accounts.</p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
