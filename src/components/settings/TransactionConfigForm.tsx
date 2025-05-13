import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { saveTransactionSettings } from "@/services/api";

const formSchema = z.object({
  transactionProcessingMode: z.enum(["instant", "batch"], {
    required_error: "Please select a processing mode",
  }),
  maxTransactionAmount: z.coerce.number().positive({
    message: "Max transaction amount must be positive",
  }),
  minTransactionAmount: z.coerce.number().min(0, {
    message: "Min transaction amount must be at least 0",
  }),
  dailyLimitAmount: z.coerce.number().positive({
    message: "Daily limit must be positive",
  }),
  requireEmailVerification: z.boolean().default(true),
  requirePhoneVerification: z.boolean().default(false),
  transactionNotifications: z.boolean().default(true),
  automaticRefunds: z.boolean().default(false),
  transactionExpiryHours: z.coerce.number().min(1, {
    message: "Transaction expiry must be at least 1 hour",
  }).max(168, {
    message: "Transaction expiry can't exceed 168 hours (7 days)",
  }),
  defaultCurrency: z.string().min(1, {
    message: "Please select a default currency",
  }),
  fraudDetectionLevel: z.coerce.number().min(1).max(100),
});

type FormValues = z.infer<typeof formSchema>;

export default function TransactionConfigForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const defaultValues: FormValues = {
    transactionProcessingMode: "instant",
    maxTransactionAmount: 10000,
    minTransactionAmount: 5,
    dailyLimitAmount: 25000,
    requireEmailVerification: true,
    requirePhoneVerification: true,
    transactionNotifications: true,
    automaticRefunds: false,
    transactionExpiryHours: 24,
    defaultCurrency: "USD",
    fraudDetectionLevel: 75,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: saveTransactionSettings,
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Your transaction settings have been updated successfully",
      });
      setIsLoading(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error saving settings",
        description: "There was a problem saving your settings. Please try again.",
      });
      setIsLoading(false);
    },
  });

  function onSubmit(data: FormValues) {
    setIsLoading(true);
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 px-6 py-4">
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-gray-900">Manage Rates</h3>
            <p className="text-sm text-gray-500">
              Configure transaction rates, limits, and processing settings.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Transaction Processing</h3>
            <p className="text-sm text-gray-500">
              Configure how transactions are processed in the system.
            </p>
          </div>

          <FormField
            control={form.control}
            name="transactionProcessingMode"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Processing Mode</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="instant" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Instant (Process transactions immediately)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="batch" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Batch (Process transactions in batches at scheduled times)
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <FormField
              control={form.control}
              name="minTransactionAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Transaction Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                      <Input {...field} className="pl-7" type="number" min="0" step="0.01" />
                    </div>
                  </FormControl>
                  <FormDescription>
                    The smallest transaction amount allowed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxTransactionAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Transaction Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                      <Input {...field} className="pl-7" type="number" min="0" step="0.01" />
                    </div>
                  </FormControl>
                  <FormDescription>
                    The largest transaction amount allowed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dailyLimitAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Transaction Limit</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                      <Input {...field} className="pl-7" type="number" min="0" step="0.01" />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Maximum combined transaction amount per day
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transactionExpiryHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Expiry Time (hours)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="1" max="168" />
                  </FormControl>
                  <FormDescription>
                    How long before an incomplete transaction expires
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Currency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                      <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                      <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                      <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                      <SelectItem value="CNY">Chinese Yuan (CNY)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 pt-4">
            <h3 className="text-lg font-medium">Security & Verification</h3>
            <p className="text-sm text-gray-500">
              Configure security and verification requirements for transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="requireEmailVerification"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Email Verification</FormLabel>
                    <FormDescription>
                      Require email verification before processing transactions
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requirePhoneVerification"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Phone Verification</FormLabel>
                    <FormDescription>
                      Require phone verification for high-value transactions
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transactionNotifications"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Transaction Notifications</FormLabel>
                    <FormDescription>
                      Send email notifications for all transactions
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="automaticRefunds"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Automatic Refunds</FormLabel>
                    <FormDescription>
                      Automatically process refunds for failed transactions
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="fraudDetectionLevel"
            render={({ field: { value, onChange } }) => (
              <FormItem className="pt-4">
                <FormLabel>Fraud Detection Sensitivity</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <Slider
                      value={[value]}
                      min={1}
                      max={100}
                      step={1}
                      onValueChange={(vals) => onChange(vals[0])}
                    />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Low</span>
                      <span className="text-sm font-medium">{value}%</span>
                      <span className="text-sm text-gray-500">High</span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Higher sensitivity may block more fraudulent transactions but could increase false positives
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex justify-end px-6 py-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
