import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

// Data type for daily transactions
interface DailyTransactionData {
  date: string;
  transactions: number;
  revenue: number;
}

// Data type for payment methods
interface PaymentMethodData {
  name: string;
  value: number;
}

// Data type for user activity
interface UserActivityData {
  date: string;
  active: number;
  new: number;
}

// Data type for transaction status
interface TransactionStatusData {
  name: string;
  value: number;
}

interface AnalyticsChartsProps {
  dailyTransactions?: DailyTransactionData[];
  paymentMethods?: PaymentMethodData[];
  userActivity?: UserActivityData[];
  transactionStatus?: TransactionStatusData[];
  loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
        <p className="text-sm font-medium text-gray-900">{format(new Date(label), "MMM d, yyyy")}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="text-sm font-medium"
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.name === "Revenue" ? `$${entry.value?.toLocaleString()}` : entry.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const CHART_COLORS = ["#0C4592", "#2563EB", "#22C55E", "#F59E0B", "#EF4444"];

export function TransactionVolumeChart({
  data = [],
  loading = false,
}: {
  data?: DailyTransactionData[];
  loading?: boolean;
}) {
  const [timeRange, setTimeRange] = useState("30days");

  if (loading) {
    return (
      <Card className="border border-gray-100">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-9 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-100">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-gray-800">Transaction Volume</CardTitle>
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0C4592" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0C4592" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), "MMM d")}
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => value.toLocaleString()} 
                stroke="#9ca3af"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone"
                dataKey="transactions"
                stroke="#0C4592"
                fillOpacity={1}
                fill="url(#colorTransactions)"
                name="Transactions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function RevenueChart({
  data = [],
  loading = false,
}: {
  data?: DailyTransactionData[];
  loading?: boolean;
}) {
  const [timeRange, setTimeRange] = useState("30days");

  if (loading) {
    return (
      <Card className="border border-gray-100">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-9 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-100">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-gray-800">Revenue Trends</CardTitle>
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), "MMM d")}
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                stroke="#9ca3af"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ r: 3, fill: "#2563EB" }}
                activeDot={{ r: 5, fill: "#2563EB" }}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function PaymentMethodsChart({
  data = [],
  loading = false,
}: {
  data?: PaymentMethodData[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card className="border border-gray-100">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {/* {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))} */}
              </Pie>
              <Tooltip formatter={(value) => `${value.toLocaleString()} transactions`} />
              <Legend 
                formatter={(value) => <span className="text-sm">{value}</span>}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function UserActivityChart({
  data = [],
  loading = false,
}: {
  data?: UserActivityData[];
  loading?: boolean;
}) {
  const [timeRange, setTimeRange] = useState("30days");

  if (loading) {
    return (
      <Card className="border border-gray-100">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-9 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-100">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-gray-800">User Activity</CardTitle>
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), "MMM d")}
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => value.toLocaleString()} 
                stroke="#9ca3af"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                formatter={(value) => <span className="text-sm">{value}</span>}
                wrapperStyle={{ paddingTop: 10 }}
              />
              <Bar dataKey="active" name="Active Users" fill="#0C4592" radius={[4, 4, 0, 0]} />
              <Bar dataKey="new" name="New Users" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function TransactionStatusChart({
  data = [],
  loading = false,
}: {
  data?: TransactionStatusData[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card className="border border-gray-100">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">Transaction Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={
                      entry.name === "Completed" ? "#22C55E" :
                      entry.name === "Pending" ? "#F59E0B" :
                      entry.name === "Failed" ? "#EF4444" : 
                      CHART_COLORS[index % CHART_COLORS.length]
                    } 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toLocaleString()} transactions`} />
              <Legend 
                formatter={(value) => <span className="text-sm">{value}</span>}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsCharts({
  dailyTransactions = [],
  paymentMethods = [],
  userActivity = [],
  transactionStatus = [],
  loading = false,
}: AnalyticsChartsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 h-auto">
        <TabsTrigger value="overview" className="text-sm py-2">Overview</TabsTrigger>
        <TabsTrigger value="transactions" className="text-sm py-2">Transactions</TabsTrigger>
        <TabsTrigger value="users" className="text-sm py-2">Users</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionVolumeChart data={dailyTransactions} loading={loading} />
          <RevenueChart data={dailyTransactions} loading={loading} />
        </div>
      </TabsContent>

      <TabsContent value="transactions" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionVolumeChart data={dailyTransactions} loading={loading} />
          <PaymentMethodsChart data={paymentMethods} loading={loading} />
          <TransactionStatusChart data={transactionStatus} loading={loading} />
          <RevenueChart data={dailyTransactions} loading={loading} />
        </div>
      </TabsContent>

      <TabsContent value="users" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserActivityChart data={userActivity} loading={loading} />
          <div className="grid grid-cols-1 gap-6">
            <Card className="border border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-gray-800">User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[calc(50%-32px)]">
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart
                      data={userActivity}
                      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => format(new Date(date), "MMM d")}
                        stroke="#9ca3af"
                        fontSize={12}
                      />
                      <YAxis 
                        tickFormatter={(value) => value.toLocaleString()} 
                        stroke="#9ca3af"
                        fontSize={12}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="new"
                        name="New Users"
                        stroke="#22C55E"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-gray-800">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[calc(50%-32px)]">
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart
                      data={userActivity}
                      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => format(new Date(date), "MMM d")}
                        stroke="#9ca3af"
                        fontSize={12}
                      />
                      <YAxis 
                        tickFormatter={(value) => value.toLocaleString()} 
                        stroke="#9ca3af"
                        fontSize={12}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="active"
                        name="Active Users"
                        stroke="#0C4592"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
