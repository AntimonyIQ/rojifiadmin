import { useState } from "react";
import { motion } from "framer-motion";
import UsersTable from "@/components/users/UsersTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users as UsersIcon, UserCheck, UserX } from "lucide-react";
import { useFetchUsers, useUserOverview } from "@/hooks/useUsers";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { data: users, isLoading } = useFetchUsers(page);
  const { data: usersOverviewData } = useUserOverview();

  if (isLoading && !users) {
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
                  {usersOverviewData && usersOverviewData.total_users}
                </p>
              </div>
              <div className="h-12 w-12 bg-primary-50 rounded-full flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
            {/* <div className="mt-4 flex items-center text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">12%</span>
              <span className="ml-1">from last month</span>
            </div> */}
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
                  {usersOverviewData && usersOverviewData.active_users}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
            {/* <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="text-green-500 font-medium">
                {users && users.length > 0
                  ? Math.round((userStats.active / userStats.total) * 100)
                  : 0}
                %
              </span>
              <span className="ml-1">of total users</span>
            </div> */}
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
                  {usersOverviewData && usersOverviewData.inactive_users}
                </p>
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                <UserX className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            {/* <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="text-gray-600 font-medium">
                {users && users.length > 0
                  ? Math.round((userStats.inactive / userStats.total) * 100)
                  : 0}
                %
              </span>
              <span className="ml-1">of total users</span>
            </div> */}
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}

      <UsersTable
        users={users?.users || []}
        loading={isLoading}
        total={users?.metadata?.total || 0}
        currentPage={page}
        onPageChange={setPage}
      />
    </motion.div>
  );
}
