// User types
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  joinedDate: string;
  lastLoginDate: string;
  address: string;
  recentTransactions?: Transaction[];
  activityLog?: ActivityLog[];
}

// Transaction types
export interface Transaction {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  amount: number;
  status: string;
  date: string;
  paymentMethod?: string;
  details?: TransactionDetail[];
  notes?: string;
}

export interface TransactionDetail {
  label: string;
  value: string;
}

// Activity log types
export interface ActivityLog {
  type: 'login' | 'transaction' | 'update' | 'other';
  description: string;
  timestamp: string;
  details?: string;
}

// Dashboard stats types
export interface DashboardStats {
  totalUsers: number;
  totalTransactions: number;
  revenue: number;
  activeUsers: number;
  userGrowth: number;
  transactionGrowth: number;
  revenueGrowth: number;
  activeUserGrowth: number;
}

// Chart data types
export interface ChartData {
  revenue: RevenueData[];
  transactions: TransactionData[];
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface TransactionData {
  date: string;
  volume: number;
}

// Analytics data types
export interface AnalyticsData {
  dailyTransactions: DailyTransactionData[];
  paymentMethods: PaymentMethodData[];
  userActivity: UserActivityData[];
  transactionStatus: TransactionStatusData[];
}

export interface DailyTransactionData {
  date: string;
  transactions: number;
  revenue: number;
}

export interface PaymentMethodData {
  name: string;
  value: number;
}

export interface UserActivityData {
  date: string;
  active: number;
  new: number;
}

export interface TransactionStatusData {
  name: string;
  value: number;
}

// Settings types
export interface GeneralSettings {
  companyName: string;
  contactEmail: string;
  supportPhone: string;
  timezone: string;
  dateFormat: string;
  emailNotifications: boolean;
  marketingEmails: boolean;
  termsAndConditions: string;
}

export interface TransactionSettings {
  transactionProcessingMode: 'instant' | 'batch';
  maxTransactionAmount: number;
  minTransactionAmount: number;
  dailyLimitAmount: number;
  requireEmailVerification: boolean;
  requirePhoneVerification: boolean;
  transactionNotifications: boolean;
  automaticRefunds: boolean;
  transactionExpiryHours: number;
  defaultCurrency: string;
  fraudDetectionLevel: number;
}

export interface FeeSettings {
  feeModel: 'flat' | 'tiered';
  processingFeePercentage: number;
  processingFeeFixed: number;
  includeFeeInTotal: boolean;
  passProcessingFeeToCustomer: boolean;
  volumeDiscounts: boolean;
  additionalFees: AdditionalFee[];
}

export interface AdditionalFee {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxAmount?: number;
  active: boolean;
}

export interface PaymentChannel {
  id: string;
  name: string;
  enabled: boolean;
}

export interface PaymentCurrency {
  code: string;
  name: string;
  enabled: boolean;
}

export interface PaymentProcessor {
  id: string;
  name: string;
  enabled: boolean;
  apiKey?: string;
  secretKey?: string;
  webhookUrl?: string;
  testMode: boolean;
  channels: PaymentChannel[];
  currencies: PaymentCurrency[];
}

export interface PaymentChannelSettings {
  processors: PaymentProcessor[];
}
