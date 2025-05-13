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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CardContent, CardFooter, Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { BuildingIcon, CreditCardIcon, SmartphoneIcon, WalletIcon, CheckCircleIcon, PlusCircleIcon, WrenchIcon, AlertCircleIcon, CopyIcon, InfoIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { saveGeneralSettings } from "@/services/api";

// Currency options
const currencies = [
  { value: "NGN", label: "Nigerian Naira (NGN)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
  { value: "KES", label: "Kenyan Shilling (KES)" },
  { value: "GHC", label: "Ghanaian Cedi (GHC)" },
  { value: "RWF", label: "Rwandan Franc (RWF)" },
  { value: "UGX", label: "Ugandan Shilling (UGX)" },
  { value: "CAD", label: "Canadian Dollar (CAD)" },
];

// Payment processor configurations
const processorConfigs = [
  {
    id: "fincra",
    name: "Fincra",
    icon: BuildingIcon,
    description: "Connect to Fincra payment gateway for international payments",
    webhookRequired: true,
  },
  {
    id: "korapay",
    name: "Korapay",
    icon: WalletIcon,
    description: "Connect to Korapay payment gateway for local transactions",
    webhookRequired: true,
  },
  {
    id: "paga",
    name: "Paga",
    icon: SmartphoneIcon,
    description: "Connect to Paga payment gateway for mobile money transactions",
    webhookRequired: true,
  },
  {
    id: "paystack",
    name: "Paystack",
    icon: CreditCardIcon,
    description: "Connect to Paystack payment gateway for card payments",
    webhookRequired: true,
  },
];

// Currency schema
const currencySchema = z.object({
  code: z.string(),
  name: z.string(),
  enabled: z.boolean().default(false),
});

// Processor schema
const processorSchema = z.object({
  id: z.string(),
  name: z.string(),
  enabled: z.boolean().default(false),
  apiKey: z.string().optional(),
  secretKey: z.string().optional(),
  webhookUrl: z.string().optional(),
  testMode: z.boolean().default(true),
  currencies: z.array(currencySchema)
});

// Form schema
const formSchema = z.object({
  processors: z.array(processorSchema),
});

type FormValues = z.infer<typeof formSchema>;

export default function PaymentProcessorsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProcessor, setSelectedProcessor] = useState("fincra");
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [isSecretKeyVisible, setIsSecretKeyVisible] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [processorToDelete, setProcessorToDelete] = useState("");
  const { toast } = useToast();

  const defaultValues: FormValues = {
    processors: processorConfigs.map(processor => ({
      id: processor.id,
      name: processor.name,
      enabled: processor.id === "fincra", // Only Fincra enabled by default
      apiKey: processor.id === "fincra" ? "pk_test_123456789" : "",
      secretKey: processor.id === "fincra" ? "sk_test_987654321" : "",
      webhookUrl: processor.id === "fincra" ? "https://rojifi.com/webhooks/fincra" : "",
      testMode: true,
      currencies: currencies.map(currency => ({
        code: currency.value,
        name: currency.label,
        enabled: currency.value === "NGN" || currency.value === "USD", // Enable NGN and USD by default
      })),
    })),
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "processors",
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      // Convert form data to the expected API format
      return saveGeneralSettings({
        processorSettings: data,
      } as any);
    },
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Your payment processor settings have been updated successfully",
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

  const handleCopyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description,
      });
    }).catch((error) => {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Could not copy to clipboard.",
      });
    });
  };

  const toggleApiKeyVisibility = () => {
    setIsApiKeyVisible(!isApiKeyVisible);
  };

  const toggleSecretKeyVisibility = () => {
    setIsSecretKeyVisible(!isSecretKeyVisible);
  };

  const handleDeleteProcessor = () => {
    const index = form.getValues().processors.findIndex(p => p.id === processorToDelete);
    if (index !== -1) {
      remove(index);
      toast({
        title: "Processor removed",
        description: `The processor has been removed successfully.`,
      });
    }
    setIsDeleteDialogOpen(false);
  };

  const confirmDelete = (processorId: string) => {
    setProcessorToDelete(processorId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-medium text-gray-900">Manage Processors</h3>
              <p className="text-sm text-gray-500 mt-1">
                Configure payment processors (Fincra, Korapay, Paga, Paystack) and assign currencies to each processor.
              </p>
            </div>
            <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
              <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
              Configuration
            </Badge>
          </div>

          <div className="space-y-4">
            {processorConfigs.map((processor, index) => (
              <Accordion 
                key={processor.id} 
                type="single" 
                collapsible 
                defaultValue={processor.id === "fincra" ? processor.id : undefined}
                className="w-full"
              >
                <AccordionItem value={processor.id}>
                  <AccordionTrigger className="px-4 py-3 bg-gray-50 rounded-t-md border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-md bg-blue-50">
                        <processor.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-base font-medium">{processor.name}</h4>
                        <p className="text-sm text-gray-500">{processor.description}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 border-x border-b border-gray-200 rounded-b-md">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`processors.${index}.enabled`}
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Enable {processor.name}</FormLabel>
                              <FormDescription>
                                {field.value ? "Currently active and processing payments" : "Currently disabled"}
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

                      <div className="pt-2">
                        <h5 className="text-base font-medium mb-3">Supported Currencies</h5>
                        <div className="flex items-start mb-3">
                          <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                          <p className="text-sm text-gray-600">
                            Select the currencies this processor will support for transactions.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {currencies.map((currency, currencyIndex) => (
                            <FormField
                              key={currency.value}
                              control={form.control}
                              name={`processors.${index}.currencies.${currencyIndex}.enabled`}
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-3 rounded-md border p-3">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="flex items-center space-x-2">
                                    <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                                      {currency.value.substring(0, 1)}
                                    </div>
                                    <FormLabel className="font-normal text-sm">
                                      {currency.label}
                                    </FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex items-start">
              <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Payment Processor Information</h4>
                <p className="text-sm text-blue-600 mt-1">
                  Configure your payment processors to enable transactions in multiple currencies. Each processor
                  requires unique API credentials which you can obtain from their developer portals.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between px-6 py-4 border-t">
          <Button 
            type="button"
            variant="outline"
            onClick={() => form.reset(defaultValues)}
          >
            Reset All
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset processor configuration?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all settings for this processor, including API keys and currency configurations.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProcessor}>
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  );
}