import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronDown,
  ChevronUp,
  Building,
  CheckCircle,
  PlusCircle,
  Settings,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { savePaymentChannels } from "@/services/api";
import { motion } from "framer-motion";
// @ts-ignore
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
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
  PaymentChannelSettings,
  Processor,
  TransactionChannelsProps,
} from "@/types";
import { useFetchPaymentProcessors } from "@/hooks/usePayments";
import {
  useCreateTransactionChannel,
  useFetchTransactionChannels,
  useUpdateTransactionChannel,
} from "@/hooks/useTransaction";
// @ts-ignore
import { channel } from "diagnostics_channel";

// Currency options
//@ts-ignore
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

// Currency schema
const currencySchema = z.object({
  code: z.string(),
  name: z.string(),
  enabled: z.boolean().default(false),
});

// Processor for a channel schema
const processorForChannelSchema = z.object({
  id: z.string(),
  name: z.string(),
  enabled: z.boolean().default(false),
  apiKey: z.string().optional(),
  secretKey: z.string().optional(),
  webhookUrl: z.string().optional(),
  testMode: z.boolean().default(true),
  supported_currencies: z.array(currencySchema),
});

// Channel schema
const channelSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["enabled", "disabled"]),
  // enabled: z.boolean().default(true),
  processors: z.array(processorForChannelSchema),
});

// Form schema
const formSchema = z.object({
  channels: z.array(channelSchema),
});

// Form values type
type FormValues = {
  channels: Array<{
    id: string;
    name: string;
    status: "enabled" | "disabled";
    supported_currencies: Processor[];
  }>;
};

interface Props {
  data: TransactionChannelsProps[];
}

export default function PaymentChannelsForm({ data }: Props) {
  const { data: processors } = useFetchPaymentProcessors();

  // console.log("processors:", processors);
  // Payment processor configurations
  const processorConfigs: TransactionChannelsProps[] = data; // check this again when the server is up

  const { data: channels } = useFetchTransactionChannels();
  // console.log("Transaction Channels:", channels);

  // @ts-ignore
  const [isLoading, setIsLoading] = useState(false);
  const [expandedChannels, setExpandedChannels] = useState<string[]>([
    "bank_transfer",
    "mobile_money",
  ]);
  const [newChannelDialogOpen, setNewChannelDialogOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  // @ts-ignore
  const [newChannelId, setNewChannelId] = useState("");
  // @ts-ignore
  const [selectedProcessors, setSelectedProcessors] = useState<
    Record<string, boolean>
  >({});
  // @ts-ignore
  const [selectedCurrencies, setSelectedCurrencies] = useState<
    Record<string, boolean>
  >({});
  const { toast } = useToast();

  // Initialize form with channels and their processors (with currencies nested under processors)
  // const defaultValues: FormValues = {
  //   channels: (channels || []).map((channel) => ({
  //     id: channel.id,
  //     name: channel.name,
  //     status: channel.status,
  //     processors: channel.processor
  //       ? [
  //           {
  //             id: channel.processor.id,
  //             name: channel.processor.name,
  //             status: channel.processor.status,
  //             enabled: channel.processor.status === "enabled",
  //             supported_currencies: channel.processor.supported_currencies.map(
  //               (currency: any) => ({
  //                 code: currency.code,
  //                 name: currency.name,
  //                 enabled: currency.code === "NGN",
  //               })
  //             ),
  //           },
  //         ]
  //       : [],
  //   })),
  // };

  const defaultValues: FormValues = {
    // @ts-ignore
    channels: channels
      ? channels.map((channel) => {
          return {
            id: channel.id,
            name: channel.name,
            status: channel.status,
            processors: (processors || []).map((p) => {
              // @ts-ignore
              const isAssigned = channel.processor?.id === p.id;

              return {
                id: p.id,
                name: p.name,
                status: p.status,
                enabled: isAssigned,
                supported_currencies: isAssigned
                  ? p.supported_currencies.map((currency: any) => ({
                      code: currency.code,
                      name: currency.name,
                      enabled: currency.code === "NGN",
                    }))
                  : [],
              };
            }),
          };
        })
      : [],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "channels",
  });

  const mutation = useMutation({
    mutationFn: savePaymentChannels,
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description:
          "Your payment channel settings have been updated successfully",
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

  // @ts-ignore
  function onSubmit(data: FormValues) {
    setIsLoading(true);
    console.log("submitted");

    // Convert the form data to the expected PaymentChannelSettings format
    const paymentChannelSettings: PaymentChannelSettings = {
      processors: processorConfigs.map((processor) => {
        const processorsInChannels = data.channels
          .map((channel) =>
            // @ts-ignore
            channel.processors.find((p) => p.id === processor.id)
          )
          .filter(Boolean) as any[];

        const enabledChannels = data.channels
          .filter((channel) =>
            // @ts-ignore
            channel.processors.some((p) => p.id === processor.id && p.enabled)
          )
          .map((channel) => ({
            id: channel.id,
            name: channel.name,
            enabled: true,
          }));

        // Get a union of all currencies from all processor instances
        const enabledCurrencies = Array.from(
          new Set(
            processorsInChannels.flatMap((p) =>
              p.currencies
                .filter((currency: any) => currency.enabled)
                .map((currency: any) => ({
                  code: currency.code,
                  name: currency.name,
                  enabled: true,
                }))
            )
          )
        );

        // Use the first processor config found for API keys, etc.
        const processConfig = processorsInChannels[0] || {
          apiKey: "",
          secretKey: "",
          webhookUrl: "",
          testMode: true,
        };

        return {
          id: processor.id,
          name: processor.name,
          enabled: enabledChannels.length > 0,
          apiKey: processConfig.apiKey,
          secretKey: processConfig.secretKey,
          webhookUrl: processConfig.webhookUrl,
          testMode: processConfig.testMode,
          channels: enabledChannels,
          currencies: enabledCurrencies,
        };
      }),
    };

    mutation.mutate(paymentChannelSettings);
  }

  const toggleChannel = (channelId: string) => {
    if (expandedChannels.includes(channelId)) {
      setExpandedChannels(expandedChannels.filter((id) => id !== channelId));
    } else {
      setExpandedChannels([...expandedChannels, channelId]);
    }
  };

  // @ts-ignore
  const { append } = useFieldArray({
    control: form.control,
    name: "channels",
  });

  // @ts-ignore
  const handleToggleProcessor = (processorId: string) => {
    setSelectedProcessors((prev) => ({
      ...prev,
      [processorId]: !prev[processorId],
    }));
  };

  // @ts-ignore
  const handleToggleCurrency = (currencyCode: string) => {
    setSelectedCurrencies((prev) => ({
      ...prev,
      [currencyCode]: !prev[currencyCode],
    }));
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setNewChannelName("");
      setNewChannelId("");
      setSelectedProcessors({});
      setSelectedCurrencies({});
    }
    setNewChannelDialogOpen(open);
  };

  // const handleAddNewChannel = () => {
  //   const id =
  //     newChannelId || newChannelName.toLowerCase().replace(/\s+/g, "_");

  //   append({
  //     id,
  //     name: newChannelName,
  //     enabled: true,
  //     processors: processorConfigs.map((processor) => ({
  //       id: processor.id,
  //       name: processor.name,
  //       enabled: !!selectedProcessors[processor.id],
  //       apiKey: "",
  //       secretKey: "",
  //       webhookUrl: "",
  //       testMode: true,
  //       currencies: currencies.map((currency) => ({
  //         code: currency.value,
  //         name: currency.label,
  //         enabled: !!selectedCurrencies[currency.value],
  //       })),
  //     })),
  //   });

  //   setExpandedChannels([...expandedChannels, id]);

  //   setNewChannelName("");
  //   setNewChannelId("");
  //   setSelectedProcessors({});
  //   setSelectedCurrencies({});
  //   setNewChannelDialogOpen(false);

  //   toast({
  //     title: "Channel added",
  //     description: `${newChannelName} payment channel has been added successfully.`,
  //   });
  // };

  const onSubmit2 = (formData: FormValues) => {
    console.log("submitted!");

    const transformed = formData.channels.map((channel) => {
      // @ts-ignore
      const enabledProcessors = channel.processors.filter((p) => p.enabled);

      return {
        id: channel.id,
        name: channel.name,
        status: channel.status,
        processors:
          channel.status === "enabled"
            ? // @ts-ignore
              enabledProcessors.map((processor) => ({
                id: processor.id,
                name: processor.name,
                status: "enabled",
                enabled: true,
              }))
            : // @ts-ignore
            channel.processors.length > 0
            ? [
                {
                  // @ts-ignore
                  id: channel.processors[0].id,
                  // @ts-ignore
                  name: channel.processors[0].name,
                  status: "disabled",
                  enabled: false,
                },
              ]
            : [],
      };
    });

    console.log("Submitted data:", transformed);
  };

  const { mutate: updateTrxnChannel, isPending: isUpdatingTrxnChannel } =
    useUpdateTransactionChannel();
  const { mutate: createTrxnChannel, isPending: isCreatingTrxnChannel } =
    useCreateTransactionChannel();

  const handleAddNewChannel = () => {
    createTrxnChannel(
      { channel: newChannelName },
      {
        // @ts-ignore
        onSuccess: (response: any) => {
          console.log(response);

          toast({
            title: "Transaction Channel Created",
            description: `${newChannelName} has been created successfully!`,
          });
          setNewChannelName("");
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error?.response?.data?.message || "Failed to create channel",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleUpdateFn = ({ id, payload }: { id: string; payload: any }) => {
    updateTrxnChannel(
      { id: id, payload },
      {
        // @ts-ignore
        onSuccess: (response: any) => {
          console.log(response);

          toast({
            title: "Transaction Channel Updated",
            description: `Channel has been updated successfully!`,
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error?.response?.data?.message || "Failed to update channel",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit2)}>
        <CardContent className="space-y-8 px-6 py-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium text-gray-900">
                  Manage Payment Channels
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Configure payment channels (Bank Transfer, Deposit, Swap, Withdrawal, Mobile Money Transafer)
                  and assign currencies to each processor.
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

            <div className="flex justify-end">
              <Dialog
                open={newChannelDialogOpen}
                onOpenChange={handleDialogOpenChange}
              >
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <PlusCircle className="h-4 w-4" />
                    Add New Channel
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Payment Channel</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new payment channel. After
                      adding, you can configure its processors and currencies.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    <div className="space-y-3">
                      <Label
                        htmlFor="channel-name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Channel Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="channel-name"
                        placeholder="e.g. Card Payment, USSD"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500">
                        Enter the name of the payment channel as it should
                        appear in the dashboard.
                      </p>
                    </div>

                    {/* <div className="space-y-3">
                      <Label
                        htmlFor="channel-id"
                        className="text-sm font-medium text-gray-700"
                      >
                        Channel ID
                      </Label>
                      <Input
                        id="channel-id"
                        placeholder="e.g. card_payment, ussd"
                        value={newChannelId}
                        onChange={(e) => setNewChannelId(e.target.value)}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500">
                        Optional. A unique identifier for the channel. If left
                        blank, it will be generated from the name.
                      </p>
                    </div> */}

                    {/* <div className="space-y-3 pt-2 border-t border-gray-100">
                      <Label className="text-sm font-medium text-gray-700">
                        Supported Payment Processors
                      </Label>
                      <div className="grid gap-2">
                        {processorConfigs.map((processor) => (
                          <div
                            key={processor.id}
                            className="flex items-center space-x-2 rounded-md border p-3"
                          >
                            <Checkbox
                              id={`processor-${processor.id}`}
                              checked={!!selectedProcessors[processor.id]}
                              onCheckedChange={() =>
                                handleToggleProcessor(processor.id)
                              }
                            />
                            <div className="flex items-center space-x-2">
                              {processor.icon && (
                                <processor.icon className="h-4 w-4 text-blue-500" />
                              )}
                              <Label
                                htmlFor={`processor-${processor.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {processor.name}
                              </Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div> */}

                    {/* <div className="space-y-3 pt-2 border-t border-gray-100">
                      <Label className="text-sm font-medium text-gray-700">
                        Supported Currencies
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {currencies.map((currency) => (
                          <div
                            key={currency.value}
                            className="flex items-center space-x-2 rounded-md border p-3"
                          >
                            <Checkbox
                              id={`currency-${currency.value}`}
                              checked={!!selectedCurrencies[currency.value]}
                              onCheckedChange={() =>
                                handleToggleCurrency(currency.value)
                              }
                            />
                            <div className="flex items-center space-x-2">
                              <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                                {currency.value}
                              </div>
                              <Label
                                htmlFor={`currency-${currency.value}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {currency.label.split(" ")[0]}
                              </Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div> */}
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleDialogOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAddNewChannel}
                      disabled={!newChannelName || isCreatingTrxnChannel}
                    >
                      {isCreatingTrxnChannel
                        ? "Adding Channel..."
                        : "Add Channel"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-6">
            {fields.map((channelField, channelIndex) => {
              // const channelConfig = channels?.find(
              //   (c) => c.id === channelField.id
              // );
              // const Icon = channelConfig?.icon || Building;
              const Icon = Building;
              const isEnabled =
                form.watch(`channels.${channelIndex}.status`) === "enabled";
              const isExpanded = expandedChannels.includes(channelField.id);

              return (
                <Card
                  key={channelField.id}
                  className={`border overflow-hidden transition-all ${
                    isEnabled ? "border-gray-200" : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <div
                    className={`flex items-center justify-between px-6 py-4 cursor-pointer ${
                      !isEnabled ? "opacity-60" : ""
                    }`}
                    onClick={() => toggleChannel(channelField.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-md ${
                          isEnabled ? "bg-blue-50" : "bg-gray-100"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            isEnabled ? "text-blue-500" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="text-base font-medium capitalize">
                          {channelField.name
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Payment channel configuration
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <FormField
                        control={form.control}
                        name={`channels.${channelIndex}.status`}
                        render={({ field }) => {
                          const isChecked = field.value === "enabled";

                          return (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Switch
                                  checked={isChecked}
                                  disabled={isUpdatingTrxnChannel}
                                  onCheckedChange={(checked) => {
                                    const newStatus = checked
                                      ? "enabled"
                                      : "disabled";
                                    field.onChange(newStatus);

                                    if (checked && !isExpanded) {
                                      toggleChannel(channelField.id);
                                    }

                                    const channel =
                                      form.getValues().channels[channelIndex];
                                    const enabledProcessor =
                                      // @ts-ignore
                                      channel.processors.find((p) => p.enabled);
                                    const fallbackProcessor =
                                      // @ts-ignore
                                      channel.processors[0];

                                    handleUpdateFn({
                                      id: channel.id,
                                      payload: {
                                        status: channel.status,
                                        processor:
                                          enabledProcessor?.id ??
                                          fallbackProcessor?.id,
                                      },
                                    });
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal text-gray-500">
                                {isChecked ? "Active" : "Inactive"}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />

                      <div className="flex items-center justify-center w-6 h-6">
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? "auto" : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 border-t border-gray-100">
                      <div className="grid gap-6">
                        <div className="grid md:grid-cols-1 gap-8">
                          <div className="space-y-4">
                            <Label className="text-sm font-medium text-gray-700">
                              Payment Processors (Only one can be active at a
                              time)
                            </Label>
                            <div className="space-y-6">
                              {form
                                // @ts-ignore
                                .watch(`channels.${channelIndex}.processors`)
                                ?.map((processor: any, processorIndex) => {
                                  return (
                                    <div
                                      key={processor.id}
                                      className="space-y-3"
                                    >
                                      <FormField
                                        control={form.control}
                                        //@ts-ignore
                                        name={`channels.${channelIndex}.processors.${processorIndex}.enabled`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <div className="flex items-center justify-between space-x-2 rounded-md border p-3">
                                              <div className="flex items-center space-x-3">
                                                <FormControl>
                                                  <Checkbox
                                                    // @ts-ignore
                                                    checked={field.value}
                                                    onCheckedChange={(
                                                      checked
                                                    ) => {
                                                      const isChecked =
                                                        Boolean(checked);

                                                      const processors =
                                                        form.watch(
                                                          // @ts-ignore
                                                          `channels.${channelIndex}.processors`
                                                        );

                                                      // Update processor states
                                                      processors.forEach(
                                                        (_, idx) => {
                                                          form.setValue(
                                                            // @ts-ignore
                                                            `channels.${channelIndex}.processors.${idx}.enabled`,
                                                            idx ===
                                                              processorIndex
                                                              ? isChecked
                                                              : false
                                                          );
                                                        }
                                                      );

                                                      field.onChange(isChecked);

                                                      const channel =
                                                        form.getValues()
                                                          .channels[
                                                          channelIndex
                                                        ];
                                                      const selectedProcessor =
                                                        // @ts-ignore
                                                        channel.processors[
                                                          processorIndex
                                                        ];

                                                      handleUpdateFn({
                                                        id: channel.id,
                                                        payload: {
                                                          status:
                                                            channel.status,
                                                          processor:
                                                            selectedProcessor.id,
                                                        },
                                                      });

                                                      const updatedFormValues =
                                                        form.getValues();
                                                      console.log(
                                                        "Updated form values:",
                                                        updatedFormValues
                                                      );
                                                    }}
                                                  />
                                                </FormControl>
                                                <FormLabel className="text-sm font-medium capitalize">
                                                  {processor.name}
                                                </FormLabel>
                                              </div>

                                              {field.value && (
                                                <span className="text-xs text-blue-500 flex items-center font-medium">
                                                  <Settings className="h-3 w-3 mr-1" />
                                                  Processor Settings
                                                </span>
                                              )}
                                            </div>
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Card>
              );
            })}
          </div>
        </CardContent>
        {/* <CardFooter className="px-6 py-4 border-t border-gray-100 flex justify-between">
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
        </CardFooter> */}
      </form>
    </Form>
  );
}
