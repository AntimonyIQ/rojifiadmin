import {
  User,
  Transaction,
  DashboardStats,
  ChartData,
  AnalyticsData,
  GeneralSettings,
  TransactionSettings,
  FeeSettings,
  PaymentChannelSettings,
} from '@/types';

// Mock data for the application
// In a real-world scenario, these would be actual API calls to the backend

// Users
export async function fetchUsers(): Promise<User[]> {
  // This would be a real API call in production
  return [
    {
      id: 1001,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 555-123-4567',
      status: 'Active',
      joinedDate: '2023-01-15',
      lastLoginDate: '2023-05-12T14:32:00',
      address: '123 Main St, San Francisco, CA 94105, USA',
      recentTransactions: [
        {
          id: 2835,
          userId: 1001,
          userName: 'John Doe',
          userEmail: 'john.doe@example.com',
          amount: 1285.00,
          status: 'Completed',
          date: '2023-05-12',
        },
        {
          id: 2750,
          userId: 1001,
          userName: 'John Doe',
          userEmail: 'john.doe@example.com',
          amount: 450.25,
          status: 'Completed',
          date: '2023-05-05',
        }
      ],
      activityLog: [
        {
          type: 'login',
          description: 'Logged in from new device',
          timestamp: '2023-05-12T14:32:00',
          details: 'Chrome on macOS'
        },
        {
          type: 'transaction',
          description: 'Completed transaction #2835',
          timestamp: '2023-05-12T15:07:23',
        }
      ]
    },
    {
      id: 1002,
      name: 'Maria Smith',
      email: 'maria@example.com',
      phone: '+1 555-987-6543',
      status: 'Active',
      joinedDate: '2023-02-10',
      lastLoginDate: '2023-05-12T10:15:00',
      address: '456 Oak Ave, Chicago, IL 60611, USA',
      recentTransactions: [
        {
          id: 2834,
          userId: 1002,
          userName: 'Maria Smith',
          userEmail: 'maria@example.com',
          amount: 845.50,
          status: 'Pending',
          date: '2023-05-12',
        }
      ],
      activityLog: [
        {
          type: 'login',
          description: 'Logged in',
          timestamp: '2023-05-12T10:15:00',
        },
        {
          type: 'transaction',
          description: 'Created transaction #2834',
          timestamp: '2023-05-12T10:45:12',
        }
      ]
    },
    {
      id: 1003,
      name: 'Robert Johnson',
      email: 'robert@example.com',
      phone: '+1 555-456-7890',
      status: 'Inactive',
      joinedDate: '2023-02-25',
      lastLoginDate: '2023-05-10T16:22:00',
      address: '789 Elm St, New York, NY 10001, USA',
      recentTransactions: [
        {
          id: 2833,
          userId: 1003,
          userName: 'Robert Johnson',
          userEmail: 'robert@example.com',
          amount: 2145.00,
          status: 'Failed',
          date: '2023-05-11',
        }
      ],
      activityLog: [
        {
          type: 'login',
          description: 'Failed login attempt',
          timestamp: '2023-05-11T09:32:15',
          details: 'Invalid password'
        },
        {
          type: 'login',
          description: 'Logged in',
          timestamp: '2023-05-10T16:22:00',
        }
      ]
    },
    {
      id: 1004,
      name: 'Alice Williams',
      email: 'alice@example.com',
      phone: '+1 555-789-0123',
      status: 'Active',
      joinedDate: '2023-03-05',
      lastLoginDate: '2023-05-11T11:45:00',
      address: '101 Pine St, Seattle, WA 98101, USA',
      recentTransactions: [
        {
          id: 2832,
          userId: 1004,
          userName: 'Alice Williams',
          userEmail: 'alice@example.com',
          amount: 528.25,
          status: 'Completed',
          date: '2023-05-11',
        }
      ],
      activityLog: [
        {
          type: 'login',
          description: 'Logged in',
          timestamp: '2023-05-11T11:45:00',
        },
        {
          type: 'transaction',
          description: 'Completed transaction #2832',
          timestamp: '2023-05-11T12:03:45',
        }
      ]
    },
    {
      id: 1005,
      name: 'David Brown',
      email: 'david@example.com',
      phone: '+1 555-234-5678',
      status: 'Suspended',
      joinedDate: '2023-03-15',
      lastLoginDate: '2023-05-05T09:10:00',
      address: '222 Cedar Rd, Austin, TX 78701, USA',
      recentTransactions: [],
      activityLog: [
        {
          type: 'update',
          description: 'Account suspended',
          timestamp: '2023-05-06T15:30:00',
          details: 'Multiple failed payment attempts'
        },
        {
          type: 'login',
          description: 'Logged in',
          timestamp: '2023-05-05T09:10:00',
        }
      ]
    },
    {
      id: 1006,
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+1 555-345-6789',
      status: 'Pending',
      joinedDate: '2023-05-01',
      lastLoginDate: '2023-05-01T14:22:00',
      address: '333 Maple Ave, Denver, CO 80202, USA',
      recentTransactions: [],
      activityLog: [
        {
          type: 'login',
          description: 'First login',
          timestamp: '2023-05-01T14:22:00',
        },
        {
          type: 'update',
          description: 'Submitted verification documents',
          timestamp: '2023-05-01T14:45:32',
        }
      ]
    }
  ];
}

// Transactions
export async function fetchTransactions(): Promise<Transaction[]> {
  // This would be a real API call in production
  return [
    {
      id: 2835,
      userId: 1001,
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      amount: 1285.00,
      status: 'Completed',
      date: '2023-05-12',
      paymentMethod: 'Credit Card',
      details: [
        { label: 'Card', value: 'Visa ****4242' },
        { label: 'Reference', value: 'REF-12345' },
        { label: 'Processing Fee', value: '$37.77' },
      ],
    },
    {
      id: 2834,
      userId: 1002,
      userName: 'Maria Smith',
      userEmail: 'maria@example.com',
      amount: 845.50,
      status: 'Pending',
      date: '2023-05-12',
      paymentMethod: 'Bank Transfer',
      details: [
        { label: 'Bank', value: 'Chase Bank' },
        { label: 'Reference', value: 'REF-12346' },
        { label: 'Processing Fee', value: '$24.82' },
      ],
    },
    {
      id: 2833,
      userId: 1003,
      userName: 'Robert Johnson',
      userEmail: 'robert@example.com',
      amount: 2145.00,
      status: 'Failed',
      date: '2023-05-11',
      paymentMethod: 'Credit Card',
      details: [
        { label: 'Card', value: 'Mastercard ****5678' },
        { label: 'Reference', value: 'REF-12347' },
        { label: 'Error', value: 'Insufficient funds' },
      ],
      notes: 'Customer attempted payment but card was declined due to insufficient funds. Contacted customer to arrange alternative payment method.',
    },
    {
      id: 2832,
      userId: 1004,
      userName: 'Alice Williams',
      userEmail: 'alice@example.com',
      amount: 528.25,
      status: 'Completed',
      date: '2023-05-11',
      paymentMethod: 'PayPal',
      details: [
        { label: 'PayPal Account', value: 'alice@example.com' },
        { label: 'Reference', value: 'REF-12348' },
        { label: 'Processing Fee', value: '$15.82' },
      ],
    },
    {
      id: 2831,
      userId: 1007,
      userName: 'Michael Wilson',
      userEmail: 'michael@example.com',
      amount: 975.00,
      status: 'Completed',
      date: '2023-05-10',
      paymentMethod: 'Credit Card',
      details: [
        { label: 'Card', value: 'Amex ****7890' },
        { label: 'Reference', value: 'REF-12349' },
        { label: 'Processing Fee', value: '$28.58' },
      ],
    },
    {
      id: 2830,
      userId: 1008,
      userName: 'Sarah Taylor',
      userEmail: 'sarah@example.com',
      amount: 340.75,
      status: 'Completed',
      date: '2023-05-10',
      paymentMethod: 'Digital Wallet',
      details: [
        { label: 'Wallet', value: 'Apple Pay' },
        { label: 'Reference', value: 'REF-12350' },
        { label: 'Processing Fee', value: '$10.22' },
      ],
    },
    {
      id: 2829,
      userId: 1009,
      userName: 'James Anderson',
      userEmail: 'james@example.com',
      amount: 1500.00,
      status: 'Cancelled',
      date: '2023-05-09',
      paymentMethod: 'Bank Transfer',
      details: [
        { label: 'Bank', value: 'Wells Fargo' },
        { label: 'Reference', value: 'REF-12351' },
        { label: 'Reason', value: 'Customer request' },
      ],
      notes: 'Customer requested cancellation because they selected the wrong payment amount. New transaction created with correct amount.',
    },
    {
      id: 2828,
      userId: 1010,
      userName: 'Lisa Martinez',
      userEmail: 'lisa@example.com',
      amount: 680.50,
      status: 'Completed',
      date: '2023-05-09',
      paymentMethod: 'Credit Card',
      details: [
        { label: 'Card', value: 'Visa ****1234' },
        { label: 'Reference', value: 'REF-12352' },
        { label: 'Processing Fee', value: '$20.03' },
      ],
    }
  ];
}

export async function fetchRecentTransactions(): Promise<Transaction[]> {
  const transactions = await fetchTransactions();
  return transactions.slice(0, 4);
}

// Dashboard stats
export async function fetchDashboardStats(): Promise<DashboardStats> {
  // This would be a real API call in production
  return {
    totalUsers: 24953,
    totalTransactions: 132548,
    revenue: 845239,
    activeUsers: 18472,
    userGrowth: 12.5,
    transactionGrowth: 8.2,
    revenueGrowth: 16.8,
    activeUserGrowth: -3.2,
  };
}

// Chart data for dashboard
export async function fetchChartData(startDate: string, endDate: string): Promise<ChartData> {
  // This would be a real API call in production
  const revenue = [
    { date: '2023-04-12', revenue: 65000 },
    { date: '2023-04-13', revenue: 59000 },
    { date: '2023-04-14', revenue: 80000 },
    { date: '2023-04-15', revenue: 81000 },
    { date: '2023-04-16', revenue: 56000 },
    { date: '2023-04-17', revenue: 55000 },
    { date: '2023-04-18', revenue: 40000 },
    { date: '2023-04-19', revenue: 45000 },
    { date: '2023-04-20', revenue: 50000 },
    { date: '2023-04-21', revenue: 55000 },
    { date: '2023-04-22', revenue: 60000 },
    { date: '2023-04-23', revenue: 65000 },
    { date: '2023-04-24', revenue: 70000 },
    { date: '2023-04-25', revenue: 75000 },
    { date: '2023-04-26', revenue: 80000 },
    { date: '2023-04-27', revenue: 85000 },
    { date: '2023-04-28', revenue: 90000 },
    { date: '2023-04-29', revenue: 85000 },
    { date: '2023-04-30', revenue: 80000 },
    { date: '2023-05-01', revenue: 75000 },
    { date: '2023-05-02', revenue: 70000 },
    { date: '2023-05-03', revenue: 75000 },
    { date: '2023-05-04', revenue: 80000 },
    { date: '2023-05-05', revenue: 85000 },
    { date: '2023-05-06', revenue: 90000 },
    { date: '2023-05-07', revenue: 95000 },
    { date: '2023-05-08', revenue: 90000 },
    { date: '2023-05-09', revenue: 85000 },
    { date: '2023-05-10', revenue: 80000 },
    { date: '2023-05-11', revenue: 85000 },
    { date: '2023-05-12', revenue: 92000 },
  ];

  const transactions = [
    { date: '2023-04-12', volume: 12500 },
    { date: '2023-04-13', volume: 13200 },
    { date: '2023-04-14', volume: 14800 },
    { date: '2023-04-15', volume: 13900 },
    { date: '2023-04-16', volume: 11500 },
    { date: '2023-04-17', volume: 10800 },
    { date: '2023-04-18', volume: 9500 },
    { date: '2023-04-19', volume: 10200 },
    { date: '2023-04-20', volume: 11000 },
    { date: '2023-04-21', volume: 11800 },
    { date: '2023-04-22', volume: 12500 },
    { date: '2023-04-23', volume: 13300 },
    { date: '2023-04-24', volume: 14000 },
    { date: '2023-04-25', volume: 14700 },
    { date: '2023-04-26', volume: 15400 },
    { date: '2023-04-27', volume: 16100 },
    { date: '2023-04-28', volume: 16800 },
    { date: '2023-04-29', volume: 16500 },
    { date: '2023-04-30', volume: 16200 },
    { date: '2023-05-01', volume: 15900 },
    { date: '2023-05-02', volume: 15600 },
    { date: '2023-05-03', volume: 15900 },
    { date: '2023-05-04', volume: 16200 },
    { date: '2023-05-05', volume: 16500 },
    { date: '2023-05-06', volume: 16800 },
    { date: '2023-05-07', volume: 17100 },
    { date: '2023-05-08', volume: 16800 },
    { date: '2023-05-09', volume: 16500 },
    { date: '2023-05-10', volume: 16200 },
    { date: '2023-05-11', volume: 16500 },
    { date: '2023-05-12', volume: 17200 },
  ];

  return { revenue, transactions };
}

// Analytics data
export async function fetchAnalyticsData(startDate: string, endDate: string): Promise<AnalyticsData> {
  // This would be a real API call in production
  const dailyTransactions = [
    { date: '2023-04-12', transactions: 12500, revenue: 65000 },
    { date: '2023-04-13', transactions: 13200, revenue: 59000 },
    { date: '2023-04-14', transactions: 14800, revenue: 80000 },
    { date: '2023-04-15', transactions: 13900, revenue: 81000 },
    { date: '2023-04-16', transactions: 11500, revenue: 56000 },
    { date: '2023-04-17', transactions: 10800, revenue: 55000 },
    { date: '2023-04-18', transactions: 9500, revenue: 40000 },
    { date: '2023-04-19', transactions: 10200, revenue: 45000 },
    { date: '2023-04-20', transactions: 11000, revenue: 50000 },
    { date: '2023-04-21', transactions: 11800, revenue: 55000 },
    { date: '2023-04-22', transactions: 12500, revenue: 60000 },
    { date: '2023-04-23', transactions: 13300, revenue: 65000 },
    { date: '2023-04-24', transactions: 14000, revenue: 70000 },
    { date: '2023-04-25', transactions: 14700, revenue: 75000 },
    { date: '2023-04-26', transactions: 15400, revenue: 80000 },
    { date: '2023-04-27', transactions: 16100, revenue: 85000 },
    { date: '2023-04-28', transactions: 16800, revenue: 90000 },
    { date: '2023-04-29', transactions: 16500, revenue: 85000 },
    { date: '2023-04-30', transactions: 16200, revenue: 80000 },
    { date: '2023-05-01', transactions: 15900, revenue: 75000 },
    { date: '2023-05-02', transactions: 15600, revenue: 70000 },
    { date: '2023-05-03', transactions: 15900, revenue: 75000 },
    { date: '2023-05-04', transactions: 16200, revenue: 80000 },
    { date: '2023-05-05', transactions: 16500, revenue: 85000 },
    { date: '2023-05-06', transactions: 16800, revenue: 90000 },
    { date: '2023-05-07', transactions: 17100, revenue: 95000 },
    { date: '2023-05-08', transactions: 16800, revenue: 90000 },
    { date: '2023-05-09', transactions: 16500, revenue: 85000 },
    { date: '2023-05-10', transactions: 16200, revenue: 80000 },
    { date: '2023-05-11', transactions: 16500, revenue: 85000 },
    { date: '2023-05-12', transactions: 17200, revenue: 92000 },
  ];

  const paymentMethods = [
    { name: 'Credit Card', value: 65432 },
    { name: 'Bank Transfer', value: 35876 },
    { name: 'Digital Wallet', value: 15432 },
    { name: 'PayPal', value: 12543 },
    { name: 'Cryptocurrency', value: 3265 },
  ];

  const userActivity = [
    { date: '2023-04-12', active: 10200, new: 450 },
    { date: '2023-04-13', active: 10300, new: 432 },
    { date: '2023-04-14', active: 10400, new: 465 },
    { date: '2023-04-15', active: 10500, new: 487 },
    { date: '2023-04-16', active: 10400, new: 423 },
    { date: '2023-04-17', active: 10300, new: 412 },
    { date: '2023-04-18', active: 10200, new: 398 },
    { date: '2023-04-19', active: 10300, new: 421 },
    { date: '2023-04-20', active: 10400, new: 433 },
    { date: '2023-04-21', active: 10500, new: 445 },
    { date: '2023-04-22', active: 10600, new: 457 },
    { date: '2023-04-23', active: 10700, new: 469 },
    { date: '2023-04-24', active: 10800, new: 481 },
    { date: '2023-04-25', active: 10900, new: 493 },
    { date: '2023-04-26', active: 11000, new: 505 },
    { date: '2023-04-27', active: 11100, new: 517 },
    { date: '2023-04-28', active: 11200, new: 529 },
    { date: '2023-04-29', active: 11100, new: 512 },
    { date: '2023-04-30', active: 11000, new: 495 },
    { date: '2023-05-01', active: 10900, new: 478 },
    { date: '2023-05-02', active: 10800, new: 461 },
    { date: '2023-05-03', active: 10900, new: 473 },
    { date: '2023-05-04', active: 11000, new: 485 },
    { date: '2023-05-05', active: 11100, new: 497 },
    { date: '2023-05-06', active: 11200, new: 509 },
    { date: '2023-05-07', active: 11300, new: 521 },
    { date: '2023-05-08', active: 11200, new: 504 },
    { date: '2023-05-09', active: 11100, new: 487 },
    { date: '2023-05-10', active: 11000, new: 470 },
    { date: '2023-05-11', active: 11100, new: 483 },
    { date: '2023-05-12', active: 11200, new: 496 },
  ];

  const transactionStatus = [
    { name: 'Completed', value: 98542 },
    { name: 'Pending', value: 23487 },
    { name: 'Failed', value: 7652 },
    { name: 'Cancelled', value: 2867 },
  ];

  return { dailyTransactions, paymentMethods, userActivity, transactionStatus };
}

// Settings API endpoints
export async function saveGeneralSettings(settings: GeneralSettings): Promise<void> {
  // This would be a real API call in production
  // For now, we'll just simulate a server delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('General settings saved:', settings);
  return;
}

export async function saveTransactionSettings(settings: TransactionSettings): Promise<void> {
  // This would be a real API call in production
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Transaction settings saved:', settings);
  return;
}

export async function saveFeeSettings(settings: FeeSettings): Promise<void> {
  // This would be a real API call in production
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Fee settings saved:', settings);
  return;
}

export async function savePaymentChannels(settings: PaymentChannelSettings): Promise<void> {
  // This would be a real API call in production
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Payment channel settings saved:', settings);
  return;
}
