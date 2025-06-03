import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useFetchAdminCurrencies } from "@/hooks/useCurrency";
import {
  useCreateFeeConfig,
  useFetchFeeConfig,
  useUpdateFeeConfig,
} from "@/hooks/useFeeConfig";
import { useFetchTransactionChannels } from "@/hooks/useTransaction";
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_FEE_CONFIG = {
  type: "percentage_max",
  config: {
    feeAmount: 0,
    maximumFee: 0,
    minimumFee: 0,
    percentage: 0,
    ranges: [],
  },
};

const FEE_CONFIG_TYPES = [
  "percentage_max",
  "percentage_min_max",
  "flat_fee",
  "flat_fee_and_percentage",
  "range",
  "percentage_min",
];

const TestFeeConfig = () => {
  const { data: feeConfig } = useFetchFeeConfig();
  const { data: transactionChannels } = useFetchTransactionChannels();
  const { data: currencies } = useFetchAdminCurrencies();

  const [formData, setFormData] = useState({
    name: "",
    type: "percentage_min_max",
    config: {
      percentage: 0.02,
      feeAmount: 5,
      minimumFee: 10,
      maximumFee: 100,
    },
    tx_channel: "",
    currency: "",
  });

  // const handleChange = (key: any, value: any) => {
  //   setFormData((prev) => ({ ...prev, [key]: value }));
  // };

  // @ts-ignore
  const handleConfigChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value,
      },
    }));
  };

  // @ts-ignore
  const buildConfig = () => {
    switch (formData.type) {
      case "percentage_max":
        return {
          percentage: formData.config.percentage,
          maximumFee: formData.config.maximumFee,
        };
      case "percentage_min":
        return {
          percentage: formData.config.percentage,
          minimumFee: formData.config.minimumFee,
        };
      case "percentage_min_max":
        return {
          percentage: formData.config.percentage,
          minimumFee: formData.config.minimumFee,
          maximumFee: formData.config.maximumFee,
          feeAmount: formData.config.feeAmount,
        };
      case "flat_fee":
        return {
          fixedAmount: formData.config.feeAmount,
        };
      case "flat_fee_and_percentage":
        return {
          feeAmount: formData.config.feeAmount,
          percentage: formData.config.percentage,
        };
      case "range":
        return [];
      default:
        return {};
    }
  };

  // const handleSubmit = () => {
  //   console.log({
  //     name: `${formData.currency} transfer fee config`,
  //     type: formData.type,
  //     config: buildConfig(),
  //     tx_channel: formData.tx_channel,
  //     currency: formData.currency,
  //   });
  //   console.log(JSON.stringify(formData, null, 2));
  // };

  const TRANSACTIONCHANNEL = useMemo(() => {
    return transactionChannels?.map(({ id, name }) => ({ id, name })) || [];
  }, [transactionChannels]);

  const CURRENCIES = useMemo(() => {
    return (
      currencies?.map(({ id, name, code, symbol, decimal_place }) => ({
        id,
        name,
        code,
        symbol,
        decimal_place,
      })) || []
    );
  }, [currencies]);

  const structuredData = useMemo(() => {
    if (!CURRENCIES.length || !TRANSACTIONCHANNEL.length || !feeConfig?.length)
      return [];

    return CURRENCIES.map((currency) => {
      const channels = TRANSACTIONCHANNEL.map((channel) => {
        const matchedFee = feeConfig.find(
          (fc: any) =>
            fc.currency.code === currency.code &&
            fc.tx_channel.name === channel.name
        );

        return {
          ...channel,
          config: matchedFee
            ? {
                type: matchedFee.type,
                config: matchedFee.config,
              }
            : DEFAULT_FEE_CONFIG,
        };
      });

      return {
        ...currency,
        channels,
      };
    });
  }, [CURRENCIES, TRANSACTIONCHANNEL, feeConfig]);

  const getCurrencySymbol = (code: string): string => {
    const currency = CURRENCIES.find((c) => c.code === code);
    return currency ? currency.symbol : "";
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-6 px-6 pt-4">
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

        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Click on a currency card to configure fees
            for different payment channels. Each payment channel can have its
            own fee type and configuration.
          </p>
        </div>
      </div>

      {/* add the create fee config button here with the dialog containing the form for creating a config */}
      
      {/* dialog ends here */}
      <Accordion type="multiple" className="w-full px-6">
        {structuredData.map((currency) => (
          <AccordionItem
            key={currency.id}
            value={currency.code}
            className="border my-3 rounded-[10px] px-3"
          >
            <AccordionTrigger>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-medium mr-3">
                  {getCurrencySymbol(currency.code)}
                </div>
                <div className="text-left">
                  <div className="text-md font-medium text-gray-900">
                    {currency.code}
                  </div>
                  <div className="text-sm text-gray-500">{currency.name}</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="multiple" className="pl-4 space-y-2">
                {currency.channels.map((channel) => {
                  return (
                    <ChannelFeeConfig
                      key={channel.name}
                      currency={currency}
                      channel={channel}
                    />
                  );
                })}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

const ChannelFeeConfig = ({ currency, channel }: any) => {
  const { data: feeConfig } = useFetchFeeConfig();
  const [selectedConfigType, setSelectedConfigType] = useState(
    channel.config.type
  );
  const [config, setConfig] = useState({ ...channel.config.config });
  // @ts-ignore
  const [feeConfigId, setFeeConfigId] = useState(channel.config?.id || null);
  // @ts-ignore
  const { mutate: createFeeConfig, isPending: isCreatingFeeConfig } =
    useCreateFeeConfig();
  // @ts-ignore
  const { mutate: updateFeeConfig, isPending: isUpdatingFeeConfig } =
    useUpdateFeeConfig();
  // @ts-ignore
  const [loadingChannelId, setLoadingChannelId] = useState<string | null>(null);

  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      [field]: parseFloat(value),
    }));
  };

  const handleRangeChange = (index: number, field: string, value: string) => {
    const updatedRanges = config.ranges.map((range: any, i: number) =>
      i === index ? { ...range, [field]: value } : range
    );
    setConfig((prev: any) => ({ ...prev, ranges: updatedRanges }));
  };

  const addRange = () => {
    setConfig((prev: any) => ({
      ...prev,
      ranges: [
        ...(prev.ranges || []),
        { startAmount: "", endAmount: "", feeAmount: "" },
      ],
    }));
  };

  const buildConfig = () => {
    switch (selectedConfigType) {
      case "percentage_max":
        return {
          percentage: config.percentage,
          maximumFee: config.maximumFee,
          feeAmount: config.feeAmount,
        };
      case "percentage_min":
        return {
          percentage: config.percentage,
          minimumFee: config.minimumFee,
          feeAmount: config.feeAmount,
        };
      case "percentage_min_max":
        return {
          percentage: config.percentage,
          minimumFee: config.minimumFee,
          maximumFee: config.maximumFee,
          feeAmount: config.feeAmount,
        };
      case "flat_fee":
        return {
          fixedAmount: config.feeAmount,
        };
      case "flat_fee_and_percentage":
        return {
          feeAmount: config.feeAmount,
          percentage: config.percentage,
        };
      case "range":
        return config.ranges || [];
      default:
        return {};
    }
  };

  const [configList, setConfigList] = useState([]);

  useEffect(() => {
    const simplifiedConfigs = feeConfig.map((config: any) => ({
      id: config.id,
      currencyId: config.currency?.id,
      currencyCode: config.currency?.code,
      txChannelName: config.tx_channel?.name,
      type: config.type,
    }));

    // console.log(simplifiedConfigs);

    setConfigList(simplifiedConfigs);
  }, [feeConfig]);

  const handleSave = () => {
    /* filter through the configList for the object whose currencyCode, currencyId, txChannelName 
    matches currency.code, currency.id and channel.id and log it to the console */
    const matchingConfig = configList.find(
      (config) =>
        // @ts-ignore
        config.currencyCode === currency.code &&
        // @ts-ignore
        config.currencyId === currency.id &&
        // @ts-ignore
        config.txChannelName === channel.name.replace(/\s+/g, "_")
    );

    // @ts-ignore
    let id = matchingConfig?.id ?? feeConfigId ?? null;
    let channelName = channel.name;

    const getTypeName = (type: string): string => {
      switch (type) {
        case "flat_fee":
          return "fixed";
        case "range":
          return "fixed_by_amount";
        case "flat_fee_and_percentage":
          return "percentage_all";
        case "percentage_min":
          return "percentage_min";
        case "percentage_max":
          return "percentage_max";
        case "percentage_min_max":
          return "percentage_min_max";
        default:
          return "unknown_type";
      }
    };

    const data = {
      name: `${currency.code} ${channelName} fee config`,
      type: getTypeName(selectedConfigType),
      config: buildConfig(),
      tx_channel: channel.id,
      currency: currency.id,
    };

    // console.log(data) feeAmount

    // return;

    if (id !== null) {
      setLoadingChannelId(id);
      // update
      updateFeeConfig(
        { id, data },
        {
          // @ts-ignore
          onSuccess: (response: any) => {
            // toast
            toast({
              title: "Config Edited",
              description: `Config has been edited`,
            });
            setLoadingChannelId(null);
          },
          onError: (error: any) => {
            //
            toast({
              title: "Error",
              description:
                error?.response?.data?.message || "Failed to update config",
              variant: "destructive",
            });
            setLoadingChannelId(null);
          },
        }
      );
    } else {
      // create
      createFeeConfig(data, {
        // @ts-ignore
        onSuccess: (response: any) => {
          // toast
          toast({
            title: "Config Created!",
            description: `Config has been created`,
          });
        },
        onError: (error: any) => {
          //
          toast({
            title: "Error",
            description:
              error?.response?.data?.message || "Failed to create config",
            variant: "destructive",
          });
        },
      });
    }
  };

  // useEffect(() => {
  //   const matchingFeeConfig = feeConfig.find(
  //     (config: any) =>
  //       config.currency.code === currency.code &&
  //       config.tx_channel.name === channel.name
  //   );

  //   if (matchingFeeConfig) {
  //     setFeeConfigId(matchingFeeConfig.id);
  //     console.log("Fee config ID auto-set to:", matchingFeeConfig.id);
  //   } else {
  //     setFeeConfigId(null);
  //     console.warn(
  //       "No matching fee config found for:",
  //       currency.code,
  //       channel.name
  //     );
  //   }
  // }, [channel.name, currency.code]);

  // console.log("channel id", channel);
  // console.log("channel.config", channel.config);
  // console.log("currency code", currency.code);
  // console.log("channel name", channel.name);

  return (
    <AccordionItem value={channel.name}>
      <AccordionTrigger className="capitalize">{channel.name}</AccordionTrigger>
      <AccordionContent>
        <div className="mb-4">
          <Label className="mb-2 inline-block">Config Type</Label>
          <Select
            value={selectedConfigType}
            onValueChange={(val) => setSelectedConfigType(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Fee Type" />
            </SelectTrigger>
            <SelectContent>
              {FEE_CONFIG_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {selectedConfigType === "percentage_max" && (
            <>
              <div>
                <Label>Percentage</Label>
                <Input
                  type="number"
                  value={config.percentage || 0}
                  onChange={(e) => handleChange("percentage", e.target.value)}
                />
              </div>
              <div>
                <Label>Maximum Fee</Label>
                <Input
                  type="number"
                  value={config.maximumFee || 0}
                  onChange={(e) => handleChange("maximumFee", e.target.value)}
                />
              </div>
            </>
          )}

          {selectedConfigType === "percentage_min" && (
            <>
              <div>
                <Label>Percentage</Label>
                <Input
                  type="number"
                  value={config.percentage || 0}
                  onChange={(e) => handleChange("percentage", e.target.value)}
                />
              </div>
              <div>
                <Label>Minimum Fee</Label>
                <Input
                  type="number"
                  value={config.minimumFee || 0}
                  onChange={(e) => handleChange("minimumFee", e.target.value)}
                />
              </div>
            </>
          )}

          {selectedConfigType === "percentage_min_max" && (
            <>
              <div>
                <Label>Percentage</Label>
                <Input
                  type="number"
                  value={config.percentage || 0}
                  onChange={(e) => handleChange("percentage", e.target.value)}
                />
              </div>
              <div>
                <Label>Minimum Fee</Label>
                <Input
                  type="number"
                  value={config.minimumFee || 0}
                  onChange={(e) => handleChange("minimumFee", e.target.value)}
                />
              </div>
              <div>
                <Label>Maximum Fee</Label>
                <Input
                  type="number"
                  value={config.maximumFee || 0}
                  onChange={(e) => handleChange("maximumFee", e.target.value)}
                />
              </div>
              <div>
                <Label>Fee Amount</Label>
                <Input
                  type="number"
                  value={config.feeAmount || 0}
                  onChange={(e) => handleChange("feeAmount", e.target.value)}
                />
              </div>
            </>
          )}

          {selectedConfigType === "flat_fee" && (
            <div>
              <Label>Flat Fee</Label>
              <Input
                type="number"
                value={config.feeAmount || 0}
                onChange={(e) => handleChange("feeAmount", e.target.value)}
              />
            </div>
          )}

          {selectedConfigType === "flat_fee_and_percentage" && (
            <>
              <div>
                <Label>Flat Fee</Label>
                <Input
                  type="number"
                  value={config.feeAmount || 0}
                  onChange={(e) => handleChange("feeAmount", e.target.value)}
                />
              </div>
              <div>
                <Label>Percentage</Label>
                <Input
                  type="number"
                  value={config.percentage || 0}
                  onChange={(e) => handleChange("percentage", e.target.value)}
                />
              </div>
            </>
          )}

          {selectedConfigType === "range" && (
            <div className="col-span-2 space-y-4">
              {(config.ranges || []).map((range: any, index: number) => (
                <div key={index} className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Start Amount</Label>
                    <Input
                      type="number"
                      value={range.startAmount}
                      onChange={(e) =>
                        handleRangeChange(index, "startAmount", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>End Amount</Label>
                    <Input
                      type="number"
                      value={range.endAmount}
                      onChange={(e) =>
                        handleRangeChange(index, "endAmount", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>Fee Amount</Label>
                    <Input
                      type="number"
                      value={range.feeAmount}
                      onChange={(e) =>
                        handleRangeChange(index, "feeAmount", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
              <Button onClick={addRange}>Add Range</Button>
            </div>
          )}
        </div>

        <div className="mt-4 w-fit ml-auto">
          <Button
            onClick={handleSave}
            disabled={loadingChannelId !== null || isCreatingFeeConfig}
            className="disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loadingChannelId !== null || isCreatingFeeConfig
              ? "Saving..."
              : "Save"}
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default TestFeeConfig;
