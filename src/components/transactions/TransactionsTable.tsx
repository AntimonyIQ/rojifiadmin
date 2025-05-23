import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Check,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionDetailsDialog from "./TransactionDetailsDialog";
import { Transaction } from "@/types";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface TransactionsTableProps {
  transactions?: Transaction[];
  loading?: boolean;
}

export default function TransactionsTable({
  transactions = [],
  loading = false,
}: TransactionsTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [amountFilter, setAmountFilter] = useState<string>("");
  const [currencyFilter, setCurrencyFilter] = useState<string>("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const itemsPerPage = 10;

  // Available currencies
  const currencies = ["NGN", "USD", "EUR", "GBP", "KES", "GHS"];

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    const matchesSearch =
      search === "" ||
      transaction.id.toString().includes(search) ||
      transaction.user.fullname.toLowerCase().includes(search.toLowerCase()) ||
      transaction.user.email.toLowerCase().includes(search.toLowerCase()) ||
      transaction.status.toLowerCase().includes(search.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "" ||
      transaction.status.toLowerCase() === statusFilter.toLowerCase();

    // Amount filter
    let matchesAmount = true;
    if (amountFilter === "lt1000") {
      matchesAmount = parseFloat(transaction.amount) < 1000;
    } else if (amountFilter === "1000-5000") {
      matchesAmount =
        parseFloat(transaction.amount) >= 1000 &&
        parseFloat(transaction.amount) <= 5000;
    } else if (amountFilter === "gt5000") {
      matchesAmount = parseFloat(transaction.amount) > 5000;
    }

    // Currency filter
    const matchesCurrency =
      currencyFilter === "" ||
      (transaction.currency.code &&
        transaction.currency.code.includes(currencyFilter));

    // Date filter
    const matchesDate =
      !date ||
      !date.from ||
      (new Date(transaction.created_at) >= date.from &&
        (!date.to || new Date(transaction.created_at) <= date.to));

    return (
      matchesSearch &&
      matchesStatus &&
      matchesAmount &&
      matchesDate &&
      matchesCurrency
    );
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handleOpenDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailsOpen(true);
  };

  const handleResetFilters = () => {
    setDate(undefined);
    setStatusFilter("");
    setAmountFilter("");
    setCurrencyFilter("");
    setFiltersOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-green-100 text-green-700",
      "bg-blue-100 text-blue-700",
      "bg-purple-100 text-purple-700",
      "bg-indigo-100 text-indigo-700",
      "bg-pink-100 text-pink-700",
    ];

    // Simple hash function to get consistent color for a name
    const hash = name.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    return colors[hash % colors.length];
  };

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-4 w-10" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-10" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-10" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="ml-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32 mt-1" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-48" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Transactions
            </CardTitle>
            <div className="flex w-full md:w-auto gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Filter Transactions</h4>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Date Range</p>
                      <div className={cn("grid gap-2")}>
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          selected={date}
                          onSelect={setDate}
                          numberOfMonths={1}
                          className="rounded-md border"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Status</p>
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All statuses</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Currency</p>
                      <Select
                        value={currencyFilter}
                        onValueChange={setCurrencyFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All currencies" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All currencies</SelectItem>
                          {currencies.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Amount</p>
                      <Select
                        value={amountFilter}
                        onValueChange={setAmountFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All amounts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All amounts</SelectItem>
                          <SelectItem value="lt1000">
                            Less than $1,000
                          </SelectItem>
                          <SelectItem value="1000-5000">
                            $1,000 - $5,000
                          </SelectItem>
                          <SelectItem value="gt5000">
                            More than $5,000
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetFilters}
                      >
                        Reset
                      </Button>
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setFiltersOpen(false)}
                      >
                        <Check className="h-4 w-4" /> Apply Filters
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {/* Status Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mr-4">
              <Badge
                variant={statusFilter === "" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setStatusFilter("")}
              >
                All
              </Badge>
              <Badge
                variant={statusFilter === "successful" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setStatusFilter("successful")}
              >
                Successful
              </Badge>
              <Badge
                variant={statusFilter === "pending" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setStatusFilter("pending")}
              >
                Pending
              </Badge>
              <Badge
                variant={statusFilter === "failed" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setStatusFilter("failed")}
              >
                Failed
              </Badge>
            </div>

            {/* Currency Filter Pills - shown on right side */}
            <div className="flex flex-wrap items-center gap-2 ml-auto">
              <span className="text-xs text-gray-500">Currency:</span>
              <Badge
                variant={currencyFilter === "" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setCurrencyFilter("")}
              >
                All
              </Badge>
              {currencies.map((currency) => (
                <Badge
                  key={currency}
                  variant={currencyFilter === currency ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setCurrencyFilter(currency)}
                >
                  {currency}
                </Badge>
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          {(date || amountFilter) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {date && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(date.from!, "MMM d, yyyy")} -{" "}
                  {date.to ? format(date.to, "MMM d, yyyy") : "Present"}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => setDate(undefined)}
                  >
                    <span className="sr-only">Remove</span>
                    &times;
                  </Button>
                </Badge>
              )}
              {amountFilter && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Amount:{" "}
                  {amountFilter === "lt1000"
                    ? "< $1,000"
                    : amountFilter === "1000-5000"
                    ? "$1,000 - $5,000"
                    : "> $5,000"}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => setAmountFilter("")}
                  >
                    <span className="sr-only">Remove</span>
                    &times;
                  </Button>
                </Badge>
              )}
              {(date || amountFilter) && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-6 px-2"
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </TableHead>
                  <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.id}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center font-medium ${getAvatarColor(
                              transaction.user.fullname
                            )}`}
                          >
                            {getInitials(transaction.user.fullname)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.user.fullname}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction.user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.currency.symbol}
                        {transaction.amount}
                        {/* {parseFloat(transaction.amount).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )} */}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          className={`font-medium ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(
                          new Date(transaction.created_at),
                          "MMM d, yyyy"
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          className="text-primary hover:text-primary/80"
                          onClick={() => handleOpenDetails(transaction)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {filteredTransactions.length > 0
                    ? (page - 1) * itemsPerPage + 1
                    : 0}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(page * itemsPerPage, filteredTransactions.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {filteredTransactions.length}
                </span>{" "}
                transactions
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TransactionDetailsDialog
        transaction={selectedTransaction}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
}
