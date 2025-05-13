import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { saveGeneralSettings } from "@/services/api";

const formSchema = z.object({
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  contactEmail: z.string().email({ message: "Please enter a valid email address." }),
  supportPhone: z.string().min(10, { message: "Please enter a valid phone number." }),
  timezone: z.string().min(1, { message: "Please select a timezone." }),
  dateFormat: z.string().min(1, { message: "Please select a date format." }),
  emailNotifications: z.boolean().default(false),
  marketingEmails: z.boolean().default(false),
  termsAndConditions: z.string().min(1, { message: "Terms and conditions are required." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function GeneralSettingsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const defaultValues: FormValues = {
    companyName: "Rojifi Inc.",
    contactEmail: "contact@rojifi.com",
    supportPhone: "+1 (555) 123-4567",
    timezone: "UTC-5",
    dateFormat: "MM/DD/YYYY",
    emailNotifications: true,
    marketingEmails: false,
    termsAndConditions: "These are the standard terms and conditions for Rojifi platform usage.",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: saveGeneralSettings,
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Your general settings have been updated successfully",
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 px-6 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">General Information</h3>
            <p className="text-sm text-gray-500">
              Configure your company details and general application settings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormDescription>
                    This email will be used for system notifications
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supportPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Timezone</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">UTC</SelectItem>
                      <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                      <SelectItem value="UTC+2">Eastern European Time (UTC+2)</SelectItem>
                      <SelectItem value="UTC+5:30">Indian Standard Time (UTC+5:30)</SelectItem>
                      <SelectItem value="UTC+8">China Standard Time (UTC+8)</SelectItem>
                      <SelectItem value="UTC+9">Japan Standard Time (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 pt-4">
            <h3 className="text-lg font-medium">Display Preferences</h3>
            <p className="text-sm text-gray-500">
              Configure how dates and other information are displayed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dateFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Format</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      <SelectItem value="MMM D, YYYY">MMM D, YYYY</SelectItem>
                      <SelectItem value="D MMM YYYY">D MMM YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 pt-4">
            <h3 className="text-lg font-medium">Notification Settings</h3>
            <p className="text-sm text-gray-500">
              Configure your email notification preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Email Notifications</FormLabel>
                    <FormDescription>
                      Receive email notifications for important system events
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

            <FormField
              control={form.control}
              name="marketingEmails"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Marketing Emails</FormLabel>
                    <FormDescription>
                      Receive emails about product updates and features
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

          <div className="space-y-2 pt-4">
            <h3 className="text-lg font-medium">Legal</h3>
            <p className="text-sm text-gray-500">
              Manage the legal information for your application.
            </p>
          </div>

          <FormField
            control={form.control}
            name="termsAndConditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terms and Conditions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your terms and conditions"
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
