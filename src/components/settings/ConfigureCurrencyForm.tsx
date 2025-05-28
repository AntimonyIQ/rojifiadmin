import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
// @ts-ignore
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
 // @ts-ignore
import { Switch } from "@/components/ui/switch";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, DollarSign, Edit, Trash, Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdminCurrencyProps } from "@/types";
import { useCreateCurrency, useEditCurrency } from "@/hooks/useCurrency";

// Currency options
const currencies = [
  {
    code: "NGN",
    name: "Nigerian Naira",
    symbol: "₦",
    exchangeRate: 1,
    country: "Nigeria",
    countryCode: "NG",
    decimalPlaces: 2,
    minSwapAmount: 1000,
    maxSwapAmount: 5000000,
    minTransferAmount: 100,
    maxTransferAmount: 10000000,
    image: "/assets/flags/ng.svg",
    isBaseCurrency: true,
    isEnabled: true,
  },
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    exchangeRate: 0.00066,
    country: "United States",
    countryCode: "US",
    decimalPlaces: 2,
    minSwapAmount: 10,
    maxSwapAmount: 50000,
    minTransferAmount: 1,
    maxTransferAmount: 100000,
    image: "/assets/flags/us.svg",
    isBaseCurrency: false,
    isEnabled: true,
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    exchangeRate: 0.00061,
    country: "European Union",
    countryCode: "EU",
    decimalPlaces: 2,
    minSwapAmount: 10,
    maxSwapAmount: 50000,
    minTransferAmount: 1,
    maxTransferAmount: 100000,
    image: "/assets/flags/eu.svg",
    isBaseCurrency: false,
    isEnabled: true,
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    exchangeRate: 0.00052,
    country: "United Kingdom",
    countryCode: "GB",
    decimalPlaces: 2,
    minSwapAmount: 10,
    maxSwapAmount: 50000,
    minTransferAmount: 1,
    maxTransferAmount: 100000,
    image: "/assets/flags/gb.svg",
    isBaseCurrency: false,
    isEnabled: true,
  },
  {
    code: "KES",
    name: "Kenyan Shilling",
    symbol: "KSh",
    exchangeRate: 0.085,
    country: "Kenya",
    countryCode: "KE",
    decimalPlaces: 2,
    minSwapAmount: 100,
    maxSwapAmount: 500000,
    minTransferAmount: 10,
    maxTransferAmount: 1000000,
    image: "/assets/flags/ke.svg",
    isBaseCurrency: false,
    isEnabled: true,
  },
];

// Form schema
const currencySchema = z.object({
  code: z.string(),
  name: z.string(),
  symbol: z.string(),
  exchangeRate: z.number().positive(),
  country: z.string(),
  countryCode: z.string(),
  decimalPlaces: z.number().int().min(0).max(8),
  minSwapAmount: z.number().min(0),
  maxSwapAmount: z.number().min(0),
  minTransferAmount: z.number().min(0),
  maxTransferAmount: z.number().min(0),
  image: z.string().optional(),
});

const formSchema = z.object({
  currencies: z.array(currencySchema),
});

// Form values type
type FormValues = {
  currencies: Array<{
    code: string;
    name: string;
    symbol: string;
    exchangeRate: number;
    country: string;
    countryCode: string;
    decimalPlaces: number;
    minSwapAmount: number;
    maxSwapAmount: number;
    minTransferAmount: number;
    maxTransferAmount: number;
  }>;
};

interface Props {
  data: AdminCurrencyProps[];
}

export default function ConfigureCurrencyForm({ data }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: createCurrency, isPending: isCreateCurrencyPending } =
    useCreateCurrency();
  const { mutate: editCurrency, isPending: isEditCurrencyPending } =
    useEditCurrency();

  // Add New Currency Modal
  const [newCurrencyDialogOpen, setNewCurrencyDialogOpen] = useState(false);
  const [newCurrencyCode, setNewCurrencyCode] = useState("");
  const [newCurrencyName, setNewCurrencyName] = useState("");
  const [newCurrencySymbol, setNewCurrencySymbol] = useState("");
  const [newCurrencyExchangeRate, setNewCurrencyExchangeRate] = useState(1);
  const [newCurrencyCountry, setNewCurrencyCountry] = useState("");
  const [newCurrencyCountryCode, setNewCurrencyCountryCode] = useState("");
  const [newCurrencyImage, setNewCurrencyImage] = useState("");
  const [newCurrencyDecimalPlaces, setNewCurrencyDecimalPlaces] = useState(2);
  const [newCurrencyMinSwapAmount, setNewCurrencyMinSwapAmount] = useState(10);
  const [newCurrencyMaxSwapAmount, setNewCurrencyMaxSwapAmount] =
    useState(10000);
  const [newCurrencyMinTransferAmount, setNewCurrencyMinTransferAmount] =
    useState(1);
  const [newCurrencyMaxTransferAmount, setNewCurrencyMaxTransferAmount] =
    useState(100000);

  // Edit Currency Modal
  const [editCurrencyDialogOpen, setEditCurrencyDialogOpen] = useState(false);
  // @ts-ignore
  const [editingCurrencyIndex, setEditingCurrencyIndex] = useState<
    number | null
  >(null);
  const [editCurrencyCode, setEditCurrencyCode] = useState("");
  const [editCurrencyName, setEditCurrencyName] = useState("");
  const [editCurrencySymbol, setEditCurrencySymbol] = useState("");
  const [editCurrencyExchangeRate, setEditCurrencyExchangeRate] = useState(1);
  const [editCurrencyCountry, setEditCurrencyCountry] = useState("");
  const [editCurrencyCountryCode, setEditCurrencyCountryCode] = useState("");
  const [editCurrencyImage, setEditCurrencyImage] = useState("");
  const [editCurrencyDecimalPlaces, setEditCurrencyDecimalPlaces] = useState(2);
  const [editCurrencyMinSwapAmount, setEditCurrencyMinSwapAmount] =
    useState(10);
  const [editCurrencyMaxSwapAmount, setEditCurrencyMaxSwapAmount] =
    useState(10000);
  const [editCurrencyMinTransferAmount, setEditCurrencyMinTransferAmount] =
    useState(1);
  const [editCurrencyMaxTransferAmount, setEditCurrencyMaxTransferAmount] =
    useState(100000);
  // @ts-ignore
  const [editCurrencyIsBaseCurrency, setEditCurrencyIsBaseCurrency] =
    useState(false);
  // @ts-ignore
  const [editCurrencyIsEnabled, setEditCurrencyIsEnabled] = useState(true);
  const [editCurrencyId, setEditCurrencyId] = useState("");

  // Delete Currency Confirmation
  const [deleteCurrencyCode, setDeleteCurrencyCode] = useState<string | null>(
    null
  );

  const { toast } = useToast();

  // Initialize form with currencies
  const defaultValues: FormValues = {
    currencies: currencies.map((currency) => ({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      exchangeRate: currency.exchangeRate,
      country: currency.country,
      countryCode: currency.countryCode,
      decimalPlaces: currency.decimalPlaces,
      minSwapAmount: currency.minSwapAmount,
      maxSwapAmount: currency.maxSwapAmount,
      minTransferAmount: currency.minTransferAmount,
      maxTransferAmount: currency.maxTransferAmount,
    })),
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Currency settings saved",
        description: "Your currency settings have been updated successfully",
      });
      setIsLoading(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error saving settings",
        description:
          "There was a problem saving your settings. Please try again.",
      });
      setIsLoading(false);
    },
  });

  // Reset the form
  const resetForm = () => {
    setNewCurrencyCode("");
    setNewCurrencyName("");
    setNewCurrencySymbol("");
    setNewCurrencyExchangeRate(1);
    setNewCurrencyCountry("");
    setNewCurrencyCountryCode("");
    setNewCurrencyImage("");
    setNewCurrencyDecimalPlaces(2);
    setNewCurrencyMinSwapAmount(10);
    setNewCurrencyMaxSwapAmount(10000);
    setNewCurrencyMinTransferAmount(1);
    setNewCurrencyMaxTransferAmount(100000);
    setNewCurrencyDialogOpen(false);
  };

  // @ts-ignore
  function onSubmit(data: FormValues) {
    setIsLoading(true);
    mutation.mutate(data);
  }

  const handleAddNewCurrency = () => {
    const currencyFormData = {
      code: newCurrencyCode,
      name: newCurrencyName,
      symbol: newCurrencySymbol,
      country: newCurrencyCountry,
      country_code: newCurrencyCountryCode,
      decimal_place: newCurrencyDecimalPlaces,
    };

    createCurrency(currencyFormData, {
      onSuccess: (response: any) => {
        console.log(response);
        setNewCurrencyDialogOpen(false);

        toast({
          title: "Currency added",
          description: `${currencyFormData.name} has been added to the successfully`,
        });
        resetForm();
      },
      onError: (error: any) => {
        resetForm();
        toast({
          title: "Error",
          description:
            error?.response?.data?.message || "Failed to add currency",
          variant: "destructive",
        });
      },
    });
  };

  const handleEditCurrency = (currency: AdminCurrencyProps) => {
    // Populate the edit form with the selected currency
    setEditCurrencyId(currency.id);
    // setEditingCurrencyIndex(index);
    setEditCurrencyCode(currency.code);
    setEditCurrencyName(currency.name);
    setEditCurrencySymbol(currency.symbol);
    // setEditCurrencyExchangeRate(currency.exchangeRate);
    setEditCurrencyCountry(currency.country);
    setEditCurrencyCountryCode(currency.country_code);
    // setEditCurrencyImage(currency.image || "");
    setEditCurrencyDecimalPlaces(currency.decimal_place);
    setEditCurrencyMinSwapAmount(currency.min_swap_amount);
    setEditCurrencyMaxSwapAmount(currency.max_swap_amount);
    setEditCurrencyMinTransferAmount(currency.min_transfer_amount);
    setEditCurrencyMaxTransferAmount(currency.max_transfer_amount);
    // setEditCurrencyIsBaseCurrency(currency.isBaseCurrency);
    // setEditCurrencyIsEnabled(currency.isEnabled);

    // Open the edit dialog
    setEditCurrencyDialogOpen(true);
  };

  const handleSaveEditedCurrency = () => {
    const currencyFormData = {
      min_swap_amount: editCurrencyMinSwapAmount,
      max_swap_amount: editCurrencyMaxSwapAmount,
      min_transfer_amount: editCurrencyMinTransferAmount,
      max_transfer_amount: editCurrencyMaxTransferAmount,
    };
    const id = editCurrencyId;
    const name = editCurrencyName;
    editCurrency(
      {
        id: id,
        data: currencyFormData,
      },
      {
        onSuccess: (response: any) => {
          console.log(response);
          setNewCurrencyDialogOpen(false);

          toast({
            title: "Currency Updated",
            description: `${name} has been updated successfully`,
          });
          setEditCurrencyDialogOpen(false);
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error?.response?.data?.message || "Failed to update currency",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDeleteCurrency = () => {
    if (!deleteCurrencyCode) return;

    console.log("currency id:", deleteCurrencyCode);

    // const currentCurrencies = form.getValues().currencies;

    // Don't allow deleting the base currency
    // const currencyToDelete = currentCurrencies.find(
    //   (c) => c.code === deleteCurrencyCode
    // );
    // if (currencyToDelete?.isBaseCurrency) {
    //   toast({
    //     variant: "destructive",
    //     title: "Cannot delete base currency",
    //     description: "The base currency cannot be deleted.",
    //   });
    //   setDeleteCurrencyCode(null);
    //   return;
    // }

    // Reset delete confirmation
    setDeleteCurrencyCode(null);

    toast({
      title: "Currency removed",
      description: `Currency has been removed successfully.`,
    });
  };

  return (
    <>
      <CardContent className="space-y-8 px-6 py-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-medium text-gray-900">
                Currency Configuration
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Configure currencies, exchange rates, and base currency for your
                application.
              </p>
            </div>
            <Badge
              variant="outline"
              className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200"
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              Configuration
            </Badge>
          </div>

          {/* Edit Currency Dialog */}
          <Dialog
            open={editCurrencyDialogOpen}
            onOpenChange={setEditCurrencyDialogOpen}
          >
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Currency</DialogTitle>
                <DialogDescription>
                  Update the currency details. Some fields may be read-only for
                  system currencies.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label
                      htmlFor="edit-currency-code"
                      className="text-sm font-medium text-gray-700"
                    >
                      Currency Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-currency-code"
                      placeholder="e.g. USD, EUR, GBP"
                      value={editCurrencyCode}
                      onChange={(e) =>
                        setEditCurrencyCode(e.target.value.toUpperCase())
                      }
                      className="w-full"
                      readOnly
                      maxLength={3}
                      disabled={editCurrencyIsBaseCurrency} // Base currency code should not be edited
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="edit-currency-name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Currency Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-currency-name"
                      placeholder="e.g. US Dollar, Euro"
                      value={editCurrencyName}
                      onChange={(e) => setEditCurrencyName(e.target.value)}
                      className="w-full"
                      readOnly
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label
                      htmlFor="edit-currency-symbol"
                      className="text-sm font-medium text-gray-700"
                    >
                      Currency Symbol <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-currency-symbol"
                      placeholder="e.g. $, €, £"
                      value={editCurrencySymbol}
                      onChange={(e) => setEditCurrencySymbol(e.target.value)}
                      className="w-full"
                      readOnly
                      maxLength={3}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="edit-exchange-rate"
                      className="text-sm font-medium text-gray-700"
                    >
                      Exchange Rate <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-exchange-rate"
                      type="number"
                      step="0.0001"
                      placeholder="1.0"
                      value={editCurrencyExchangeRate}
                      onChange={(e) =>
                        setEditCurrencyExchangeRate(parseFloat(e.target.value))
                      }
                      className="w-full"
                      readOnly
                      disabled={editCurrencyIsBaseCurrency} // Base currency always has exchange rate 1
                    />
                    {/* <p className="text-xs text-gray-500">
                      Relative to {form.watch("baseCurrency")}
                    </p> */}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label
                      htmlFor="edit-country"
                      className="text-sm font-medium text-gray-700"
                    >
                      Country <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-country"
                      placeholder="e.g. United States"
                      value={editCurrencyCountry}
                      onChange={(e) => setEditCurrencyCountry(e.target.value)}
                      className="w-full"
                      readOnly
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="edit-country-code"
                      className="text-sm font-medium text-gray-700"
                    >
                      Country Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-country-code"
                      placeholder="e.g. US, GB"
                      value={editCurrencyCountryCode}
                      onChange={(e) =>
                        setEditCurrencyCountryCode(e.target.value.toUpperCase())
                      }
                      className="w-full"
                      maxLength={2}
                      readOnly
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="edit-decimal-places"
                    className="text-sm font-medium text-gray-700"
                  >
                    Decimal Places <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-decimal-places"
                    type="number"
                    min="0"
                    max="8"
                    placeholder="2"
                    value={editCurrencyDecimalPlaces}
                    onChange={(e) =>
                      setEditCurrencyDecimalPlaces(parseInt(e.target.value))
                    }
                    className="w-full"
                    readOnly
                  />
                  <p className="text-xs text-gray-500">
                    Number of decimal places to display (0-8)
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-2">
                  <h4 className="text-sm font-medium text-gray-800 mb-3">
                    Transaction Limits
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label
                        htmlFor="edit-min-swap"
                        className="text-sm font-medium text-gray-700"
                      >
                        Min Swap Amount <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="edit-min-swap"
                        type="number"
                        min="0"
                        placeholder="10"
                        value={editCurrencyMinSwapAmount}
                        onChange={(e) =>
                          setEditCurrencyMinSwapAmount(
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="edit-max-swap"
                        className="text-sm font-medium text-gray-700"
                      >
                        Max Swap Amount <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="edit-max-swap"
                        type="number"
                        min="0"
                        placeholder="10000"
                        value={editCurrencyMaxSwapAmount}
                        onChange={(e) =>
                          setEditCurrencyMaxSwapAmount(
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-3">
                      <Label
                        htmlFor="edit-min-transfer"
                        className="text-sm font-medium text-gray-700"
                      >
                        Min Transfer Amount{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="edit-min-transfer"
                        type="number"
                        min="0"
                        placeholder="1"
                        value={editCurrencyMinTransferAmount}
                        onChange={(e) =>
                          setEditCurrencyMinTransferAmount(
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="edit-max-transfer"
                        className="text-sm font-medium text-gray-700"
                      >
                        Max Transfer Amount{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="edit-max-transfer"
                        type="number"
                        min="0"
                        placeholder="100000"
                        value={editCurrencyMaxTransferAmount}
                        onChange={(e) =>
                          setEditCurrencyMaxTransferAmount(
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="edit-currency-image"
                    className="text-sm font-medium text-gray-700"
                  >
                    Currency Image URL
                  </Label>
                  <Input
                    id="edit-currency-image"
                    placeholder="e.g. /assets/flags/us.svg"
                    value={editCurrencyImage}
                    onChange={(e) => setEditCurrencyImage(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    URL to the currency image (optional)
                  </p>
                </div>

                {/* <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editCurrencyIsEnabled}
                      onCheckedChange={setEditCurrencyIsEnabled}
                      disabled={editCurrencyIsBaseCurrency}
                      id="edit-currency-enabled"
                    />
                    <Label
                      htmlFor="edit-currency-enabled"
                      className="text-sm font-medium text-gray-700"
                    >
                      Enabled
                    </Label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Enable or disable this currency for transactions
                  </p>
                </div> */}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditCurrencyDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveEditedCurrency}
                  disabled={
                    editCurrencyMinSwapAmount < 0 ||
                    editCurrencyMaxSwapAmount <= 0 ||
                    editCurrencyMinTransferAmount < 0 ||
                    editCurrencyMaxTransferAmount <= 0 ||
                    isEditCurrencyPending
                  }
                >
                  {isEditCurrencyPending ? "Updating..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Currency Dialog */}
          <Dialog
            open={!!deleteCurrencyCode}
            onOpenChange={(open) => !open && setDeleteCurrencyCode(null)}
          >
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this currency? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <p className="text-sm text-gray-500">
                  Deleting this currency will remove it from your system and all
                  related settings. Active transactions will not be affected.
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteCurrencyCode(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteCurrency}
                >
                  Delete Currency
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex justify-end">
            <Dialog
              open={newCurrencyDialogOpen}
              onOpenChange={setNewCurrencyDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4" />
                  Add New Currency
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Currency</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new currency. Exchange rate should
                    be relative to your base currency.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label
                        htmlFor="currency-code"
                        className="text-sm font-medium text-gray-700"
                      >
                        Currency Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="currency-code"
                        placeholder="e.g. USD, EUR, GBP"
                        value={newCurrencyCode}
                        onChange={(e) =>
                          setNewCurrencyCode(e.target.value.toUpperCase())
                        }
                        className="w-full"
                        maxLength={3}
                      />
                      <p className="text-xs text-gray-500">
                        Enter the 3-letter ISO currency code.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="currency-name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Currency Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="currency-name"
                        placeholder="e.g. US Dollar, Euro"
                        value={newCurrencyName}
                        onChange={(e) => setNewCurrencyName(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label
                        htmlFor="currency-symbol"
                        className="text-sm font-medium text-gray-700"
                      >
                        Currency Symbol <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="currency-symbol"
                        placeholder="e.g. $, €, £"
                        value={newCurrencySymbol}
                        onChange={(e) => setNewCurrencySymbol(e.target.value)}
                        className="w-full"
                        maxLength={3}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="exchange-rate"
                        className="text-sm font-medium text-gray-700"
                      >
                        Exchange Rate <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="exchange-rate"
                        type="number"
                        step="0.0001"
                        placeholder="1.0"
                        value={newCurrencyExchangeRate}
                        onChange={(e) =>
                          setNewCurrencyExchangeRate(parseFloat(e.target.value))
                        }
                        className="w-full"
                      />
                      {/* <p className="text-xs text-gray-500">
                        Relative to {form.watch("baseCurrency")}
                      </p> */}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label
                        htmlFor="country"
                        className="text-sm font-medium text-gray-700"
                      >
                        Country <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="country"
                        placeholder="e.g. United States"
                        value={newCurrencyCountry}
                        onChange={(e) => setNewCurrencyCountry(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="country-code"
                        className="text-sm font-medium text-gray-700"
                      >
                        Country Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="country-code"
                        placeholder="e.g. US, GB"
                        value={newCurrencyCountryCode}
                        onChange={(e) =>
                          setNewCurrencyCountryCode(
                            e.target.value.toUpperCase()
                          )
                        }
                        className="w-full"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="decimal-places"
                      className="text-sm font-medium text-gray-700"
                    >
                      Decimal Places <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="decimal-places"
                      type="number"
                      min="0"
                      max="8"
                      placeholder="2"
                      value={newCurrencyDecimalPlaces}
                      onChange={(e) =>
                        setNewCurrencyDecimalPlaces(parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Number of decimal places to display (0-8)
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mt-2">
                    <h4 className="text-sm font-medium text-gray-800 mb-3">
                      Transaction Limits
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label
                          htmlFor="min-swap"
                          className="text-sm font-medium text-gray-700"
                        >
                          Min Swap Amount{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="min-swap"
                          type="number"
                          min="0"
                          placeholder="10"
                          value={newCurrencyMinSwapAmount}
                          onChange={(e) =>
                            setNewCurrencyMinSwapAmount(
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="max-swap"
                          className="text-sm font-medium text-gray-700"
                        >
                          Max Swap Amount{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="max-swap"
                          type="number"
                          min="0"
                          placeholder="10000"
                          value={newCurrencyMaxSwapAmount}
                          onChange={(e) =>
                            setNewCurrencyMaxSwapAmount(
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-3">
                        <Label
                          htmlFor="min-transfer"
                          className="text-sm font-medium text-gray-700"
                        >
                          Min Transfer Amount{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="min-transfer"
                          type="number"
                          min="0"
                          placeholder="1"
                          value={newCurrencyMinTransferAmount}
                          onChange={(e) =>
                            setNewCurrencyMinTransferAmount(
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="max-transfer"
                          className="text-sm font-medium text-gray-700"
                        >
                          Max Transfer Amount{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="max-transfer"
                          type="number"
                          min="0"
                          placeholder="100000"
                          value={newCurrencyMaxTransferAmount}
                          onChange={(e) =>
                            setNewCurrencyMaxTransferAmount(
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="currency-image"
                      className="text-sm font-medium text-gray-700"
                    >
                      Currency Image URL
                    </Label>
                    <Input
                      id="currency-image"
                      placeholder="e.g. /assets/flags/us.svg"
                      value={newCurrencyImage}
                      onChange={(e) => setNewCurrencyImage(e.target.value)}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      URL to the currency image (optional)
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setNewCurrencyDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddNewCurrency}
                    disabled={
                      !newCurrencyCode ||
                      !newCurrencyName ||
                      !newCurrencySymbol ||
                      newCurrencyExchangeRate <= 0 ||
                      !newCurrencyCountry ||
                      !newCurrencyCountryCode ||
                      newCurrencyDecimalPlaces < 0 ||
                      newCurrencyMinSwapAmount < 0 ||
                      newCurrencyMaxSwapAmount <= 0 ||
                      newCurrencyMinTransferAmount < 0 ||
                      newCurrencyMaxTransferAmount <= 0 ||
                      newCurrencyMinSwapAmount >= newCurrencyMaxSwapAmount ||
                      newCurrencyMinTransferAmount >=
                        newCurrencyMaxTransferAmount ||
                      isCreateCurrencyPending
                    }
                  >
                    {isCreateCurrencyPending
                      ? " Adding Currency..."
                      : " Add Currency"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Symbol
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                    Exchange Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                    Status
                  </th> */}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((currency) => (
                <tr key={currency.code}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="font-medium">{currency.code}</span>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {currency.code}
                        </div>
                        <div className="text-sm text-gray-500">
                          {currency.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {currency.symbol}
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {currency.isBaseCurrency
                          ? "1.0000"
                          : currency.exchangeRate.toFixed(4)}
                      </div>
                    </td> */}
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                      <FormField
                        control={form.control}
                        name={`currencies.${index}.isEnabled`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={currency.isBaseCurrency}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCurrency(currency)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteCurrencyCode(currency.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex items-start">
            <DollarSign className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">
                Currency Exchange Information
              </h4>
              <p className="text-sm text-blue-600 mt-1">
                The base currency is used as the reference for all exchange
                rates. When setting a new currency, the exchange rate should
                represent how many units of the base currency equal one unit of
                the new currency.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 border-t border-gray-100 flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            form.reset(defaultValues);
            toast({
              title: "Settings reset",
              description: "All changes have been discarded",
            });
          }}
        >
          Reset
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !form.formState.isDirty}
          className="gap-2"
        >
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
    </>
  );
}
