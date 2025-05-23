export const permissionMap = {
  viewUsers: [{ action: "read", resource: "users" }],
  viewTransactions: [{ action: "read", resource: "transactions" }],
  viewDashboard: [
    { action: "read", resource: "transactions" },
    { action: "read", resource: "users" },
    { action: "read", resource: "wallets" },
  ],
  viewAnalytics: [{ action: "read", resource: "exchange_rates" }],

  editUsers: [
    { action: "update", resource: "users" },
    { action: "delete", resource: "users" },
  ],
  editTransactions: [
    { action: "update", resource: "transactions" },
    { action: "delete", resource: "transactions" },
  ],

  manageStaff: [
    { action: "create", resource: "staffs" },
    { action: "update", resource: "staffs" },
    { action: "delete", resource: "staffs" },
  ],

  manageSettings: [
    { action: "create", resource: "currencies" },
    { action: "update", resource: "currencies" },
    { action: "delete", resource: "currencies" },
  ],
};
