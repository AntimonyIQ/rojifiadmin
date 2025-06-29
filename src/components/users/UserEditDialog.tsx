"use client";

import { User } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { useUpdateUser } from "@/hooks/useUsers";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const formSchema = z.object({
  firstname: z.string().min(1, "Required"),
  lastname: z.string().min(1, "Required"),
  email: z.string().email(),
  phone: z.string().min(6, "Phone number too short"),
  status: z.enum(["active", "inactive"]),
  address_line_one: z.string().optional(),
  address_line_two: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserEditDialog({
  user,
  open,
  onOpenChange,
}: UserDetailsDialogProps) {
  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      status: "inactive",
      address_line_one: "",
      address_line_two: "",
      city: "",
      state: "",
      country: "",
    },
  });

  useEffect(() => {
    if (open && user) {
      form.reset({
        firstname: user.firstname ?? "",
        lastname: user.lastname ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        status: user.status ?? "inactive",
        address_line_one: user.address_line_one ?? "",
        address_line_two: user.address_line_two ?? "",
        city: user.city ?? "",
        state: user.state ?? "",
        country: user.country ?? "",
      });
    }
  }, [open, user, form]);

  const onSubmit = (values: FormValues) => {
    updateUser(
    // @ts-ignore
      { id: user?.id, data: values },
      {
        onSuccess: () => {
          toast({
            title: "User Updated!",
            description: `${values.firstname} has been updated successfully.`,
          });
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
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto hide-scrollbar">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            {/* First & Last Name */}
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="First name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Last name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email & Phone */}
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="user@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} placeholder="08123456789" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address Fields */}
            <FormField
              control={form.control}
              name="address_line_one"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Address line one" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_line_two"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Address line two" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="City" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="State" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Country" />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isUpdatingUser}
              className="w-full bg-primary text-white"
            >
              {isUpdatingUser ? "Updating..." : "Update User Details"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
