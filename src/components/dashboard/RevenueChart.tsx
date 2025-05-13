import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, TooltipProps } from "recharts";
import { format } from "date-fns";
import { useState } from "react";

interface RevenueChartProps {
  data?: Array<{
    date: string;
    revenue: number;
  }>;
  loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
        <p className="text-sm font-medium text-gray-900">{format(new Date(label), "MMM d, yyyy")}</p>
        <p className="text-sm font-medium text-primary">
          Revenue: ${payload[0].value?.toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
};

export default function RevenueChart({ data = [], loading = false }: RevenueChartProps) {
  const [timeRange, setTimeRange] = useState("month");

  if (loading) {
    return (
      <Card className="border border-gray-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-9 w-32" />
          </div>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-100">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Revenue Trends</h3>
          <div className="flex items-center space-x-2">
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">Last 3 Months</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
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
                stroke="#0C4592"
                strokeWidth={2}
                dot={{ r: 3, fill: "#0C4592" }}
                activeDot={{ r: 5, fill: "#0C4592" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
