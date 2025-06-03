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
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// @ts-ignore
import { CardContent, CardFooter } from "@/components/ui/card";
// @ts-ignore
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// @ts-ignore
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
// @ts-ignore
import { CheckCircleIcon, InfoIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { saveGeneralSettings } from "@/services/api";
import { Currency, ProcessorChannelType } from "@/types";
import { useUpdatePaymentProcessor } from "@/hooks/usePayments";
import { useFetchAdminCurrencies } from "@/hooks/useCurrency";

// Currency schema
const currencySchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  enabled: z.boolean().default(false),
});

// Processor schema
const processorSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  // enabled: z.boolean().default(false),
  supported_currencies: z.array(currencySchema),
});

// Form schema
const formSchema = z.object({
  processors: z.array(processorSchema),
});

// type FormValues = z.infer<typeof formSchema>;
type FormValues = {
  processors: Array<{
    id: string;
    name: string;
    status: "enabled" | "disabled";
    supported_currencies: Currency[];
  }>;
};

interface Props {
  data: ProcessorChannelType[];
}

export default function PaymentProcessorsForm({ data }: Props) {
  const { data: currencyList } = useFetchAdminCurrencies();

  const { mutate: updateProcessor, isPending: isUpdateProcessorPending } =
    useUpdatePaymentProcessor();

  const handleUpdateProcessor = ({
    id,
    payload,
  }: {
    id: string;
    payload: any;
  }) => {
    updateProcessor(
      { id: id, data: payload },
      {
        // @ts-ignore
        onSuccess: (response: any) => {
          console.log(response);

          toast({
            title: "Processor Updated",
            description: `Updated successfully!`,
          });
          setCheckedProcessorCurrencies([]);
          setCheckedProcessorId("");
          setCheckedProcessorStatus("");
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error?.response?.data?.message || "Failed to edit processor",
            variant: "destructive",
          });
        },
      }
    );
  };

  const processorConfigs: ProcessorChannelType[] = data;

  // @ts-ignore
  const [isLoading, setIsLoading] = useState(false);
  // @ts-ignore
  const [selectedProcessor, setSelectedProcessor] = useState("fincra");
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [isSecretKeyVisible, setIsSecretKeyVisible] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [processorToDelete, setProcessorToDelete] = useState("");
  const { toast } = useToast();

  const [checkedProcessorId, setCheckedProcessorId] = useState<string>("");
  const [checkedProcessorStatus, setCheckedProcessorStatus] =
    useState<string>("");
  const [checkedProcessorCurrencies, setCheckedProcessorCurrencies] = useState<
    string[]
  >([]);

  const defaultValues: FormValues = {
    // @ts-ignore
    processors: processorConfigs
      ? processorConfigs.map((processor) => {
          // const supportedCurrencyIds = processor.supported_currencies.map(
          //   (currency) => currency.id
          // );

          return {
            id: processor.id,
            name: processor.name,
            status: processor.status,
            enabled: processor.status === "enabled",
            supported_currencies: currencyList?.map((currency) => ({
              ...currency,
              enabled:
                currency.code === "NGN" ||
                currency.code === "USD" ||
                processor.supported_currencies.some(
                  (i) => i.code === currency.code
                ),
            })),
          };
        })
      : [],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // @ts-ignore
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
        description:
          "Your payment processor settings have been updated successfully",
      });
      setIsLoading(false);
    },
    // @ts-ignore
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error saving settings",
        description:
          "There was a problem saving your settings. Please try again.",
      });
      setIsLoading(false);
    },
  });

  function onSubmit(data: FormValues) {
    setIsLoading(true);
    mutation.mutate(data);
  }

  // @ts-ignore
  const handleCopyToClipboard = (text: string, description: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copied!",
          description,
        });
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Copy failed",
          description: "Could not copy to clipboard.",
        });
      });
  };

  // @ts-ignore
  const toggleApiKeyVisibility = () => {
    setIsApiKeyVisible(!isApiKeyVisible);
  };

  // @ts-ignore
  const toggleSecretKeyVisibility = () => {
    setIsSecretKeyVisible(!isSecretKeyVisible);
  };

  const handleDeleteProcessor = () => {
    const index = form
      .getValues()
      .processors.findIndex((p) => p.id === processorToDelete);
    if (index !== -1) {
      remove(index);
      toast({
        title: "Processor removed",
        description: `The processor has been removed successfully.`,
      });
    }
    setIsDeleteDialogOpen(false);
  };

  // @ts-ignore
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
              <h3 className="text-xl font-medium text-gray-900">
                Manage Processors
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Configure payment processors (Fincra, Korapay, Paga, Paystack)
                and assign currencies to each processor.
              </p>
            </div>
            <Badge
              variant="outline"
              className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200"
            >
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
                defaultValue={
                  processor.name === "fincra" ? processor.name : undefined // id
                }
                className="w-full"
              >
                <AccordionItem value={processor.id}>
                  <AccordionTrigger className="px-4 py-3 bg-gray-50 rounded-t-md border border-gray-200">
                    <div className="flex items-center space-x-3">
                      {/* <div className="p-2 rounded-md bg-blue-50">
                        <processor.icon className="h-5 w-5 text-blue-600" />
                      </div> */}
                      <div className="text-left">
                        <h4 className="text-base font-medium capitalize">
                          {processor.name}
                        </h4>
                        {/* <p className="text-sm text-gray-500">
                          {processor.description}
                        </p> */}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 border-x border-b border-gray-200 rounded-b-md">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`processors.${index}.status`}
                        render={({ field }) => {
                          const isChecked = field.value === "enabled";
                          return (
                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Enable {processor.name}
                                </FormLabel>
                                <FormDescription>
                                  {field.value
                                    ? "Currently active and processing payments"
                                    : "Currently disabled"}
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={isChecked}
                                  disabled={isUpdateProcessorPending}
                                  onCheckedChange={(checked) => {
                                    const newStatus = checked
                                      ? "enabled"
                                      : "disabled";
                                    field.onChange(newStatus);

                                    // Get latest values from the form
                                    const allProcessors =
                                      form.getValues("processors");
                                    const processorData = allProcessors[index];

                                    const currencyIds =
                                      processorData.supported_currencies.map(
                                        (currency) => currency.id
                                      );

                                    const newUpdata = {
                                      status: newStatus,
                                      currencies: currencyIds,
                                    };

                                    handleUpdateProcessor({
                                      id: processorData.id,
                                      payload: newUpdata,
                                    });
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />

                      <div className="pt-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="text-base font-medium mb-3">
                              Supported Currencies
                            </h5>
                            <div className="flex items-start mb-3">
                              <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                              <p className="text-sm text-gray-600">
                                Select the currencies this processor will
                                support for transactions.
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            disabled={isUpdateProcessorPending}
                            className="gap-2"
                            onClick={() => {
                              const newUpdata = {
                                status: checkedProcessorStatus,
                                currencies: checkedProcessorCurrencies,
                              };

                              handleUpdateProcessor({
                                id: checkedProcessorId,
                                payload: newUpdata,
                              });
                            }}
                          >
                            {isUpdateProcessorPending ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>Save Changes</>
                            )}
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* map through the curremcy list and check only those whose id match the supported currencies */}
                          {currencyList?.map((currency, currencyIndex) => {
                            return (
                              <FormField
                                key={currency.code}
                                control={form.control}
                                name={`processors.${index}.supported_currencies.${currencyIndex}.enabled`}
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-3 rounded-md border p-3">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(checked) => {
                                          field.onChange(checked);

                                          const currentValues =
                                            form.getValues();
                                          const selectedProcessor =
                                            currentValues.processors[index];
                                          const checkedCurrencies =
                                            selectedProcessor.supported_currencies
                                              .filter((cur) => cur.enabled)
                                              .map((cur) => cur.id as string);

                                          // console.log(
                                          //   `Processor: ${selectedProcessor.id} with status ${selectedProcessor.status}, Checked:`,
                                          //   checkedCurrencies
                                          // );

                                          setCheckedProcessorId(
                                            selectedProcessor.id
                                          );
                                          setCheckedProcessorStatus(
                                            selectedProcessor.status
                                          );

                                          setCheckedProcessorCurrencies(
                                            checkedCurrencies
                                          );
                                        }}
                                      />
                                    </FormControl>
                                    <div className="flex items-center space-x-2">
                                      <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                                        {currency.code?.substring(0, 1)}
                                      </div>
                                      <FormLabel className="font-normal text-sm">
                                        {currency.name}
                                      </FormLabel>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            );
                          })}
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
                <h4 className="text-sm font-medium text-blue-800">
                  Payment Processor Information
                </h4>
                <p className="text-sm text-blue-600 mt-1">
                  Configure your payment processors to enable transactions in
                  multiple currencies. Each processor requires unique API
                  credentials which you can obtain from their developer portals.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        {/* <CardFooter className="flex justify-between px-6 py-4 border-t">
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
        </CardFooter> */}
      </form>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset processor configuration?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all settings for this processor, including API
              keys and currency configurations. This action cannot be undone.
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
