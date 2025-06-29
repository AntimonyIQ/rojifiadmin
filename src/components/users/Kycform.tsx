"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useFetchUserKYC, useUpdateKyc } from "@/hooks/useKYC";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
  method: z.string(),
  bvn: z.string(),
  nin: z.string(),
  fullname: z.string(),
  dob: z.date(),
});

type FormValues = z.infer<typeof formSchema>;

export default function KycForm({ userId }: { userId: string }) {
  const { data: kycInfo, isLoading } = useFetchUserKYC(userId);
  const { mutate: updateKyc, isPending: isKycUpdating } = useUpdateKyc();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "pending",
      method: "",
      bvn: "",
      nin: "",
      fullname: "",
      dob: new Date(),
    },
  });

  // Populate form once kycInfo is loaded
  useEffect(() => {
    if (kycInfo?.kyc) {
      const kyc = kycInfo.kyc;

      try {
        const dob = kyc.dob ? new Date(kyc.dob) : new Date();
        console.log("Resetting form with:", { ...kyc, dob });

        form.reset({
          status: kyc.status ?? "pending",
          method: kyc.method ?? "",
          bvn: kyc.bvn ?? "",
          nin: kyc.nin ?? "",
          fullname: kyc.fullname ?? "",
          dob,
        });
      } catch (error) {
        console.error("Error parsing DOB or resetting form", error);
      }
    }
  }, [kycInfo, form]);

  const onSubmit = (values: FormValues) => {
    const { method, ...dataToUpdate } = values;
    try {
      updateKyc(
        { id: kycInfo.kyc.id!!, data: dataToUpdate },
        {
          // @ts-ignore
          onSuccess: (response: any) => {
            toast({
              title: "Kyc Updated!",
              description: `${values.fullname} kyc has been updated successfully.`,
            });
          },
          onError: (error: any) => {
            toast({
              title: "Error",
              description:
                error?.response?.data?.message || "Failed to update kyc",
              variant: "destructive",
            });
          },
        }
      );
    } catch (error) {
      console.error("Error updating KYC:", error);
    }
  };

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center space-y-2 mt-10">
        <div className="flex flex-col items-center space-y-2">
          <div className="border-b border-primary rounded-full w-10 h-10 animate-spin duration-300"></div>
          <p className="text-center text-sm">Fetching Kyc Information...</p>
        </div>
      </div>
    );

  return (
    <div className="w-full mt-8">
      {/* <h2 className="text-xl font-semibold mb-4 text-left">
        KYC Information
      </h2> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Fullname */}
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* BVN */}
          <FormField
            control={form.control}
            name="bvn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BVN</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* NIN */}
          <FormField
            control={form.control}
            name="nin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIN</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Method (read-only) */}
          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Method</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    readOnly
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </FormControl>
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* DOB */}
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value
                        ? format(field.value, "PPP p")
                        : "Pick a date and time"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      showOutsideDays
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            disabled={isKycUpdating}
            className="w-full bg-primary text-white disabled:cursor-not-allowed disabled:primary/60"
          >
            {isKycUpdating ? "Updating..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
