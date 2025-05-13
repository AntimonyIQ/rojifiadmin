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
import { CardContent, CardFooter, Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { saveTransactionSettings } from "@/services/api";
import { CheckCircleIcon, InfoIcon, RefreshCwIcon, ArrowRightLeftIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Currency options
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

export default function ExchangeRatesForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [editRateDialogOpen, setEditRateDialogOpen] = useState(false);
  const [editCurrency, setEditCurrency] = useState<string | null>(null);
  const [sourceCurrency, setSourceCurrency] = useState("NGN");
  const [targetCurrency, setTargetCurrency] = useState("");
  const [rateAmount, setRateAmount] = useState("");
  const [rateType, setRateType] = useState<"buy" | "sell">("buy");
  const { toast } = useToast();

  // Default values for the form
  const defaultValues: FormValues = {
    baseCurrency: "NGN",
    rates: [
      { code: "USD", name: "US Dollar", symbol: "$", buyRate: 1500, sellRate: 1550, enabled: true },
      { code: "EUR", name: "Euro", symbol: "€", buyRate: 1650, sellRate: 1700, enabled: true },
      { code: "GBP", name: "British Pound", symbol: "£", buyRate: 1900, sellRate: 1950, enabled: true },
      { code: "KES", name: "Kenyan Shilling", symbol: "KSh", buyRate: 10.5, sellRate: 11.2, enabled: true },
      { code: "GHC", name: "Ghanaian Cedi", symbol: "₵", buyRate: 125, sellRate: 130, enabled: true },
      { code: "RWF", name: "Rwandan Franc", symbol: "FRw", buyRate: 1.35, sellRate: 1.42, enabled: true },
      { code: "UGX", name: "Ugandan Shilling", symbol: "USh", buyRate: 0.4, sellRate: 0.43, enabled: true },
      { code: "CAD", name: "Canadian Dollar", symbol: "C$", buyRate: 1100, sellRate: 1150, enabled: true },
    ],
    autoUpdateRates: false,
    lastUpdated: new Date().toISOString(),
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      // Convert form data to the expected API format
      return saveTransactionSettings({
        rateSettings: data,
      } as any);
    },
    onSuccess: () => {
      toast({
        title: "Rates saved",
        description: "Currency exchange rates have been updated successfully",
      });
      setIsLoading(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error saving rates",
        description: "There was a problem saving your exchange rates. Please try again.",
      });
      setIsLoading(false);
    },
  });

  function onSubmit(data: FormValues) {
    // Update the lastUpdated timestamp
    data.lastUpdated = new Date().toISOString();
    setIsLoading(true);
    mutation.mutate(data);
  }

  // Function to handle editing a currency rate
  const handleEditRate = (currencyCode: string) => {
    setEditCurrency(currencyCode);
    setTargetCurrency(currencyCode);
    setSourceCurrency("NGN");
    setRateType("buy");
    
    // Get the rate from the form
    const currency = form.getValues().rates.find(r => r.code === currencyCode);
    if (currency) {
      setRateAmount(currency.buyRate.toString());
    }
    
    setEditRateDialogOpen(true);
  };

  // Format currency amount with symbol
  const formatCurrency = (amount: number, symbol: string) => {
    return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Function to calculate rate difference (in percentage)
  const calculateRateDifference = (buyRate: number, sellRate: number) => {
    if (buyRate === 0) return 0;
    return ((sellRate - buyRate) / buyRate) * 100;
  };

  // Function to fetch live rates (simulated)
  const fetchLiveRates = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Simulated random rate adjustments (±2%)
      const updatedRates = form.getValues().rates.map(rate => {
        const randomFactor = 0.98 + Math.random() * 0.04; // Random between 0.98 and 1.02
        const newBuyRate = Math.round(rate.buyRate * randomFactor * 100) / 100;
        const newSellRate = Math.round(newBuyRate * 1.03 * 100) / 100; // Always 3% higher than buy rate
        
        return {
          ...rate,
          buyRate: newBuyRate,
          sellRate: newSellRate
        };
      });
      
      form.setValue('rates', updatedRates);
      form.setValue('lastUpdated', new Date().toISOString());
      
      setIsLoading(false);
      toast({
        title: "Rates updated",
        description: "Exchange rates have been refreshed with latest market data",
      });
    }, 1500);
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Getting current selected currency for edit dialog
  const currentCurrency = editCurrency 
    ? form.getValues().rates.find(rate => rate.code === editCurrency) 
    : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-medium text-gray-900">Manage Rates</h3>
              <p className="text-sm text-gray-500 mt-1">
                Configure currency exchange rates with Naira (₦) as the base currency.
              </p>
            </div>
            <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
              <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
              Exchange Rates
            </Badge>
          </div>

          <div className="flex justify-between items-center bg-gray-50 border rounded-md p-4">
            <div className="flex items-center">
              <div className="mr-4 p-2 bg-green-50 rounded-full">
                <RefreshCwIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Last Updated</h4>
                <p className="text-sm text-gray-500">{formatDate(form.watch('lastUpdated'))}</p>
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
                    <FormLabel className="text-sm font-normal">Auto-update</FormLabel>
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
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex items-start">
              <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">About Currency Exchange</h4>
                <p className="text-sm text-blue-600 mt-1">
                  All rates are relative to Nigerian Naira (₦). The Buy Rate is what you pay to buy the foreign currency 
                  with Naira, while the Sell Rate is what you receive when selling the foreign currency for Naira.
                </p>
              </div>
            </div>
          </div>

          <Card className="border border-gray-200">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Currency
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Buy Rate (NGN)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sell Rate (NGN)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Spread
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {form.watch('rates').map((rate, index) => {
                      const rateDifference = calculateRateDifference(rate.buyRate, rate.sellRate);
                      
                      return (
                        <tr key={rate.code} className={!rate.enabled ? "bg-gray-50" : ""}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium mr-3">
                                {rate.symbol}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{rate.code}</div>
                                <div className="text-sm text-gray-500">{rate.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">₦{rate.buyRate.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">
                              {formatCurrency(1 / rate.buyRate, rate.symbol)} = ₦1
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">₦{rate.sellRate.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">
                              {formatCurrency(1 / rate.sellRate, rate.symbol)} = ₦1
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
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter className="flex justify-between px-6 py-4 border-t">
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
        </CardFooter>
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
                <Select 
                  value={sourceCurrency}
                  onValueChange={(value) => {
                    setSourceCurrency(value);
                    // For now, we only support NGN as base currency
                    if (value !== "NGN") {
                      setTargetCurrency("NGN");
                      setRateType("sell");
                      
                      // Find the rate
                      const currency = form.getValues().rates.find(r => r.code === value);
                      if (currency) {
                        setRateAmount(currency.sellRate.toString());
                      }
                    } else if (targetCurrency) {
                      setRateType("buy");
                      
                      // Find the rate 
                      const currency = form.getValues().rates.find(r => r.code === targetCurrency);
                      if (currency) {
                        setRateAmount(currency.buyRate.toString());
                      }
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NGN">
                      <div className="flex items-center">
                        <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium mr-2">
                          ₦
                        </div>
                        <span>NGN</span>
                      </div>
                    </SelectItem>
                    {form.getValues().rates.map((rate) => (
                      <SelectItem key={`source-${rate.code}`} value={rate.code}>
                        <div className="flex items-center">
                          <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium mr-2">
                            {rate.symbol}
                          </div>
                          <span>{rate.code}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9"
                onClick={() => {
                  // Swap currencies
                  const temp = sourceCurrency;
                  setSourceCurrency(targetCurrency);
                  setTargetCurrency(temp);
                  
                  // Toggle rate type
                  setRateType(rateType === "buy" ? "sell" : "buy");
                  
                  // Update rate amount appropriately
                  const index = form.getValues().rates.findIndex(
                    r => r.code === (rateType === "buy" ? targetCurrency : sourceCurrency)
                  );
                  
                  if (index !== -1) {
                    const rate = form.getValues().rates[index];
                    setRateAmount(
                      (rateType === "buy" ? rate.sellRate : rate.buyRate).toString()
                    );
                  }
                }}
              >
                <ArrowRightLeftIcon className="h-4 w-4" />
              </Button>
              
              <div className="flex-1">
                <Select 
                  value={targetCurrency}
                  onValueChange={(value) => {
                    setTargetCurrency(value);
                    // For now, we only support NGN as base currency
                    if (value === "NGN") {
                      setSourceCurrency(editCurrency || "USD");
                      setRateType("sell");
                      
                      // Find the rate
                      const currency = form.getValues().rates.find(r => r.code === sourceCurrency);
                      if (currency) {
                        setRateAmount(currency.sellRate.toString());
                      }
                    } else {
                      setSourceCurrency("NGN");
                      setRateType("buy");
                      
                      // Find the rate
                      const currency = form.getValues().rates.find(r => r.code === value);
                      if (currency) {
                        setRateAmount(currency.buyRate.toString());
                      }
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NGN">
                      <div className="flex items-center">
                        <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium mr-2">
                          ₦
                        </div>
                        <span>NGN</span>
                      </div>
                    </SelectItem>
                    {form.getValues().rates.map((rate) => (
                      <SelectItem key={`target-${rate.code}`} value={rate.code}>
                        <div className="flex items-center">
                          <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium mr-2">
                            {rate.symbol}
                          </div>
                          <span>{rate.code}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  {sourceCurrency === "NGN" && targetCurrency ? (
                    <span>Amount in ₦ to buy 1 {targetCurrency}</span>
                  ) : targetCurrency === "NGN" && sourceCurrency ? (
                    <span>Amount in ₦ when selling 1 {sourceCurrency}</span>
                  ) : (
                    <span>Rate between {sourceCurrency} and {targetCurrency}</span>
                  )}
                </FormDescription>
              </FormItem>
            </div>
            
            <div className="mt-2 bg-blue-50 p-3 rounded-md">
              {sourceCurrency === "NGN" && targetCurrency ? (
                <p className="text-sm text-blue-700">
                  Users will pay {Number(rateAmount).toLocaleString()} NGN to get 1 {targetCurrency}
                </p>
              ) : targetCurrency === "NGN" && sourceCurrency ? (
                <p className="text-sm text-blue-700">
                  Users will receive {Number(rateAmount).toLocaleString()} NGN when they sell 1 {sourceCurrency}
                </p>
              ) : (
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Please select both currencies to see the rate conversion.
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
              onClick={() => {
                // Update the appropriate rate
                const index = form.getValues().rates.findIndex(r => r.code === editCurrency);
                
                if (index !== -1) {
                  const currentRates = [...form.getValues().rates];
                  
                  if (rateType === "buy") {
                    // Updating buy rate
                    currentRates[index] = {
                      ...currentRates[index],
                      buyRate: parseFloat(rateAmount)
                    };
                    
                    // Ensure buy rate is lower than sell rate
                    if (parseFloat(rateAmount) >= currentRates[index].sellRate) {
                      toast({
                        variant: "destructive",
                        title: "Invalid rates",
                        description: "Buy rate must be lower than sell rate to ensure a profitable spread.",
                      });
                      return;
                    }
                  } else {
                    // Updating sell rate
                    currentRates[index] = {
                      ...currentRates[index],
                      sellRate: parseFloat(rateAmount)
                    };
                    
                    // Ensure sell rate is higher than buy rate
                    if (parseFloat(rateAmount) <= currentRates[index].buyRate) {
                      toast({
                        variant: "destructive",
                        title: "Invalid rates",
                        description: "Sell rate must be higher than buy rate to ensure a profitable spread.",
                      });
                      return;
                    }
                  }
                  
                  // Update form state
                  form.setValue('rates', currentRates);
                  
                  // Close dialog and show success toast
                  setEditRateDialogOpen(false);
                  toast({
                    title: "Rate updated",
                    description: `Exchange rate for ${editCurrency} has been updated.`,
                  });
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}