import {
  startOfWeek,
  startOfMonth,
  subMonths,
  startOfYear,
  endOfYesterday,
  format,
} from "date-fns";

type TimeRange = "week" | "month" | "quarter" | "year";

export const getDateRange = (range: TimeRange) => {
  const today = new Date();
  const endDate = endOfYesterday(); 

  let startDate: Date;

  switch (range) {
    case "week":
      startDate = startOfWeek(today, { weekStartsOn: 1 }); 
      break;
    case "month":
      startDate = startOfMonth(today);
      break;
    case "quarter":
      startDate = subMonths(today, 3);
      break;
    case "year":
      startDate = startOfYear(today);
      break;
    default:
      startDate = startOfMonth(today);
  }

  return {
    start: format(startDate, "yyyy-MM-dd"),
    end: format(endDate, "yyyy-MM-dd"),
  };
};
