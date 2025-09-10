import { IUser } from "@/interface/interface";
import { session, SessionData } from "@/session/session";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    User,
    Shield,
    Settings,
    Bell,
    Eye,
    EyeOff,
    Key,
    Mail,
    Calendar,
    MapPin,
    Phone,
    Building2,
    Clock,
    AlertTriangle,
    CheckCircle,
    Save
} from "lucide-react";

export default function SettingsPage() {
    const [admin, setAdmin] = useState<IUser | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const sd: SessionData = session.getUserData();

    useEffect(() => {
        if (sd && sd.user) {
            setAdmin(sd.user);
        }
    }, []);

    const formatDate = (date: Date | string | undefined) => {
        if (!date) return 'Not available';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            // Here you would typically make an API call to update the password
            console.log('Updating password...');
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            alert('Password updated successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Failed to update password');
        } finally {
            setIsLoading(false);
        }
    };

    const InfoItem = ({ icon: Icon, label, value, className = "" }: {
        icon: any,
        label: string,
        value: string | undefined,
        className?: string
    }) => (
        <div className={`flex items-start gap-3 ${className}`}>
            <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                <Icon className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700">{label}</p>
                <p className="text-sm text-gray-900 break-words">{value || 'Not specified'}</p>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 max-w-4xl mx-auto"
        >
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                    <p className="text-gray-500">Manage your account preferences and security settings</p>
                </div>
            </div>

            {/* Settings Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Preferences
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-600" />
                                Account Information
                            </CardTitle>
                            <CardDescription>
                                Your current account details and profile information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {admin ? (
                                <>
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold">
                                                {admin.firstname} {admin.lastname}
                                            </h3>
                                            <p className="text-gray-600">{admin.email}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="default" className="bg-green-100 text-green-800">
                                                    Admin
                                                </Badge>
                                                <Badge variant="outline">
                                                    Active
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="font-medium text-gray-900">Personal Information</h4>
                                            <InfoItem icon={User} label="Full Name" value={`${admin.firstname} ${admin.lastname}`} />
                                            <InfoItem icon={Mail} label="Email Address" value={admin.email} />
                                            <InfoItem icon={Phone} label="Phone Number" value={admin.phoneNumber} />
                                            <InfoItem icon={Calendar} label="Date of Birth" value={formatDate(admin.dateOfBirth)} />
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-medium text-gray-900">Account Details</h4>
                                            <InfoItem icon={Building2} label="Username" value={admin.username} />
                                            <InfoItem icon={MapPin} label="Country" value={admin.country} />
                                            <InfoItem icon={Clock} label="Account Created" value={formatDate(admin.createdAt)} />
                                            <InfoItem icon={Clock} label="Last Updated" value={formatDate(admin.updatedAt)} />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Unable to load admin information</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-red-600" />
                                Security Settings
                            </CardTitle>
                            <CardDescription>
                                Manage your password and security preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Password Change Section */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                    <Key className="h-4 w-4" />
                                    Change Password
                                </h4>

                                <div className="space-y-4 max-w-md">
                                    <div className="space-y-2">
                                        <Label htmlFor="current-password">Current Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="current-password"
                                                type={showPassword ? "text" : "password"}
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                                placeholder="Enter current password"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">New Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="new-password"
                                                type={showNewPassword ? "text" : "password"}
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                                placeholder="Enter new password"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="confirm-password"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                placeholder="Confirm new password"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handlePasswordChange}
                                        disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                                        className="w-full"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                Updating Password...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Update Password
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            {/* Security Status */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">Security Status</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="font-medium text-sm">Password Protection</p>
                                                <p className="text-xs text-gray-500">Your account is secured with a password</p>
                                            </div>
                                        </div>
                                        <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                                            <div>
                                                <p className="font-medium text-sm">Two-Factor Authentication</p>
                                                <p className="text-xs text-gray-500">Add an extra layer of security</p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary">Not Enabled</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-blue-600" />
                                Notification Preferences
                            </CardTitle>
                            <CardDescription>
                                Configure how you receive notifications and alerts
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8">
                                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 mb-2">Notification settings coming soon</p>
                                <p className="text-sm text-gray-400">Configure email alerts, push notifications, and more</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5 text-purple-600" />
                                Application Preferences
                            </CardTitle>
                            <CardDescription>
                                Customize your application experience and interface
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8">
                                <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 mb-2">Preferences panel coming soon</p>
                                <p className="text-sm text-gray-400">Theme settings, language preferences, and more</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
}
