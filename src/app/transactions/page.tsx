import { motion } from "framer-motion";
import TransactionsTable from "@/components/transactions/TransactionsTable";
// @ts-ignore
import { useQuery } from "@tanstack/react-query";
// @ts-ignore
import { fetchTransactions } from "@/services/api";
import { LoadingPage } from "@/components/ui/loading-spinner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  // @ts-ignore
  LockIcon,
} from "lucide-react";
// @ts-ignore
import { formatCurrency } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import { useFetchTransactions } from "@/hooks/useTransaction";
import { useFetchWalletOverview } from "@/hooks/useStaff";

// Mock wallet data - in a real app, this would come from an API
 // @ts-ignore
const walletData = {
  totalBalance: 1250430.75,
  totalDeposits: 2156742.5,
  totalWithdrawals: 958416.25,
  lockedFunds: 89600.0,
  currencies: [
    { code: "NGN", balance: 12500000.0, symbol: "₦" },
    { code: "USD", balance: 35250.45, symbol: "$" },
    { code: "EUR", balance: 28600.75, symbol: "€" },
    { code: "GBP", balance: 18750.9, symbol: "£" },
    { code: "KES", balance: 458900.0, symbol: "KSh" },
  ],
};

export default function TransactionsPage() {
  // @ts-ignore
  const { data: transactions, isLoading } = useFetchTransactions();
  const { data: walletOverview } = useFetchWalletOverview();


  // Initialize the embla carousel
  // @ts-ignore
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
  });

  // Controls for the carousel
  // @ts-ignore
  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  // @ts-ignore
  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  if (isLoading && !transactions) {
    return <LoadingPage />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Wallet Overview Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Wallet Overview
          </CardTitle>
          <CardDescription>
            Summary of wallet balances and transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Balance
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {walletOverview?.total_balance}
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary-50 rounded-full flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Credit
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {walletOverview?.total_deposit}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                  <ArrowDownToLine className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Debit
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {walletOverview?.total_withdraw}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <ArrowUpFromLine className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Locked Funds
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(walletData.lockedFunds)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-50 rounded-full flex items-center justify-center">
                  <LockIcon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div> */}
          </div>
        </CardContent>
      </Card>

      {/* Currency Balances Card */}
      {/* <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Currency Balances
              </CardTitle>
              <CardDescription>Available funds by currency</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={scrollPrev}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous slide</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={scrollNext}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next slide</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="embla" ref={emblaRef}>
            <div className="embla__container">
              {walletData.currencies.map((currency) => (
                <div
                  key={currency.code}
                  className="embla__slide px-4"
                  style={{ flex: "0 0 220px" }}
                >
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm h-full hover:shadow-md transition-shadow">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center font-bold text-xl">
                        {currency.symbol}
                      </div>
                      <p className="text-sm font-medium text-gray-500">
                        {currency.code}
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {currency.symbol}
                        {currency.balance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Transactions Table */}
      <TransactionsTable
        transactions={transactions?.transactions || []}
        loading={isLoading}
      />
    </motion.div>
  );
}
