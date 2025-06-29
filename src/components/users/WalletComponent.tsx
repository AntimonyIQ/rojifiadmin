"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Wallet } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchUserWallets, useUpdateUserWallet } from "@/hooks/useWallet";
import { toast } from "@/hooks/use-toast";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";

const formSchema = z.object({
  post_no_debit: z.enum(["enabled", "disabled"]),
  post_no_credit: z.enum(["enabled", "disabled"]),
  status: z.enum(["active", "inactive"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function WalletsComponent({ userId }: { userId: string }) {
  const { data: userWallets, isLoading } = useFetchUserWallets(userId);
  const { mutate: updateWalletFn, isPending: isWalletUpdating } =
    useUpdateUserWallet();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      post_no_debit: "disabled",
      post_no_credit: "disabled",
      status: "inactive",
    },
  });

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<any | null>(null);

  useEffect(() => {
    if (selectedWallet) {
      form.reset({
        post_no_debit: selectedWallet.post_no_debit ?? "disabled",
        post_no_credit: selectedWallet.post_no_credit ?? "disabled",
        status: selectedWallet.status ?? "inactive",
      });
    }
  }, [form, openUpdateDialog, selectedWallet]);

  const handleOpenUpdate = (wallet: any) => {
    setSelectedWallet(wallet);
    setOpenUpdateDialog(true);
  };

  const onSubmit = (values: FormValues) => {
    if (!selectedWallet?.id) {
      console.log("Selected Wallet does not have an ID");
      setOpenUpdateDialog(false);
    }

    // return;

    try {
      updateWalletFn(
        {
          id: selectedWallet.id,
          data: values,
        },
        {
          onSuccess: () => {
            toast({
              title: "Wallet Updated!",
              description: `${selectedWallet.currency.name} wallet has been updated successfully.`,
            });
            setOpenUpdateDialog(false);
          },
          onError: (error: any) => {
            toast({
              title: "Error",
              description:
                error?.response?.data?.message || "Failed to update user.",
              variant: "destructive",
            });
          },
        }
      );
    } catch (error) {
      console.error("Error updating wallet:", error);
    }
  };

  //   const handleOpenDelete = (wallet: any) => {
  //     setSelectedWallet(wallet);
  //     setOpenDeleteDialog(true);
  //   };

  const handleDeleteWallet = () => {
    console.log("Deleting wallet with ID:", selectedWallet?.id);
    setOpenDeleteDialog(false);
  };

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center space-y-2 mt-10">
        <div className="flex flex-col items-center space-y-2">
          <div className="border-b border-primary rounded-full w-10 h-10 animate-spin duration-300"></div>
          <p className="text-center text-sm">Fetching Wallets...</p>
        </div>
      </div>
    );

  return (
    <div className="grid grid-cols-1 gap-3">
      {userWallets.map((wallet: any) => (
        <Card key={wallet.id} className="relative">
          <div className="ml-auto w-fit">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleOpenUpdate(wallet)}>
                  Update
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => handleOpenDelete(wallet)}>
                  Delete
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CardContent className="space-y-1 px-2 py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {wallet.currency.name}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {wallet.formatted_balance}
                </p>
              </div>
              <div className="h-12 w-12 bg-primary-50 rounded-full flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Update Wallet Dialog */}
      <Dialog open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{`Update Wallet Settings`}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4 py-4">
                {/* Post No Debit */}
                <FormField
                  control={form.control}
                  name="post_no_debit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post No Debit</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enabled">Enabled</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Post No Credit */}
                <FormField
                  control={form.control}
                  name="post_no_credit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post No Credit</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enabled">Enabled</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isWalletUpdating}
                className="mt-4 bg-primary text-white py-2 px-4 rounded w-full disabled:bg-primary/60 disabled:cursor-not-allowed"
              >
                {isWalletUpdating ? "Updating..." : "Update Wallet"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Wallet Dialog. May not later use this */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Wallet</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm">
            Are you sure you want to delete wallet{" "}
            <strong>{selectedWallet?.currency?.name}</strong>? This action
            cannot be undone.
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteWallet}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
