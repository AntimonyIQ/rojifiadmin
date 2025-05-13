import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-transparent border-primary",
        sizeClasses[size],
        className
      )}
      style={{ borderWidth: "2px" }}
    />
  );
}

export function LoadingPage() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export function LoadingSection() {
  return (
    <div className="h-36 w-full flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
