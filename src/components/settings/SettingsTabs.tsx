import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import GeneralSettingsForm from "./GeneralSettingsForm";
import TransactionConfigForm from "./TransactionConfigForm";
import FeeConfigForm from "./FeeConfigForm";
import PaymentChannelsForm from "./PaymentChannelsForm";
import ConfigureCurrencyForm from "./ConfigureCurrencyForm";
import PaymentProcessorsForm from "./PaymentProcessorsForm";
import ExchangeRatesForm from "./ExchangeRatesForm";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface SettingsTabsProps {
  defaultTab?: string;
}

export default function SettingsTabs({ defaultTab = "payment-channels" }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [location, navigate] = useLocation();

  // Update URL when tab changes
  useEffect(() => {
    navigate(`/settings?tab=${activeTab}`, { replace: true });
  }, [activeTab, navigate]);

  // Set active tab from URL on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam && ["payment-channels", "manage-processors", "transactions", "fees", "configure-currency"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  return (
    <Card className="border border-gray-100 shadow-sm">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 max-w-4xl mx-auto my-4">
          <TabsTrigger value="payment-channels">Payment Channels</TabsTrigger>
          <TabsTrigger value="configure-currency">Configure Currency</TabsTrigger>
          <TabsTrigger value="manage-processors">Manage Processors</TabsTrigger>
          <TabsTrigger value="transactions">Manage Rates</TabsTrigger>
          <TabsTrigger value="fees">Fee Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payment-channels">
          <PaymentChannelsForm />
        </TabsContent>
        
        <TabsContent value="configure-currency">
          <ConfigureCurrencyForm />
        </TabsContent>
        
        <TabsContent value="manage-processors">
          <PaymentProcessorsForm />
        </TabsContent>
        
        <TabsContent value="transactions">
          <ExchangeRatesForm />
        </TabsContent>
        
        <TabsContent value="fees">
          <FeeConfigForm />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
