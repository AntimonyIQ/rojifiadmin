import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  // @ts-ignore
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, getColorFromString, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  UserPlus,
  Edit2,
  Trash2,
  Search,
  // @ts-ignore
  UserCog,
  ShieldCheck,
  Users as UsersIcon,
  UserCheck,
  UserX,
  MoreHorizontal,
  // @ts-ignore
  Check,
  Tag,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// @ts-ignore
import {Popover,PopoverContent,PopoverTrigger,} from "@/components/ui/popover";
import {
  useCreateStaff,
  useDeleteStaff,
  useEditStaff,
  // @ts-ignore
  useFetchDashboardOverview,
  useFetchStaffs,
} from "@/hooks/useStaff";
import { Permission, RolePayload, Staff } from "@/types";
import {
  useFetchAllPermissions,
  useUpdatePermission,
} from "@/hooks/usePermissions";
import { getPermissionColor } from "@/utils/getPermissionColor";
import { useAssignRole, useFetchRoles } from "@/hooks/useRole";
// @ts-ignore
import { deriveStaffPermissions } from "@/utils/deriveStaffPermission";
import { Skeleton } from "@/components/ui/skeleton";

// Define the staff member type
interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  joinedDate: string;
  lastActive: string;
}

export default function StaffManagementPage() {
  const { data: staffs, isLoading } = useFetchStaffs();
  const { data: roles } = useFetchRoles();
  const { data: permissions } = useFetchAllPermissions();
  const { mutate: createStaff, isPending: isCreateStaffPending } =
    useCreateStaff();
  const { mutate: editStaff, isPending: isEditStaffPending } = useEditStaff();
  const { mutate: deleteStaff, isPending: isStaffDeleting } = useDeleteStaff();
  const { mutate: editStaffRole, isPending: isStaffRoleEditing } =
    useAssignRole();
  const { mutate: updateStaffPermission, isPending: isPermissionUpdating } =
    useUpdatePermission();

  // @ts-ignore
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
  const [showEditStaffDialog, setShowEditStaffDialog] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [newStaffData, setNewStaffData] = useState<{
    name: string;
    email: string;
    phone: string;
    role: string;
    id?: string;
    status?: "active" | "inactive";
  }>({
    name: "",
    email: "",
    phone: "",
    role: "",
    id: "",
    status: "active",
  });
  const [availablePermissions, setAvailablePermissions] = useState([]);
  // @ts-ignore
  const [staffPermissions, setStaffPermissions] = useState({
    viewDashboard: false,
    viewUsers: false,
    viewTransactions: false,
    viewAnalytics: false,
    editUsers: false,
    editTransactions: false,
    manageStaff: false,
    manageSettings: false,
  });

  const { toast } = useToast();

  // Filter staff members based on search term
  const filteredStaffMembers = staffs?.filter(
    (staff) =>
      staff.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setNewStaffData({
      name: "",
      email: "",
      phone: "",
      role: "",
    });
  };

  const handleAddStaff = () => {
    if (!newStaffData.name || !newStaffData.email || !newStaffData.role) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields",
      });
      return;
    }

    try {
      const firstname = newStaffData.name.split(" ")[0];
      const lastname = newStaffData.name.split(" ")[1];

      const roleID = roles.find(
        (r: RolePayload) => r.name === newStaffData.role
      );

      if (roleID) {
        const newStaffDetails = {
          email: newStaffData.email,
          firstname,
          lastname,
          phone: newStaffData.phone,
          role: roleID.id,
        };

        createStaff(newStaffDetails, {
          // @ts-ignore
          onSuccess: (response: any) => {
            // console.log(response);
            setShowAddStaffDialog(false);
            resetForm();

            toast({
              title: "Staff added",
              description: `${newStaffData.name} has been added to the team`,
            });
          },
          onError: (error: any) => {
            resetForm();
            toast({
              title: "Error",
              description:
                error?.response?.data?.message || "Failed to add staff",
              variant: "destructive",
            });
          },
        });
      }
    } catch (error) {
      resetForm();
      console.error(error);
    } finally {
      // resetForm();
    }
  };

  const handleEditStaff = () => {
    if (!newStaffData.name || !newStaffData.email) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields",
      });
      return;
    }

    try {
      const firstname = newStaffData.name.split(" ")[0];
      const lastname = newStaffData.name.split(" ")[1];

      const roleID = roles.find(
        (r: RolePayload) => r.name === newStaffData.role
      );

      if (roleID) {
        const newStaffDetails = {
          email: newStaffData.email,
          firstname,
          lastname,
          phone: newStaffData.phone,
        };

        const staffID = newStaffData.id;

        editStaff(
          { id: staffID!!, data: newStaffDetails },
          {
            // @ts-ignore
            onSuccess: (response: any) => {
              setShowAddStaffDialog(false);
              resetForm();
              setShowEditStaffDialog(false);

              toast({
                title: "Staff Edited",
                description: `${newStaffData.name} has been edited`,
              });
            },
            onError: (error: any) => {
              toast({
                title: "Error",
                description:
                  error?.response?.data?.message || "Failed to edit staff",
                variant: "destructive",
              });
            },
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditStaffRole = () => {
    try {
      const roleID = roles.find(
        (r: RolePayload) => r.name === newStaffData.role
      );

      if (roleID) {
        const newStaffDetails = {
          role: roleID.id,
          id: newStaffData.id!!,
        };

        editStaffRole(
          { staffId: newStaffDetails.id, role_id: newStaffDetails.role },
          {
            // @ts-ignore
            onSuccess: (response: any) => {
              setShowRoleDialog(false);
              resetForm();
              setShowRoleDialog(false);

              toast({
                title: "Role Edited",
                description: `${newStaffData.name} role has been edited`,
              });
            },
            onError: (error: any) => {
              toast({
                title: "Error",
                description:
                  error?.response?.data?.message || "Failed to edit role",
                variant: "destructive",
              });
            },
          }
        );
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleToggleStatus = (
    staffId: string,
    checked: boolean,
    staff: any
  ) => {
    setEditingStaffId(staffId);
    const newStatus = checked ? "active" : "inactive";

    const newStaffDetails = {
      firstname: staff.firstname,
      lastname: staff.lastname,
      email: staff.email,
      status: newStatus,
    };

    editStaff(
      { id: staffId, data: newStaffDetails },
      {
        // @ts-ignore
        onSuccess: (response: any) => {
          resetForm();
          setEditingStaffId(null);
          toast({
            title: `Staff ${
              staff.status === "active" ? "deactivated" : "activated"
            }`,
            description: `${
              staff.firstname + " " + staff.lastname
            }'s account has been ${
              staff.status === "active" ? "deactivated" : "activated"
            }`,
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error?.response?.data?.message || "Failed to edit staff status",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDeleteStaff = (staff: any) => {
    const staffID = staff.id;

    try {
      deleteStaff(staffID, {
        onSuccess: (response: any) => {
          resetForm();
          toast({
            title: "Staff removed",
            description: response.message || "staff removed successfully",
          });
        },
        onError: (error: any) => {
          console.error("Error deleting staff:", error);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-5 w-40" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-60 mt-2" />
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Skeleton className="h-4 w-10" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-10" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-10" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="ml-3">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32 mt-1" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-48" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEditDialog = (staff: any) => {
    setNewStaffData({
      name: staff.firstname + " " + staff.lastname,
      email: staff.email,
      phone: staff.phone,
      role: staff.role.name,
      id: staff.id,
    });
    // open the modal
    setShowEditStaffDialog(true);
  };

  // role dialog
  const handleRoleDialog = (staff: any) => {
    setNewStaffData({
      name: staff.firstname + " " + staff.lastname,
      email: staff.email,
      phone: staff.phone,
      role: staff.role.name,
      id: staff.id,
    });
    // open the modal
    setShowRoleDialog(true);
  };

  const handleTogglePermission = (permission: Permission, checked: boolean) => {
    setSelectedStaff((prev) => {
      if (!prev) return prev;

      const updatedPermissions = checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter((p) => p.id !== permission.id);

      return { ...prev, permissions: updatedPermissions };
    });
  };

  const handleManagePermissions = () => {
    try {
      if (selectedStaff) {
        const staffId = selectedStaff.id;

        const permissionsId = selectedStaff.permissions
          .map((p: Permission) => p.id)
          .filter((id): id is string => typeof id === "string");

        updateStaffPermission(
          { id: staffId, payload: { permissions: permissionsId } },
          {
            // @ts-ignore
            onSuccess: (response: any) => {
              setShowPermissionsDialog(false);
              toast({
                title: "Permissions updated",
                description: selectedStaff
                  ? `Updated permissions for ${selectedStaff.fullname}`
                  : "Permissions have been updated",
              });
              setSelectedStaff(null);
            },
            onError: (error: any) => {
              toast({
                title: "Error",
                description:
                  error?.response?.data?.message ||
                  "Failed to update permissions",
                variant: "destructive",
              });
            },
          }
        );
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Manage Staff</h2>
        <Dialog open={showAddStaffDialog} onOpenChange={setShowAddStaffDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              <span>Add Staff</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-screen overflow-y-auto hide-scrollbar">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
              <DialogDescription>
                Add a new staff member to your team with appropriate role and
                permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newStaffData.name}
                  onChange={(e) =>
                    setNewStaffData({ ...newStaffData, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={newStaffData.email}
                  onChange={(e) =>
                    setNewStaffData({ ...newStaffData, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="07000000000"
                  value={newStaffData.phone}
                  onChange={(e) =>
                    setNewStaffData({ ...newStaffData, phone: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newStaffData.role}
                  onValueChange={(value) => {
                    const selectedRole = roles.find(
                      (r: RolePayload) => r.name === value
                    );
                    setNewStaffData({ ...newStaffData, role: value });

                    if (!selectedRole) return;

                    setAvailablePermissions(selectedRole.permissions);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles?.map((role: RolePayload) => (
                      <SelectItem
                        value={role.name}
                        key={role.name}
                        className="capitalize"
                      >
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {availablePermissions && newStaffData.role && (
                <div className="space-y-4">
                  <Label htmlFor="role">Permissions</Label>
                  {availablePermissions.map((permission: Permission) => (
                    <div
                      className="flex items-center justify-between space-x-2"
                      key={permission.id}
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={true}
                          // disabled={true}
                        />
                        <Label
                          htmlFor={permission.id}
                          className={"cursor-not-allowed"}
                        >
                          {permission.resource}
                        </Label>
                      </div>
                      <span
                        className={`text-xs ${getPermissionColor(
                          permission.action || ""
                        )} bg-blue-100 rounded-full px-4 py-1`}
                      >
                        {permission.action}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAddStaffDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddStaff}
                disabled={isCreateStaffPending}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreateStaffPending ? "Adding..." : "Add Staff"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Staff Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="p-4 flex-1">
                <div className="text-gray-500 text-sm font-medium mb-1">
                  All Staff
                </div>

                <div className="text-3xl font-bold">{staffs?.length}</div>
                <div className="text-sm text-gray-500 mt-1">Team members</div>
              </div>
              <div className="bg-blue-50 p-4 flex items-center justify-center h-full">
                <UsersIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="p-4 flex-1">
                <div className="text-gray-500 text-sm font-medium mb-1">
                  Active Staff
                </div>
                <div className="text-3xl font-bold">
                  {staffs?.filter((s) => s.status === "active").length}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Currently active
                </div>
              </div>
              <div className="bg-green-50 p-4 flex items-center justify-center h-full">
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="p-4 flex-1">
                <div className="text-gray-500 text-sm font-medium mb-1">
                  Inactive Staff
                </div>
                <div className="text-3xl font-bold">
                  {staffs?.filter((s) => s.status === "inactive").length}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Currently inactive
                </div>
              </div>
              <div className="bg-gray-50 p-4 flex items-center justify-center h-full">
                <UserX className="h-8 w-8 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permissions Dialog */}
      <Dialog
        open={showPermissionsDialog}
        onOpenChange={setShowPermissionsDialog}
      >
        <DialogContent className="max-h-screen overflow-y-auto hide-scrollbar">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Manage Staff Permissions
            </DialogTitle>
            <DialogDescription>
              {selectedStaff && (
                <span>
                  Configure access permissions for{" "}
                  <span className="font-medium">{selectedStaff.fullname}</span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              {permissions?.map((permission: Permission) => {
                const isChecked = selectedStaff?.permissions.some(
                  (p) => p.id === permission.id
                );

                return (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between space-x-2"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={permission.id}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleTogglePermission(permission, !!checked)
                        }
                      />
                      <Label htmlFor={permission.id}>
                        {permission.resource}
                      </Label>
                    </div>
                    <span
                      className={`text-xs ${getPermissionColor(
                        permission.action || ""
                      )} bg-blue-100 rounded-full px-4 py-1`}
                    >
                      {permission.action}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPermissionsDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleManagePermissions}
              disabled={isPermissionUpdating}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPermissionUpdating ? "Saving..." : " Save Permissions"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* edit profile Dialog */}
      <Dialog
        open={showEditStaffDialog}
        onOpenChange={(open) => {
          setShowEditStaffDialog(open);
        }}
      >
        <DialogContent className="max-h-screen overflow-y-auto hide-scrollbar">
          <DialogHeader>
            <DialogTitle>Edit Staff Profile</DialogTitle>
            <DialogDescription>
              Update the staff member’s details and permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newStaffData.name || ""}
                onChange={(e) =>
                  setNewStaffData({
                    ...newStaffData,
                    name: e.target.value,
                  })
                }
              />
            </div>

            {/* Email Field */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={newStaffData.email || ""}
                onChange={(e) =>
                  setNewStaffData({
                    ...newStaffData,
                    email: e.target.value,
                  })
                }
              />
            </div>

            {/* Phone Field */}
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={newStaffData.phone || ""}
                onChange={(e) =>
                  setNewStaffData({
                    ...newStaffData,
                    phone: e.target.value,
                  })
                }
              />
            </div>

            {/* Role Field */}
            {/* <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newStaffData.role}
                onValueChange={(value) => {
                  const selectedRole = roles.find(
                    (r: RolePayload) => r.name === value
                  );
                  setNewStaffData({
                    ...newStaffData,
                    role: value,
                  });
                  if (selectedRole) {
                    setAvailablePermissions(selectedRole.permissions);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles?.map((role: RolePayload) => (
                    <SelectItem key={role.name} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

            {/* {newStaffData.role && (
              <div className="space-y-4">
                {roles
                  .find((r: RolePayload) => r.name === newStaffData.role)
                  ?.permissions.map((permission: Permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox id={permission.id} checked={true} />
                        <Label
                          htmlFor={permission.id}
                          className={"cursor-not-allowed"}
                        >
                          {permission.resource}
                        </Label>
                      </div>
                      <span
                        className={`text-xs ${getPermissionColor(
                          permission.action || ""
                        )} bg-blue-100 rounded-full px-4 py-1`}
                      >
                        {permission.action}
                      </span>
                    </div>
                  ))}
              </div>
            )} */}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditStaffDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditStaff}
              disabled={isEditStaffPending}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditStaffPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* edit role Dialog */}
      <Dialog
        open={showRoleDialog}
        onOpenChange={(open) => {
          setShowRoleDialog(open);
        }}
      >
        <DialogContent className="max-h-screen overflow-y-auto hide-scrollbar">
          <DialogHeader>
            <DialogTitle>Edit Staff Role</DialogTitle>
            <DialogDescription>
              Update the staff member’s role and permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newStaffData.role}
                onValueChange={(value) => {
                  const selectedRole = roles.find(
                    (r: RolePayload) => r.name === value
                  );
                  setNewStaffData({
                    ...newStaffData,
                    role: value,
                  });
                  if (selectedRole) {
                    setAvailablePermissions(selectedRole.permissions);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles?.map((role: RolePayload) => (
                    <SelectItem key={role.name} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newStaffData.role && (
              <div className="space-y-4">
                {roles
                  .find((r: RolePayload) => r.name === newStaffData.role)
                  ?.permissions.map((permission: Permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox id={permission.id} checked={true} />
                        <Label
                          htmlFor={permission.id}
                          className={"cursor-not-allowed"}
                        >
                          {permission.resource}
                        </Label>
                      </div>
                      <span
                        className={`text-xs ${getPermissionColor(
                          permission.action || ""
                        )} bg-blue-100 rounded-full px-4 py-1`}
                      >
                        {permission.action}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditStaffRole}
              disabled={isStaffRoleEditing}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isStaffRoleEditing ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Staff Members</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search staff..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {staffs && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  {/* <TableHead>Last Active</TableHead> */}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaffMembers?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      No staff members found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaffMembers?.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar
                            className={getColorFromString(staff.fullname)}
                          >
                            <AvatarFallback>
                              {getInitials(staff.fullname)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{staff.fullname}</span>
                        </div>
                      </TableCell>
                      <TableCell>{staff.email}</TableCell>
                      <TableCell>{staff.role.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            staff.status === "active" ? "default" : "secondary"
                          }
                          className={
                            staff.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {staff.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(staff.created_at)}</TableCell>
                      {/* <TableCell>
                        {formatDate(staff.created_at, "short")}
                      </TableCell> */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Switch
                            checked={staff.status === "active"}
                            disabled={editingStaffId === staff.id}
                            onCheckedChange={(checked) =>
                              handleToggleStatus(staff.id, checked, staff)
                            }
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedStaff(staff);
                                  setShowPermissionsDialog(true);
                                }}
                                className="cursor-pointer"
                              >
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Manage Permissions
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedStaff(staff);
                                  handleRoleDialog(staff);
                                }}
                                className="cursor-pointer"
                              >
                                <Tag className="mr-2 h-4 w-4" />
                                Manage Roles
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  handleEditDialog(staff);
                                }}
                                className="cursor-pointer"
                              >
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit Profile
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleDeleteStaff(staff)}
                                disabled={isStaffDeleting}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Staff Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
