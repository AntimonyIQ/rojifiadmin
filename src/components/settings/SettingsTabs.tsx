import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
// @ts-ignore
import GeneralSettingsForm from "./GeneralSettingsForm";
// @ts-ignore
import TransactionConfigForm from "./TransactionConfigForm";
// @ts-ignore
import FeeConfigForm from "./FeeConfigForm";
import PaymentChannelsForm from "./PaymentChannelsForm";
import ConfigureCurrencyForm from "./ConfigureCurrencyForm";
import PaymentProcessorsForm from "./PaymentProcessorsForm";
import ExchangeRatesForm from "./ExchangeRatesForm";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useFetchPaymentProcessors } from "@/hooks/usePayments";
import { useFetchTransactionChannels } from "@/hooks/useTransaction";
import {
  useFetchAdminCurrencies,
  useFetchExchangeRates,
} from "@/hooks/useCurrency";
import TestFeeConfig from "./TestFeeConfig";
import { Skeleton } from "../ui/skeleton";
import { useFetchFeeConfig } from "@/hooks/useFeeConfig";

interface SettingsTabsProps {
  defaultTab?: string;
}

export default function SettingsTabs({
  defaultTab = "payment-channels",
}: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  // @ts-ignore
  const [location, navigate] = useLocation();

  // processor channels
  // const { data: processors, isLoading: isProcessorLoading } =
  //   useFetchPaymentProcessors();
  const { data: transactionChannels, isLoading: isTransactionChannelLoading } =
    useFetchTransactionChannels();
  const { data: processors, isLoading: isProcessorsLoading } =
    useFetchPaymentProcessors();
  const { data: currencies, isLoading:isCurrencyLoading } = useFetchAdminCurrencies();
  const { data: exchangeRates, isLoading: isExchangeRateLoading } = useFetchExchangeRates();
  const { data: feeConfig, isLoading: isFetchingConfig } = useFetchFeeConfig();

  // Update URL when tab changes
  useEffect(() => {
    navigate(`/settings?tab=${activeTab}`, { replace: true });
  }, [activeTab, navigate]);

  // Set active tab from URL on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (
      tabParam &&
      [
        "payment-channels",
        "manage-processors",
        "transactions",
        "fees",
        "configure-currency",
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, []);

  return (
    <Card className="border border-gray-100 shadow-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 max-w-4xl mx-auto my-4">
          <TabsTrigger value="payment-channels">Payment Channels</TabsTrigger>
          <TabsTrigger value="configure-currency">
            Configure Currency
          </TabsTrigger>
          <TabsTrigger value="manage-processors">Manage Processors</TabsTrigger>
          <TabsTrigger value="transactions">Manage Rates</TabsTrigger>
          {/* <TabsTrigger value="fees">Fee Configuration</TabsTrigger> */}
          <TabsTrigger value="fees">Fee Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="payment-channels">
          {isTransactionChannelLoading && isProcessorsLoading && (
            <Card>
              <CardContent className="space-y-8 px-6 py-6">
                {/* Header Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-6 w-32 rounded-md" />
                  </div>

                  {/* Button */}
                  <div className="flex justify-end">
                    <Skeleton className="h-10 w-40 rounded-md" />
                  </div>

                  {/* Channel Card Skeleton */}
                  <Card className="border overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        {/* Icon */}
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-60" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                  </Card>
                  <Card className="border overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        {/* Icon */}
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-60" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}
          {transactionChannels && processors && (
            <PaymentChannelsForm data={transactionChannels} />
          )}
        </TabsContent>

        <TabsContent value="configure-currency">
          {isCurrencyLoading && (
            <Card>
              <CardContent className="space-y-8 px-6 py-6">
                {/* Header Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-6 w-32 rounded-md" />
                  </div>

                  {/* Button */}
                  <div className="flex justify-end">
                    <Skeleton className="h-10 w-40 rounded-md" />
                  </div>

                  {/* Channel Card Skeleton */}
                  <Card className="border overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        {/* Icon */}
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-60" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                  </Card>
                  <Card className="border overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        {/* Icon */}
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-60" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}
          {currencies && <ConfigureCurrencyForm data={currencies} />}
        </TabsContent>

        <TabsContent value="manage-processors">
          {processors && <PaymentProcessorsForm data={processors} />}
        </TabsContent>

        <TabsContent value="transactions">
          {isExchangeRateLoading && (
            <Card>
              <CardContent className="space-y-8 px-6 py-6">
                {/* Header Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-6 w-32 rounded-md" />
                  </div>

                  {/* Button */}
                  <div className="flex justify-end">
                    <Skeleton className="h-10 w-40 rounded-md" />
                  </div>

                  {/* Channel Card Skeleton */}
                  <Card className="border overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        {/* Icon */}
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-60" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                  </Card>
                  <Card className="border overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        {/* Icon */}
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-60" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}
          {exchangeRates && <ExchangeRatesForm data={exchangeRates} />}
        </TabsContent>

        {/* <TabsContent value="fees">
          <FeeConfigForm />
        </TabsContent> */}

        <TabsContent value="fees">
          {isFetchingConfig && (
            <CardContent className="space-y-8 px-6 py-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-80" />
                  </div>
                  <Skeleton className="h-6 w-28 rounded-full" />
                </div>

                <div className="flex justify-end">
                  <Skeleton className="h-10 w-40 rounded-md" />
                </div>

                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="border border-gray-100 bg-gray-50 rounded-lg overflow-hidden transition-all"
                  >
                    <div className="flex items-center justify-between px-6 py-4 opacity-60">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-10 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
          {feeConfig && <TestFeeConfig />}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
