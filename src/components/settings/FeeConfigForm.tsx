import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardContent, CardFooter, Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { saveFeeSettings } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFetchFeeConfig } from "@/hooks/useFeeConfig";
import { useFetchAdminCurrencies } from "@/hooks/useCurrency";
// @ts-ignore
import { useFetchPaymentProcessors } from "@/hooks/usePayments";
import { useFetchTransactionChannels } from "@/hooks/useTransaction";

// Define fee types
const FEE_TYPES = [
  { id: "flat", label: "Flat Rate", description: "Fixed fee amount" },
  {
    id: "percentage_min",
    label: "% + Min",
    description: "Percentage fee with minimum amount",
  },
  {
    id: "percentage_max",
    label: "% + Max",
    description: "Percentage fee with maximum amount",
  },
  {
    id: "percentage_min_max",
    label: "% + Min + Max",
    description: "Percentage fee with minimum and maximum amount",
  },
  {
    id: "range",
    label: "Range",
    description: "Different fees for different amount ranges",
  },
];

// Define payment channels for each currency
const PAYMENT_CHANNELS = [
  { id: "bank_transfer", label: "Bank Transfer" },
  { id: "mobile_money", label: "Mobile Money" },
  { id: "swap", label: "Currency Swap" },
  { id: "withdrawal", label: "Withdrawal" },
  { id: "deposit", label: "Deposit" },
];

// Define the supported currencies
const CURRENCIES = [
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "GHC", name: "Ghanaian Cedi", symbol: "₵" },
  { code: "RWF", name: "Rwandan Franc", symbol: "FRw" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
];

// Schema for a range-based fee
const rangeFeeSchema = z.object({
  startRange: z.coerce
    .number()
    .min(0, { message: "Start range must be at least 0" }),
  endRange: z.coerce
    .number()
    .min(0, { message: "End range must be at least 0" }),
  feeValue: z.coerce
    .number()
    .min(0, { message: "Fee value must be at least 0" }),
});

// Schema for a single fee configuration
const channelFeeSchema = z.object({
  channelId: z.string(),
  feeType: z.enum([
    "flat",
    "percentage_min",
    "percentage_max",
    "percentage_min_max",
    "range",
  ]),
  flatValue: z.coerce.number().min(0).optional(),
  percentageValue: z.coerce.number().min(0).max(100).optional(),
  minValue: z.coerce.number().min(0).optional(),
  maxValue: z.coerce.number().min(0).optional(),
  ranges: z.array(rangeFeeSchema).optional(),
  enabled: z.boolean().default(true),
});

// Schema for all fees for a currency
const currencyFeeSchema = z.object({
  currencyCode: z.string(),
  channelFees: z.array(channelFeeSchema),
});

// Main form schema
const formSchema = z.object({
  currencyFees: z.array(currencyFeeSchema),
});

type RangeFee = z.infer<typeof rangeFeeSchema>;
// @ts-ignore
type ChannelFee = z.infer<typeof channelFeeSchema>;
// @ts-ignore
type CurrencyFee = z.infer<typeof currencyFeeSchema>;
type FormValues = z.infer<typeof formSchema>;

export default function FeeConfigForm() {
  const { data: feeConfig } = useFetchFeeConfig();
  console.log("config client:", feeConfig);

  // fetch transaction channels
  const { data: transactionChannels } = useFetchTransactionChannels();
  console.log("transaction channels:", transactionChannels);
  // fetch currencies
  const { data: currencies } = useFetchAdminCurrencies();
  console.log("currencies:", currencies);

  const [isLoading, setIsLoading] = useState(false);
  const [expandedCurrency, setExpandedCurrency] = useState<string | null>(
    "NGN"
  );
  const { toast } = useToast();

  // Generate default values for the form
  const generateDefaultValues = (): FormValues => {
    const currencyFees = CURRENCIES.map((currency) => {
      return {
        currencyCode: currency.code,
        channelFees: PAYMENT_CHANNELS.map((channel) => {
          return {
            channelId: channel.id,
            feeType: "flat" as const,
            flatValue: 100,
            percentageValue: 1.5,
            minValue: 50,
            maxValue: 2000,
            ranges: [
              { startRange: 0, endRange: 1000, feeValue: 50 },
              { startRange: 1001, endRange: 10000, feeValue: 100 },
              { startRange: 10001, endRange: 100000, feeValue: 200 },
            ],
            enabled: true,
          };
        }),
      };
    });

    return {
      currencyFees,
    };
  };

  const defaultValues = generateDefaultValues();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Set up field arrays for dynamic fields
  const { fields: currencyFields } = useFieldArray({
    control: form.control,
    name: "currencyFees",
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      // Format data as needed for the API
      return saveFeeSettings({
        ...data,
        // Additional fee settings transform logic if needed
      } as any);
    },
    onSuccess: () => {
      toast({
        title: "Fee settings saved",
        description: "Your fee configuration has been updated successfully",
      });
      setIsLoading(false);
    },
    // @ts-ignore
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error saving settings",
        description:
          "There was a problem saving your fee settings. Please try again.",
      });
      setIsLoading(false);
    },
  });

  function onSubmit(data: FormValues) {
    setIsLoading(true);
    mutation.mutate(data);
  }

  // Function to add a new range for range-based fees
  function addRange(currencyIndex: number, channelIndex: number) {
    const currentRanges =
      form.getValues().currencyFees[currencyIndex].channelFees[channelIndex]
        .ranges || [];
    const lastRange = currentRanges[currentRanges.length - 1];

    const newRange: RangeFee = {
      startRange: lastRange ? lastRange.endRange + 1 : 0,
      endRange: lastRange ? lastRange.endRange * 10 : 10000,
      feeValue: lastRange ? lastRange.feeValue : 100,
    };

    form.setValue(
      `currencyFees.${currencyIndex}.channelFees.${channelIndex}.ranges`,
      [...currentRanges, newRange]
    );
  }

  // Function to remove a range
  function removeRange(
    currencyIndex: number,
    channelIndex: number,
    rangeIndex: number
  ) {
    const currentRanges = [
      ...(form.getValues().currencyFees[currencyIndex].channelFees[channelIndex]
        .ranges || []),
    ];
    currentRanges.splice(rangeIndex, 1);

    form.setValue(
      `currencyFees.${currencyIndex}.channelFees.${channelIndex}.ranges`,
      currentRanges
    );
  }

  // Function to get currency symbol by code
  const getCurrencySymbol = (code: string): string => {
    const currency = CURRENCIES.find((c) => c.code === code);
    return currency ? currency.symbol : "";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-medium text-gray-900">
                Fee Configuration
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Configure fee structures for each currency and payment channel.
              </p>
            </div>
            <Badge
              variant="outline"
              className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200"
            >
              Fee Settings
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Click on a currency card to configure
                fees for different payment channels. Each payment channel can
                have its own fee type and configuration.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currencyFields.map((currencyField, currencyIndex) => {
                const currencyCode = currencyField.currencyCode;
                const currencySymbol = getCurrencySymbol(currencyCode);

                return (
                  <Card
                    key={currencyField.id}
                    className={`border overflow-hidden ${
                      expandedCurrency === currencyCode
                        ? "ring-2 ring-blue-200"
                        : ""
                    }`}
                  >
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer"
                      onClick={() =>
                        setExpandedCurrency(
                          expandedCurrency === currencyCode
                            ? null
                            : currencyCode
                        )
                      }
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-medium mr-3">
                          {currencySymbol}
                        </div>
                        <div>
                          <div className="text-md font-medium text-gray-900">
                            {currencyCode}
                          </div>
                          <div className="text-sm text-gray-500">
                            {
                              CURRENCIES.find((c) => c.code === currencyCode)
                                ?.name
                            }
                          </div>
                        </div>
                      </div>
                      {expandedCurrency === currencyCode ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>

                    {expandedCurrency === currencyCode && (
                      <div className="p-4 pt-0 border-t">
                        <Accordion type="single" collapsible className="w-full">
                          {form
                            .getValues()
                            .currencyFees[currencyIndex].channelFees.map(
                              (channelFee, channelIndex) => {
                                const channel = PAYMENT_CHANNELS.find(
                                  (c) => c.id === channelFee.channelId
                                );

                                return (
                                  <AccordionItem
                                    value={`channel-${channelFee.channelId}`}
                                    key={channelFee.channelId}
                                  >
                                    <AccordionTrigger className="py-3">
                                      <div className="flex items-center space-x-2">
                                        <span>{channel?.label}</span>
                                        <FormField
                                          control={form.control}
                                          name={`currencyFees.${currencyIndex}.channelFees.${channelIndex}.enabled`}
                                          render={({ field }) => (
                                            <FormItem
                                              className="flex items-center space-x-2 m-0"
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                            >
                                              <FormControl>
                                                <Switch
                                                  checked={field.value}
                                                  onCheckedChange={
                                                    field.onChange
                                                  }
                                                  className="data-[state=checked]:bg-green-500"
                                                />
                                              </FormControl>
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-2">
                                      <div className="space-y-4">
                                        <FormField
                                          control={form.control}
                                          name={`currencyFees.${currencyIndex}.channelFees.${channelIndex}.feeType`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Fee Type</FormLabel>
                                              <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                              >
                                                <FormControl>
                                                  <SelectTrigger>
                                                    <SelectValue placeholder="Select fee type" />
                                                  </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                  {FEE_TYPES.map((feeType) => (
                                                    <SelectItem
                                                      key={feeType.id}
                                                      value={feeType.id}
                                                    >
                                                      <div className="flex flex-col">
                                                        <span>
                                                          {feeType.label}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                          {feeType.description}
                                                        </span>
                                                      </div>
                                                    </SelectItem>
                                                  ))}
                                                </SelectContent>
                                              </Select>
                                              <FormDescription>
                                                Select the fee structure for
                                                this payment channel
                                              </FormDescription>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />

                                        {/* Fee type specific fields */}
                                        {form.watch(
                                          `currencyFees.${currencyIndex}.channelFees.${channelIndex}.feeType`
                                        ) === "flat" && (
                                          <FormField
                                            control={form.control}
                                            name={`currencyFees.${currencyIndex}.channelFees.${channelIndex}.flatValue`}
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>
                                                  Flat Fee Amount
                                                </FormLabel>
                                                <FormControl>
                                                  <div className="relative">
                                                    <span className="absolute left-3 top-2.5 text-gray-500">
                                                      {currencySymbol}
                                                    </span>
                                                    <Input
                                                      {...field}
                                                      className="pl-7"
                                                      type="number"
                                                      min="0"
                                                      step="0.01"
                                                    />
                                                  </div>
                                                </FormControl>
                                                <FormDescription>
                                                  Fixed fee amount for each
                                                  transaction
                                                </FormDescription>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        )}

                                        {[
                                          "percentage_min",
                                          "percentage_max",
                                          "percentage_min_max",
                                        ].includes(
                                          form.watch(
                                            `currencyFees.${currencyIndex}.channelFees.${channelIndex}.feeType`
                                          )
                                        ) && (
                                          <FormField
                                            control={form.control}
                                            name={`currencyFees.${currencyIndex}.channelFees.${channelIndex}.percentageValue`}
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>
                                                  Percentage Rate
                                                </FormLabel>
                                                <FormControl>
                                                  <div className="relative">
                                                    <Input
                                                      {...field}
                                                      type="number"
                                                      min="0"
                                                      max="100"
                                                      step="0.01"
                                                    />
                                                    <span className="absolute right-3 top-2.5 text-gray-500">
                                                      %
                                                    </span>
                                                  </div>
                                                </FormControl>
                                                <FormDescription>
                                                  Percentage of transaction
                                                  amount charged as fee
                                                </FormDescription>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        )}

                                        {[
                                          "percentage_min",
                                          "percentage_min_max",
                                        ].includes(
                                          form.watch(
                                            `currencyFees.${currencyIndex}.channelFees.${channelIndex}.feeType`
                                          )
                                        ) && (
                                          <FormField
                                            control={form.control}
                                            name={`currencyFees.${currencyIndex}.channelFees.${channelIndex}.minValue`}
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>
                                                  Minimum Fee Amount
                                                </FormLabel>
                                                <FormControl>
                                                  <div className="relative">
                                                    <span className="absolute left-3 top-2.5 text-gray-500">
                                                      {currencySymbol}
                                                    </span>
                                                    <Input
                                                      {...field}
                                                      className="pl-7"
                                                      type="number"
                                                      min="0"
                                                      step="0.01"
                                                    />
                                                  </div>
                                                </FormControl>
                                                <FormDescription>
                                                  Minimum fee amount regardless
                                                  of percentage calculation
                                                </FormDescription>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        )}

                                        {[
                                          "percentage_max",
                                          "percentage_min_max",
                                        ].includes(
                                          form.watch(
                                            `currencyFees.${currencyIndex}.channelFees.${channelIndex}.feeType`
                                          )
                                        ) && (
                                          <FormField
                                            control={form.control}
                                            name={`currencyFees.${currencyIndex}.channelFees.${channelIndex}.maxValue`}
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>
                                                  Maximum Fee Amount
                                                </FormLabel>
                                                <FormControl>
                                                  <div className="relative">
                                                    <span className="absolute left-3 top-2.5 text-gray-500">
                                                      {currencySymbol}
                                                    </span>
                                                    <Input
                                                      {...field}
                                                      className="pl-7"
                                                      type="number"
                                                      min="0"
                                                      step="0.01"
                                                    />
                                                  </div>
                                                </FormControl>
                                                <FormDescription>
                                                  Maximum fee amount regardless
                                                  of percentage calculation
                                                </FormDescription>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        )}

                                        {form.watch(
                                          `currencyFees.${currencyIndex}.channelFees.${channelIndex}.feeType`
                                        ) === "range" && (
                                          <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                              <FormLabel>Fee Ranges</FormLabel>
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                  addRange(
                                                    currencyIndex,
                                                    channelIndex
                                                  )
                                                }
                                                className="flex items-center gap-1"
                                              >
                                                <Plus className="h-3.5 w-3.5" />
                                                Add Range
                                              </Button>
                                            </div>

                                            <div className="space-y-4">
                                              {(
                                                form.watch(
                                                  `currencyFees.${currencyIndex}.channelFees.${channelIndex}.ranges`
                                                ) || []
                                              ).map(
                                                // @ts-ignore
                                                (range, rangeIndex) => (
                                                  <div
                                                    key={rangeIndex}
                                                    className="border rounded-lg p-4 space-y-4"
                                                  >
                                                    <div className="flex justify-between items-center">
                                                      <h4 className="font-medium">
                                                        Range {rangeIndex + 1}
                                                      </h4>
                                                      <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                          removeRange(
                                                            currencyIndex,
                                                            channelIndex,
                                                            rangeIndex
                                                          )
                                                        }
                                                      >
                                                        <Trash2 className="h-4 w-4" />
                                                      </Button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                      <FormField
                                                        control={form.control}
                                                        name={`currencyFees.${currencyIndex}.channelFees.${channelIndex}.ranges.${rangeIndex}.startRange`}
                                                        render={({ field }) => (
                                                          <FormItem>
                                                            <FormLabel>
                                                              Start Amount
                                                            </FormLabel>
                                                            <FormControl>
                                                              <div className="relative">
                                                                <span className="absolute left-3 top-2.5 text-gray-500">
                                                                  {
                                                                    currencySymbol
                                                                  }
                                                                </span>
                                                                <Input
                                                                  {...field}
                                                                  className="pl-7"
                                                                  type="number"
                                                                  min="0"
                                                                  step="1"
                                                                />
                                                              </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                          </FormItem>
                                                        )}
                                                      />

                                                      <FormField
                                                        control={form.control}
                                                        name={`currencyFees.${currencyIndex}.channelFees.${channelIndex}.ranges.${rangeIndex}.endRange`}
                                                        render={({ field }) => (
                                                          <FormItem>
                                                            <FormLabel>
                                                              End Amount
                                                            </FormLabel>
                                                            <FormControl>
                                                              <div className="relative">
                                                                <span className="absolute left-3 top-2.5 text-gray-500">
                                                                  {
                                                                    currencySymbol
                                                                  }
                                                                </span>
                                                                <Input
                                                                  {...field}
                                                                  className="pl-7"
                                                                  type="number"
                                                                  min="0"
                                                                  step="1"
                                                                />
                                                              </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                          </FormItem>
                                                        )}
                                                      />

                                                      <FormField
                                                        control={form.control}
                                                        name={`currencyFees.${currencyIndex}.channelFees.${channelIndex}.ranges.${rangeIndex}.feeValue`}
                                                        render={({ field }) => (
                                                          <FormItem>
                                                            <FormLabel>
                                                              Fee Amount
                                                            </FormLabel>
                                                            <FormControl>
                                                              <div className="relative">
                                                                <span className="absolute left-3 top-2.5 text-gray-500">
                                                                  {
                                                                    currencySymbol
                                                                  }
                                                                </span>
                                                                <Input
                                                                  {...field}
                                                                  className="pl-7"
                                                                  type="number"
                                                                  min="0"
                                                                  step="0.01"
                                                                />
                                                              </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                          </FormItem>
                                                        )}
                                                      />
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                );
                              }
                            )}
                        </Accordion>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end px-6 py-4 border-t">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset(defaultValues)}
            >
              Reset to Default
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
}
