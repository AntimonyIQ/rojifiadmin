import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  percentageChange?: number;
  comparisonText?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  loading?: boolean;
}

export default function KpiCard({
  title,
  value,
  percentageChange,
  comparisonText = "from last month",
  icon: Icon,
  iconColor,
  iconBgColor,
  loading = false,
}: KpiCardProps) {
  const isPositive = percentageChange && percentageChange > 0;
  const isNegative = percentageChange && percentageChange < 0;
  
  if (loading) {
    return (
      <Card className="border border-gray-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
          <Skeleton className="h-9 w-32 mt-3" />
          <Skeleton className="h-5 w-40 mt-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-100">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className={cn("p-2 rounded-md", iconBgColor)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>
        <p className="mt-3 text-2xl font-semibold text-gray-900">{value}</p>
        {percentageChange !== undefined && (
          <div className="mt-2 flex items-center">
            {isPositive ? (
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            ) : isNegative ? (
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
            ) : null}
            <span
              className={cn(
                "text-sm",
                isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-gray-500"
              )}
            >
              {Math.abs(percentageChange).toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">{comparisonText}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
