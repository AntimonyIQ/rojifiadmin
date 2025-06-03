import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardContent, Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircleIcon, InfoIcon, ArrowRightIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExchangeRate } from "@/types";
import { useEditExchangeRate } from "@/hooks/useCurrency";

// Currency options
// @ts-ignore
const currencies = [
  { code: "NGN", name: "Nigerian Naira (NGN)", symbol: "₦" },
  { code: "USD", name: "US Dollar (USD)", symbol: "$" },
  { code: "EUR", name: "Euro (EUR)", symbol: "€" },
  { code: "GBP", name: "British Pound (GBP)", symbol: "£" },
  { code: "KES", name: "Kenyan Shilling (KES)", symbol: "KSh" },
  { code: "GHC", name: "Ghanaian Cedi (GHC)", symbol: "₵" },
  { code: "RWF", name: "Rwandan Franc (RWF)", symbol: "FRw" },
  { code: "UGX", name: "Ugandan Shilling (UGX)", symbol: "USh" },
  { code: "CAD", name: "Canadian Dollar (CAD)", symbol: "C$" },
];

// Define currency rate with schema validation
const currencyRateSchema = z.object({
  code: z.string().min(3),
  name: z.string(),
  symbol: z.string(),
  buyRate: z.coerce.number().positive({
    message: "Buy rate must be a positive number",
  }),
  sellRate: z.coerce.number().positive({
    message: "Sell rate must be a positive number",
  }),
  enabled: z.boolean().default(true),
});

// Define form schema
const formSchema = z.object({
  baseCurrency: z.string().default("NGN"),
  rates: z.array(currencyRateSchema),
  autoUpdateRates: z.boolean().default(false),
  lastUpdated: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  data: any;
}

export default function ExchangeRatesForm({ data }: Props) {
  console.log(data);
  // @ts-ignore
  const [isLoading, setIsLoading] = useState(false);
  const [editRateDialogOpen, setEditRateDialogOpen] = useState(false);
  const [editCurrency, setEditCurrency] = useState<string | null>(null);
  const [sourceCurrency, setSourceCurrency] = useState("NGN");
  const [targetCurrency, setTargetCurrency] = useState("");
  const [rateAmount, setRateAmount] = useState("");
  // @ts-ignore
  const [rateType, setRateType] = useState<"buy" | "sell">("buy");
  const [editCurrencyId, setEditCurrencyId] = useState("");
  const { toast } = useToast();

  // Default values for the form
  const defaultValues: FormValues = {
    baseCurrency: "NGN",
    rates: [
      {
        code: "USD",
        name: "US Dollar",
        symbol: "$",
        buyRate: 1500,
        sellRate: 1550,
        enabled: true,
      },
      {
        code: "EUR",
        name: "Euro",
        symbol: "€",
        buyRate: 1650,
        sellRate: 1700,
        enabled: true,
      },
      {
        code: "GBP",
        name: "British Pound",
        symbol: "£",
        buyRate: 1900,
        sellRate: 1950,
        enabled: true,
      },
      {
        code: "KES",
        name: "Kenyan Shilling",
        symbol: "KSh",
        buyRate: 10.5,
        sellRate: 11.2,
        enabled: true,
      },
      {
        code: "GHC",
        name: "Ghanaian Cedi",
        symbol: "₵",
        buyRate: 125,
        sellRate: 130,
        enabled: true,
      },
      {
        code: "RWF",
        name: "Rwandan Franc",
        symbol: "FRw",
        buyRate: 1.35,
        sellRate: 1.42,
        enabled: true,
      },
      {
        code: "UGX",
        name: "Ugandan Shilling",
        symbol: "USh",
        buyRate: 0.4,
        sellRate: 0.43,
        enabled: true,
      },
      {
        code: "CAD",
        name: "Canadian Dollar",
        symbol: "C$",
        buyRate: 1100,
        sellRate: 1150,
        enabled: true,
      },
    ],
    autoUpdateRates: false,
    lastUpdated: new Date().toISOString(),
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { mutate: editExchangeRateMutation, isPending: isEditExchangeRate } =
    useEditExchangeRate();

  // @ts-ignore
  function onSubmit(data: FormValues) {
    // Update the lastUpdated timestamp
    // data.lastUpdated = new Date().toISOString();
    // setIsLoading(true);
    // mutation.mutate(data);
  }

  const editRateFn = (id: string) => {
    const filteredData: ExchangeRate[] = data.filter(
      (i: ExchangeRate) => i.id === id
    );

    if (filteredData) {
      const payload = { id: filteredData[0].id, data: rateAmount };
      editExchangeRateMutation(
        {
          id: payload.id,
          data: payload.data,
        },
        {
          onSuccess: (response: any) => {
            console.log(response);
            setEditRateDialogOpen(false);
            toast({
              title: "Rates saved",
              description:
                "Currency exchange rates have been updated successfully",
            });
            setRateAmount("");
            setEditCurrencyId("");
          },
          // @ts-ignore
          onError: (error: any) => {
            toast({
              variant: "destructive",
              title: "Error saving rates",
              description:
                "There was a problem saving your exchange rates. Please try again.",
            });
          },
        }
      );
    }
  };

  // Function to handle editing a currency rate
  const handleEditRate = (currencyCode: string) => {
    // get the data based on the id
    const filteredData: ExchangeRate[] = data.filter(
      (i: ExchangeRate) => i.id === currencyCode
    );

    setEditCurrency(filteredData[0].target_currency.code);
    setTargetCurrency(filteredData[0].base_currency.code);
    setSourceCurrency("NGN");
    setRateAmount(filteredData[0].rate);
    setEditCurrencyId(filteredData[0].id);

    setEditRateDialogOpen(true);
  };

  // Format currency amount with symbol
  // @ts-ignore
  const formatCurrency = (amount: number, symbol: string) => {
    return `${symbol}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Function to calculate rate difference (in percentage)
  // @ts-ignore
  const calculateRateDifference = (buyRate: number, sellRate: number) => {
    if (buyRate === 0) return 0;
    return ((sellRate - buyRate) / buyRate) * 100;
  };

  // Function to fetch live rates (simulated)
  // @ts-ignore
  const fetchLiveRates = () => {
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Simulated random rate adjustments (±2%)
      const updatedRates = form.getValues().rates.map((rate) => {
        const randomFactor = 0.98 + Math.random() * 0.04; // Random between 0.98 and 1.02
        const newBuyRate = Math.round(rate.buyRate * randomFactor * 100) / 100;
        const newSellRate = Math.round(newBuyRate * 1.03 * 100) / 100; // Always 3% higher than buy rate

        return {
          ...rate,
          buyRate: newBuyRate,
          sellRate: newSellRate,
        };
      });

      form.setValue("rates", updatedRates);
      form.setValue("lastUpdated", new Date().toISOString());

      setIsLoading(false);
      toast({
        title: "Rates updated",
        description:
          "Exchange rates have been refreshed with latest market data",
      });
    }, 1500);
  };

  // Format date for display
  // @ts-ignore
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Getting current selected currency for edit dialog
  // @ts-ignore
  const currentCurrency = editCurrency
    ? form.getValues().rates.find((rate) => rate.code === editCurrency)
    : null;

  const SYMBOLS: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    KES: "KSh",
    GHS: "₵",
    ZAR: "R",
    NGN: "₦",
    RWF: "FRw",
    UGX: "USh",
    CAD: "C$",
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-medium text-gray-900">
                Manage Rates
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Configure currency exchange rates with Naira (₦) as the base
                currency.
              </p>
            </div>
            <Badge
              variant="outline"
              className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200"
            >
              <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
              Exchange Rates
            </Badge>
          </div>

          {/* <div className="flex justify-between items-center bg-gray-50 border rounded-md p-4">
            <div className="flex items-center">
              <div className="mr-4 p-2 bg-green-50 rounded-full">
                <RefreshCwIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Last Updated</h4>
                <p className="text-sm text-gray-500">
                  {formatDate(form.watch("lastUpdated"))}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <FormField
                control={form.control}
                name="autoUpdateRates"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Auto-update
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button
                type="button"
                onClick={fetchLiveRates}
                variant="outline"
                size="sm"
                className="gap-1"
                disabled={isLoading}
              >
                <RefreshCwIcon className="h-4 w-4" />
                Refresh Rates
              </Button>
            </div>
          </div> */}

          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex items-start">
              <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">
                  About Currency Exchange
                </h4>
                <p className="text-sm text-blue-600 mt-1">
                  All rates are relative to Nigerian Naira (₦). The Buy Rate is
                  what you pay to buy the foreign currency with Naira, while the
                  Sell Rate is what you receive when selling the foreign
                  currency for Naira.
                </p>
              </div>
            </div>
          </div>

          <Card className="border border-gray-200">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b w-full">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Base Currency
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {/* Buy Rate (NGN) */}
                        Target Currency
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {/* Sell Rate (NGN) */}
                        Rate
                      </th>
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Spread
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th> */}
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((rate: ExchangeRate) => {
                      return (
                        <tr
                          key={rate.id}
                          // className={!rate.enabled ? "bg-gray-50" : ""}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium mr-3">
                                {SYMBOLS[rate.base_currency.code]}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {rate.base_currency.code}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {rate.base_currency.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium mr-3">
                                {SYMBOLS[rate.target_currency.code]}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {rate.target_currency.code}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {rate.target_currency.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {/* base_currency.symbol */}₦
                              {parseFloat(rate.rate).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              1 {SYMBOLS[rate.base_currency.code]} ={" "}
                              {SYMBOLS[rate.target_currency.code]}
                              {parseFloat(rate.rate).toLocaleString()}
                            </div>
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                                ₦{rate.sellRate.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatCurrency(1 / rate.sellRate, rate.symbol)}{" "}
                                = ₦1
                              </div>
                          </td> */}
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {rateDifference > 0 ? (
                                <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                              ) : (
                                <TrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              <span className="text-sm font-medium">
                                {rateDifference.toFixed(2)}%
                              </span>
                            </div>
                          </td> */}
                          {/* <td className="px-6 py-4 whitespace-nowrap text-center">
                            <FormField
                              control={form.control}
                              name={`rates.${index}.enabled`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditRate(rate.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit Rates
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                    {/* {form.watch("rates").map((rate, index) => {
                      const rateDifference = calculateRateDifference(
                        rate.buyRate,
                        rate.sellRate
                      );

                      return (
                        <tr
                          key={rate.code}
                          className={!rate.enabled ? "bg-gray-50" : ""}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium mr-3">
                                {rate.symbol}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {rate.code}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {rate.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              ₦{rate.buyRate.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatCurrency(1 / rate.buyRate, rate.symbol)} =
                              ₦1
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              ₦{rate.sellRate.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatCurrency(1 / rate.sellRate, rate.symbol)} =
                              ₦1
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {rateDifference > 0 ? (
                                <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                              ) : (
                                <TrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              <span className="text-sm font-medium">
                                {rateDifference.toFixed(2)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <FormField
                              control={form.control}
                              name={`rates.${index}.enabled`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditRate(rate.code)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit Rates
                            </Button>
                          </td>
                        </tr>
                      );
                    })} */}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </CardContent>
        {/* <CardFooter className="flex justify-between px-6 py-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset(defaultValues)}
          >
            Reset to Default
          </Button>
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>Save Changes</>
            )}
          </Button>
        </CardFooter> */}
      </form>

      {/* Edit Rate Dialog */}
      <Dialog open={editRateDialogOpen} onOpenChange={setEditRateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Exchange Rate</DialogTitle>
            <DialogDescription>
              Configure the exchange rate between currencies.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="flex-1">
                <Input value={sourceCurrency} readOnly />
               
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                // onClick={() => {
                //   // Swap currencies
                //   const temp = sourceCurrency;
                //   setSourceCurrency(targetCurrency);
                //   setTargetCurrency(temp);

                //   // Toggle rate type
                //   setRateType(rateType === "buy" ? "sell" : "buy");

                //   // Update rate amount appropriately
                //   const index = form
                //     .getValues()
                //     .rates.findIndex(
                //       (r) =>
                //         r.code ===
                //         (rateType === "buy" ? targetCurrency : sourceCurrency)
                //     );

                //   if (index !== -1) {
                //     const rate = form.getValues().rates[index];
                //     setRateAmount(
                //       (rateType === "buy"
                //         ? rate.sellRate
                //         : rate.buyRate
                //       ).toString()
                //     );
                //   }
                // }}
              >
                <ArrowRightIcon className="h-4 w-4" />
                {/* <ArrowRightLeftIcon className="h-4 w-4" /> */}
              </Button>

              <div className="flex-1">
                <Input value={targetCurrency} readOnly/>
               
              </div>
            </div>

            <div className="mt-4">
              <FormItem>
                <FormLabel>Exchange Rate</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={rateAmount}
                    onChange={(e) => setRateAmount(e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  <span>
                    {parseFloat(rateAmount).toLocaleString()} {sourceCurrency}{" "}
                    for 1 {targetCurrency}
                  </span>
                  {/* {sourceCurrency === "NGN" && targetCurrency ? (
                    <span>Amount in ₦ to buy 1 {targetCurrency}</span>
                  ) : targetCurrency === "NGN" && sourceCurrency ? (
                    <span>Amount in ₦ when selling 1 {sourceCurrency}</span>
                  ) : (
                    <span>
                      Rate between {sourceCurrency} and {targetCurrency}
                    </span>
                  )} */}
                </FormDescription>
              </FormItem>
            </div>

            <div className="mt-2 bg-blue-50 p-3 rounded-md">
              {sourceCurrency === "NGN" && targetCurrency ? (
                <p className="text-sm text-blue-700">
                  Users will pay {Number(rateAmount).toLocaleString()} NGN to
                  get 1 {targetCurrency}
                </p>
              ) : targetCurrency === "NGN" && sourceCurrency ? (
                <p className="text-sm text-blue-700">
                  Users will receive {Number(rateAmount).toLocaleString()} NGN
                  when they sell 1 {sourceCurrency}
                </p>
              ) : (
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Please select both currencies to see
                  the rate conversion.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditRateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isEditExchangeRate}
              onClick={() => {
                editRateFn(editCurrencyId);
              }}
            >
              {isEditExchangeRate ? "Saving Changes..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
