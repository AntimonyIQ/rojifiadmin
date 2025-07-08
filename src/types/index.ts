// User types
export interface User {
  id: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  phone: any;
  avatar: string;
  status: any; // "active" | "inactive"
  post_no_debit?: any;
  address_line_one: string;
  address_line_two: string;
  city: string;
  state: string;
  country: string;
  joined_at: string;
}

// Transaction types
export interface TransactionResponse {
  transactions: Transaction[];
  metadata: {
    page: any;
    limit: any;
    total: any;
  };
}

export interface Transaction {
  id: string;
  created_at: string;
  reference: string;
  amount: string;
  merchant_fee: string;
  net_amount: string;
  description: string;
  type: "debit" | "credit";
  status: "successful" | "pending" | "failed" | "reversed" | string;

  user: {
    id: string;
    fullname: string;
    email: string;
    avatar: string;
  };

  currency: {
    code: string;
    symbol: string;
    decimal_place: number;
  };

  balance_before_tx?: string;
  balance_after_tx?: string;
  beneficiary_account_number?: string;
  beneficiary_bank_name?: string;
  beneficiary_account_name?: string;
  sender_account_number?: string | null;
  sender_account_name?: string | null;
  reversed_by?: string | null;
  completed_at?: string;
}

export interface TransactionStatusPayload {
  status: "successful" | "pending" | "failed" | "reversed";
}

export interface TransactionVolume {
  date: string;
  volume: number;
}

export interface OverviewProps {
  active_user_growth: number;
  active_users: number;
  revenue: number;
  revenue_growth: number;
  total_transactions: number;
  total_users: number;
  transaction_growth: number;
  user_growth: number;
}

export interface WalletOverview {
  total_balance: string;
  total_deposit: string;
  total_withdraw: string;
}

export interface Permission {
  id?: string;
  action?: string; // create | read | ...
  resource?: string;
}

export interface Role {
  name: string;
}

export interface RolePayload {
  id?: string;
  name: string;
  description: string;
  permissions: any;
}

export interface Staff {
  id: string;
  created_at: any;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  status: "active" | "inactive";
  phone: string;
  role: Role;
  permissions: Permission[];
}

export interface AddStaffPayload {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  role: string;
  id?: string;
  // permissions: Permission[];
}

export interface EditStaffPayload {
  email: string;
  firstname: string;
  lastname: string;
  phone?: string;
  id?: string;
  status?: any;
}

export interface TransactionDetail {
  label: string;
  value: string;
}

// Payments interfaces
export interface Currency {
  id?: string;
  name: string;
  code: string;
  decimal_place: number;
  enabled?: boolean;
  country?: string;
}

export interface ExchangeRate {
  id: string;
  rate: string;
  base_currency: Currency;
  target_currency: Currency;
}

export interface ProcessorChannelType {
  id: string;
  name: string;
  status: "enabled" | "disabled";
  supported_currencies: Currency[];
}

// transaction channels
export interface CurrencyProps {
  name: string;
  code: string;
  country_code: string;
}

export interface Processor {
  id: string;
  name: string;
  enabled?: boolean;
  supported_currencies: CurrencyProps[];
}

export interface TransactionChannelsProps {
  id: string;
  name: string;
  status: "enabled" | "disabled";
  processor: Processor[];
}

// Activity log types
export interface ActivityLog {
  type: "login" | "transaction" | "update" | "other";
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

// currency types
export interface AdminCurrencyProps {
  id: string;
  name: string;
  code: string;
  symbol: string;
  country: string;
  country_code: string;
  decimal_place: number;
  min_swap_amount: number;
  min_transfer_amount: number;
  max_transfer_amount: number;
  max_swap_amount: number;
}

export interface AddCurrencyPayload {
  name: string;
  code: string;
  symbol: string;
  country: string;
  decimal_place: number;
  country_code: string;
}

export interface EditCurrencyPayload {
  min_swap_amount: number;
  min_transfer_amount: number;
  max_transfer_amount: number;
  max_swap_amount: number;
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
  transactionProcessingMode: "instant" | "batch";
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
  feeModel: "flat" | "tiered";
  processingFeePercentage: number;
  processingFeeFixed: number;
  includeFeeInTotal: boolean;
  passProcessingFeeToCustomer: boolean;
  volumeDiscounts: boolean;
  additionalFees: AdditionalFee[];
}

export interface AdditionalFee {
  name: string;
  type: "percentage" | "fixed";
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

// auth types
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  code: string;
  message: string;
  data: {
    token: string;
  };
}
