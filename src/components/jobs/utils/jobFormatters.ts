import { Job } from "@/types/jobTypes";

export const formatDate = (dateString?: string): string => {
  if (!dateString) return "Not specified";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatSalary = (job: Job): string => {
  if (!job.min_salary && !job.max_salary) return "Not specified";

  const currency = job.currency || "USD";
  const period = job.payment_period || "yearly";

  let formattedPeriod = "";
  switch (period) {
    case "hourly":
      formattedPeriod = "/hour";
      break;
    case "daily":
      formattedPeriod = "/day";
      break;
    case "weekly":
      formattedPeriod = "/week";
      break;
    case "monthly":
      formattedPeriod = "/month";
      break;
    case "yearly":
      formattedPeriod = "/year";
      break;
    default:
      formattedPeriod = ""; // for flat rate
  }

  const currencySymbol =
    currency === "USD"
      ? "$"
      : currency === "EUR"
      ? "€"
      : currency === "GBP"
      ? "£"
      : currency === "INR"
      ? "₹"
      : currency;

  if (job.min_salary && job.max_salary) {
    return `${currencySymbol}${job.min_salary.toLocaleString()} - ${currencySymbol}${job.max_salary.toLocaleString()}${formattedPeriod}`;
  } else if (job.min_salary) {
    return `${currencySymbol}${job.min_salary.toLocaleString()}${formattedPeriod}+`;
  } else if (job.max_salary) {
    return `Up to ${currencySymbol}${job.max_salary.toLocaleString()}${formattedPeriod}`;
  }

  return "Not specified";
};
