import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { format } from "date-fns";
import { useState } from "react";
// @ts-ignore
import { TransactionVolume } from "@/types";
import { getDateRange } from "@/utils/getDateRange";
import { useFetchTransactionVolume } from "@/hooks/useTransaction";


const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
        <p className="text-sm font-medium text-gray-900">
          {format(new Date(label), "MMM d, yyyy")}
        </p>
        <p className="text-sm font-medium text-secondary text-black">
          Transactions: ₦{payload[0].value?.toLocaleString()} 
        </p>
      </div>
    );
  }

  return null;
};

export default function TransactionVolumeChart() {
  const [timeRange, setTimeRange] = useState<
    "week" | "month" | "quarter" | "year"
  >("month");

  const { start, end } = getDateRange(timeRange);


  const { data, isLoading } = useFetchTransactionVolume(start, end);


  if (isLoading) {
    return (
      <Card className="border border-gray-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-40" />
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
          <h3 className="text-lg font-semibold text-gray-800">
            Transaction Volume
          </h3>
          <div className="flex items-center space-x-2">
            <Select
              defaultValue={timeRange}
              onValueChange={(value) =>
                setTimeRange(value as "week" | "month" | "quarter" | "year")
              }
            >
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
            <BarChart
              data={data}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), "MMM d")}
                stroke="#000"
                fontSize={12}
              />
              {/* 9ca3af */}
              <YAxis
                tickFormatter={(value) => "₦" + value.toLocaleString()}
                stroke="#000"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="volume" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
