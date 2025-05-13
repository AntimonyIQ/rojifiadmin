import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, UserPlus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, getColorFromString } from "@/lib/utils";

// Staff member schema
const staffMemberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.string().min(1, { message: "Please select a role" }),
  permissions: z.array(z.string()),
  active: z.boolean().default(true),
});

const formSchema = z.object({
  staffMembers: z.array(staffMemberSchema),
});

type FormValues = z.infer<typeof formSchema>;

// Mock API function - in a real app, this would be in your api.ts file
const saveStaffSettings = async (data: FormValues) => {
  // This would be a real API call in production
  console.log("Saving staff settings:", data);
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

export default function StaffManagementForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const roleOptions = [
    { value: "admin", label: "Administrator" },
    { value: "manager", label: "Manager" },
    { value: "agent", label: "Support Agent" },
    { value: "analyst", label: "Data Analyst" },
    { value: "viewer", label: "Viewer (Read-only)" },
  ];

  const defaultValues: FormValues = {
    staffMembers: [
      {
        id: "staff-1",
        name: "Alex Johnson",
        email: "alex@rojifi.com",
        role: "admin",
        permissions: ["view", "edit", "delete", "admin"],
        active: true,
      },
      {
        id: "staff-2",
        name: "Sarah Williams",
        email: "sarah@rojifi.com",
        role: "manager",
        permissions: ["view", "edit"],
        active: true,
      },
      {
        id: "staff-3",
        name: "Michael Chen",
        email: "michael@rojifi.com",
        role: "agent",
        permissions: ["view"],
        active: false,
      },
    ],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "staffMembers",
  });

  const mutation = useMutation({
    mutationFn: saveStaffSettings,
    onSuccess: () => {
      toast({
        title: "Staff settings saved",
        description: "Your staff management settings have been updated successfully",
      });
      setIsLoading(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error saving settings",
        description: "There was a problem saving your settings. Please try again.",
      });
      setIsLoading(false);
    },
  });

  function onSubmit(data: FormValues) {
    setIsLoading(true);
    mutation.mutate(data);
  }

  function addNewStaffMember() {
    append({
      name: "",
      email: "",
      role: "viewer",
      permissions: ["view"],
      active: true,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 px-6 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Staff Management</h3>
            <p className="text-sm text-gray-500">
              Manage staff members and their access permissions to the admin dashboard.
            </p>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Staff Members</h3>
                <p className="text-sm text-gray-500">
                  Add or remove staff members and set their roles and permissions.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewStaffMember}
                className="flex items-center gap-1"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Staff</span>
              </Button>
            </div>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar className={getColorFromString(field.name || "User")}>
                    <AvatarFallback>{getInitials(field.name || "User")}</AvatarFallback>
                  </Avatar>
                  <h4 className="font-medium">{field.name || "New Staff Member"}</h4>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`staffMembers.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`staffMembers.${index}.email`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="email@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`staffMembers.${index}.role`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roleOptions.map(role => (
                            <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Determines the level of access and permissions
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`staffMembers.${index}.active`}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <FormDescription>
                          Deactivate to temporarily revoke access
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-end px-6 py-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}