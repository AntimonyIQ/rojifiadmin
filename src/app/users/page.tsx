import { motion } from "framer-motion";
import UsersTable from "@/components/users/UsersTable";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Users as UsersIcon, UserCheck, UserX, TrendingUp } from "lucide-react";
import { User } from "@/types";
import { useFetchUsers } from "@/hooks/useUsers";

export default function UsersPage() {
  const { data: users, isLoading } = useFetchUsers();

  // Calculate user statistics
  const calculateUserStats = (users: User[] = []) => {
    const total = users.length;
    const active = users.filter((user) => user.status === "active").length;
    const inactive = users.filter((user) => user.status === "inactive").length;

    return { total, active, inactive };
  };

  const userStats = calculateUserStats(users);

  if (isLoading && !users) {
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
      {/* User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Users Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {userStats.total}
                </p>
              </div>
              <div className="h-12 w-12 bg-primary-50 rounded-full flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">12%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Users Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Active Users
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {userStats.active}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="text-green-500 font-medium">
                {users && users.length > 0
                  ? Math.round((userStats.active / userStats.total) * 100)
                  : 0}
                %
              </span>
              <span className="ml-1">of total users</span>
            </div>
          </CardContent>
        </Card>

        {/* Inactive Users Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Inactive Users
                </p>
                <p className="text-3xl font-bold text-gray-600">
                  {userStats.inactive}
                </p>
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                <UserX className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="text-gray-600 font-medium">
                {users && users.length > 0
                  ? Math.round((userStats.inactive / userStats.total) * 100)
                  : 0}
                %
              </span>
              <span className="ml-1">of total users</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}

      <UsersTable users={users || []} loading={isLoading} />
    </motion.div>
  );
}
