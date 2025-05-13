import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, getColorFromString, formatDate } from "@/lib/utils";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { 
  UserPlus, 
  Edit2, 
  Trash2, 
  Search, 
  UserCog, 
  ShieldCheck, 
  Users as UsersIcon, 
  UserCheck, 
  UserX, 
  MoreHorizontal,
  Check
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define the staff member type
interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinedDate: string;
  lastActive: string;
}

// Mock data for staff members
const mockStaffMembers: StaffMember[] = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@rojifi.com",
    role: "Administrator",
    status: "active",
    joinedDate: "2023-01-15",
    lastActive: "2023-05-12T14:32:00",
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah@rojifi.com",
    role: "Manager",
    status: "active",
    joinedDate: "2023-02-10",
    lastActive: "2023-05-12T10:15:00",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael@rojifi.com",
    role: "Support Agent",
    status: "inactive",
    joinedDate: "2023-02-25",
    lastActive: "2023-05-05T09:10:00",
  },
  {
    id: 4,
    name: "Jessica Taylor",
    email: "jessica@rojifi.com",
    role: "Data Analyst",
    status: "active",
    joinedDate: "2023-03-05",
    lastActive: "2023-05-11T11:45:00",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david@rojifi.com",
    role: "Viewer",
    status: "active",
    joinedDate: "2023-03-15",
    lastActive: "2023-05-10T16:22:00",
  }
];

export default function StaffManagementPage() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [newStaffData, setNewStaffData] = useState({
    name: "",
    email: "",
    role: "Viewer",
  });
  const [staffPermissions, setStaffPermissions] = useState<Record<string, boolean>>({
    viewDashboard: true,
    viewUsers: true,
    viewTransactions: true,
    viewAnalytics: false,
    editUsers: false,
    editTransactions: false,
    manageStaff: false,
    manageSettings: false,
  });
  const { toast } = useToast();

  // Simulate loading staff data
  useEffect(() => {
    const timer = setTimeout(() => {
      setStaffMembers(mockStaffMembers);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter staff members based on search term
  const filteredStaffMembers = staffMembers.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaff = () => {
    if (!newStaffData.name || !newStaffData.email || !newStaffData.role) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields",
      });
      return;
    }
    
    // In a real app, this would make an API call
    const newStaff: StaffMember = {
      id: staffMembers.length + 1,
      name: newStaffData.name,
      email: newStaffData.email,
      role: newStaffData.role,
      status: "active",
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString(),
    };
    
    setStaffMembers([...staffMembers, newStaff]);
    setShowAddStaffDialog(false);
    setNewStaffData({ name: "", email: "", role: "Viewer" });
    
    toast({
      title: "Staff added",
      description: `${newStaff.name} has been added to the team`,
    });
  };

  const handleToggleStatus = (id: number) => {
    setStaffMembers(staffMembers.map(staff => 
      staff.id === id 
        ? { ...staff, status: staff.status === 'active' ? 'inactive' : 'active' } 
        : staff
    ));
    
    const staff = staffMembers.find(s => s.id === id);
    if (staff) {
      toast({
        title: `Staff ${staff.status === 'active' ? 'deactivated' : 'activated'}`,
        description: `${staff.name}'s account has been ${staff.status === 'active' ? 'deactivated' : 'activated'}`,
      });
    }
  };

  const handleDeleteStaff = (id: number) => {
    const staff = staffMembers.find(s => s.id === id);
    setStaffMembers(staffMembers.filter(staff => staff.id !== id));
    
    if (staff) {
      toast({
        title: "Staff removed",
        description: `${staff.name} has been removed from the team`,
      });
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
              <DialogDescription>
                Add a new staff member to your team with appropriate role and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter full name"
                  value={newStaffData.name}
                  onChange={(e) => setNewStaffData({...newStaffData, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="email@example.com"
                  value={newStaffData.email}
                  onChange={(e) => setNewStaffData({...newStaffData, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={newStaffData.role}
                  onValueChange={(value) => {
                    setNewStaffData({...newStaffData, role: value});
                    // Set default permissions based on role
                    if (value === "Administrator") {
                      setStaffPermissions({
                        viewDashboard: true,
                        viewUsers: true,
                        viewTransactions: true,
                        viewAnalytics: true,
                        editUsers: true,
                        editTransactions: true,
                        manageStaff: true,
                        manageSettings: true,
                      });
                    } else if (value === "Manager") {
                      setStaffPermissions({
                        viewDashboard: true,
                        viewUsers: true,
                        viewTransactions: true,
                        viewAnalytics: true,
                        editUsers: true,
                        editTransactions: true,
                        manageStaff: false,
                        manageSettings: false,
                      });
                    } else {
                      setStaffPermissions({
                        viewDashboard: true,
                        viewUsers: true,
                        viewTransactions: true,
                        viewAnalytics: false,
                        editUsers: false,
                        editTransactions: false,
                        manageStaff: false,
                        manageSettings: false,
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrator">Administrator</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Support Agent">Support Agent</SelectItem>
                    <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <Label>Permissions</Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="viewDashboard" 
                        checked={staffPermissions.viewDashboard}
                        onCheckedChange={(checked) => setStaffPermissions({...staffPermissions, viewDashboard: !!checked})}
                      />
                      <Label htmlFor="viewDashboard">View Dashboard</Label>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-1">Basic</span>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="viewUsers" 
                        checked={staffPermissions.viewUsers}
                        onCheckedChange={(checked) => setStaffPermissions({...staffPermissions, viewUsers: !!checked})}
                      />
                      <Label htmlFor="viewUsers">View Users</Label>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-1">Basic</span>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="viewTransactions" 
                        checked={staffPermissions.viewTransactions}
                        onCheckedChange={(checked) => setStaffPermissions({...staffPermissions, viewTransactions: !!checked})}
                      />
                      <Label htmlFor="viewTransactions">View Transactions</Label>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-1">Basic</span>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="viewAnalytics" 
                        checked={staffPermissions.viewAnalytics}
                        onCheckedChange={(checked) => setStaffPermissions({...staffPermissions, viewAnalytics: !!checked})}
                      />
                      <Label htmlFor="viewAnalytics">View Analytics</Label>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-700 rounded-full px-2 py-1">Advanced</span>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="editUsers" 
                        checked={staffPermissions.editUsers}
                        onCheckedChange={(checked) => setStaffPermissions({...staffPermissions, editUsers: !!checked})}
                      />
                      <Label htmlFor="editUsers">Edit Users</Label>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-700 rounded-full px-2 py-1">Advanced</span>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="editTransactions" 
                        checked={staffPermissions.editTransactions}
                        onCheckedChange={(checked) => setStaffPermissions({...staffPermissions, editTransactions: !!checked})}
                      />
                      <Label htmlFor="editTransactions">Edit Transactions</Label>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-700 rounded-full px-2 py-1">Advanced</span>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="manageStaff" 
                        checked={staffPermissions.manageStaff}
                        onCheckedChange={(checked) => setStaffPermissions({...staffPermissions, manageStaff: !!checked})}
                      />
                      <Label htmlFor="manageStaff">Manage Staff</Label>
                    </div>
                    <span className="text-xs bg-red-100 text-red-700 rounded-full px-2 py-1">Admin</span>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="manageSettings" 
                        checked={staffPermissions.manageSettings}
                        onCheckedChange={(checked) => setStaffPermissions({...staffPermissions, manageSettings: !!checked})}
                      />
                      <Label htmlFor="manageSettings">Manage Settings</Label>
                    </div>
                    <span className="text-xs bg-red-100 text-red-700 rounded-full px-2 py-1">Admin</span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddStaffDialog(false)}>Cancel</Button>
              <Button onClick={handleAddStaff}>Add Staff</Button>
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
                <div className="text-gray-500 text-sm font-medium mb-1">All Staff</div>
                <div className="text-3xl font-bold">{staffMembers.length}</div>
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
                <div className="text-gray-500 text-sm font-medium mb-1">Active Staff</div>
                <div className="text-3xl font-bold">
                  {staffMembers.filter(s => s.status === 'active').length}
                </div>
                <div className="text-sm text-gray-500 mt-1">Currently active</div>
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
                <div className="text-gray-500 text-sm font-medium mb-1">Inactive Staff</div>
                <div className="text-3xl font-bold">
                  {staffMembers.filter(s => s.status === 'inactive').length}
                </div>
                <div className="text-sm text-gray-500 mt-1">Currently inactive</div>
              </div>
              <div className="bg-gray-50 p-4 flex items-center justify-center h-full">
                <UserX className="h-8 w-8 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permissions Dialog */}
      <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Manage Staff Permissions
            </DialogTitle>
            <DialogDescription>
              {selectedStaff && (
                <span>Configure access permissions for <span className="font-medium">{selectedStaff.name}</span></span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="viewDashboard" 
                    checked={staffPermissions.viewDashboard}
                    onCheckedChange={(checked) => setStaffPermissions({...staffPermissions, viewDashboard: !!checked})}
                  />
                  <Label htmlFor="viewDashboard">View Dashboard</Label>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-1">Basic</span>
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="viewUsers" 
                    checked={staffPermissions.viewUsers}
                    onCheckedChange={(checked) => setStaffPermissions({...staffPermissions, viewUsers: !!checked})}
                  />
                  <Label htmlFor="viewUsers">View Users</Label>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-1">Basic</span>
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="viewTransactions" 
                    checked={staffPermissions.viewTransactions}
                    onCheckedChange={(checked) => setStaffPermissions({...staffPermissions, viewTransactions: !!checked})}
                  />
                  <Label htmlFor="viewTransactions">View Transactions</Label>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-1">Basic</span>
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="viewAnalytics" 
                    checked={staffPermissions.viewAnalytics}
                    onCheckedChange={(checked) => setStaffPermissions({...staffPermissions, viewAnalytics: !!checked})}
                  />
                  <Label htmlFor="viewAnalytics">View Analytics</Label>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-700 rounded-full px-2 py-1">Advanced</span>
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="editUsers" 
                    checked={staffPermissions.editUsers}
                    onCheckedChange={(checked) => setStaffPermissions({...staffPermissions, editUsers: !!checked})}
                  />
                  <Label htmlFor="editUsers">Edit Users</Label>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-700 rounded-full px-2 py-1">Advanced</span>
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="editTransactions" 
                    checked={staffPermissions.editTransactions}
                    onCheckedChange={(checked) => setStaffPermissions({...staffPermissions, editTransactions: !!checked})}
                  />
                  <Label htmlFor="editTransactions">Edit Transactions</Label>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-700 rounded-full px-2 py-1">Advanced</span>
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="manageStaff" 
                    checked={staffPermissions.manageStaff}
                    onCheckedChange={(checked) => setStaffPermissions({...staffPermissions, manageStaff: !!checked})}
                  />
                  <Label htmlFor="manageStaff">Manage Staff</Label>
                </div>
                <span className="text-xs bg-red-100 text-red-700 rounded-full px-2 py-1">Admin</span>
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="manageSettings" 
                    checked={staffPermissions.manageSettings}
                    onCheckedChange={(checked) => setStaffPermissions({...staffPermissions, manageSettings: !!checked})}
                  />
                  <Label htmlFor="manageSettings">Manage Settings</Label>
                </div>
                <span className="text-xs bg-red-100 text-red-700 rounded-full px-2 py-1">Admin</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPermissionsDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              toast({
                title: "Permissions updated",
                description: selectedStaff ? `Updated permissions for ${selectedStaff.name}` : "Permissions have been updated",
              });
              setShowPermissionsDialog(false);
            }}>
              Save Permissions
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaffMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No staff members found
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaffMembers.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className={getColorFromString(staff.name)}>
                          <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                        </Avatar>
                        <span>{staff.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={staff.status === 'active' ? 'default' : 'secondary'}
                        className={staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {staff.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(staff.joinedDate)}</TableCell>
                    <TableCell>{formatDate(staff.lastActive, 'short')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Switch 
                          checked={staff.status === 'active'} 
                          onCheckedChange={() => handleToggleStatus(staff.id)}
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
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600 cursor-pointer"
                              onClick={() => handleDeleteStaff(staff.id)}
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
        </CardContent>
      </Card>
    </motion.div>
  );
}