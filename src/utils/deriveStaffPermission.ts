import { permissionMap } from "@/constants";

export function deriveStaffPermissions(
  rawPermissions: { action: string; resource: string }[]
) {
  const staffPermissions: Record<string, boolean> = {
    viewDashboard: false,
    viewUsers: false,
    viewTransactions: false,
    viewAnalytics: false,
    editUsers: false,
    editTransactions: false,
    manageStaff: false,
    manageSettings: false,
  };

  for (const [key, perms] of Object.entries(permissionMap)) {
    staffPermissions[key] = perms.some(({ action, resource }) =>
      rawPermissions.some((p) => p.action === action && p.resource === resource)
    );
  }

  return staffPermissions;
}
