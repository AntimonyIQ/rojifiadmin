import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format number to currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format number with commas for thousands
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

// Get status color based on status string
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'inactive':
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    case 'pending':
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
    case 'declined':
    case 'suspended':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

// Get a random color based on a string (e.g., for avatars)
export function getColorFromString(str: string) {
  const colors = [
    'bg-green-100 text-green-700',
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-indigo-100 text-indigo-700',
    'bg-pink-100 text-pink-700',
  ];
  
  // Simple hash function to get consistent color for a string
  const hash = str.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  return colors[hash % colors.length];
}

// Format date to readable format
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'short') {
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  
  return dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Calculate percentage change between two numbers
export function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return 100; // If previous was 0, assume 100% increase
  return ((current - previous) / previous) * 100;
}
