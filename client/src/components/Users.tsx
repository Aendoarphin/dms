import { Search, UsersIcon, Calendar, Mail, CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers } from "@/hooks/useUsers";
import { useAdmins } from "@/hooks/useAdmins";
import Loading from "@/components/Loading";
import { Link } from "react-router";

export default function Users() {
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const { admins, loading: adminsLoading, error: adminsError } = useAdmins();

  const isAdmin = (userId: string) => {
    return admins?.some((admin) => admin.user_id === userId);
  };

  const allUsers = [
    ...users.map((user) => ({
      id: user.id,
      name: user.user_metadata.firstName + " " + user.user_metadata.lastName,
      email: user.email,
      created: user.created_at,
      lastSignIn: user.last_sign_in_at,
      role: isAdmin(user.id) ? "Admin" : "User",
    })),
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  // Loading state
  if (usersLoading || adminsLoading) {
    return <Loading />;
  }

  // Error state
  if (usersError || adminsError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">
            Error: {usersError || adminsError}
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="p-6 lg:p-8">
        <div className="flex flex-col space-y-6 max-w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">Users</h1>
              <p className="text-muted-foreground">
                Manage all users in the system
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="w-full lg:w-[300px] pl-8"
                />
              </div>
              <Link to={"new"} className="cursor-pointer"><Button>Add User</Button></Link>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-4 bg-muted rounded-lg">
            <div className="flex flex-wrap gap-2">
              <Button variant="default" size="sm" className="h-8">
                All Users
                <Badge variant="secondary" className="ml-2">
                  {allUsers.length}
                </Badge>
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                Admins
                <Badge variant="secondary" className="ml-2">
                  {allUsers.filter((u) => u.role === "Admin").length}
                </Badge>
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                Users
                <Badge variant="secondary" className="ml-2">
                  {allUsers.filter((u) => u.role === "User").length}
                </Badge>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Select defaultValue="newest">
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="email">Email A-Z</SelectItem>
                  <SelectItem value="last-signin">Last Sign In</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {allUsers.length} users
            </p>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <UsersIcon className="h-5 w-5" />
                <CardTitle>System Users</CardTitle>
              </div>
              <CardDescription>
                Complete list of all registered users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">
                      <div className="flex items-center space-x-2">
                        <CircleUser className="h-4 w-4" />
                        <span>Name</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[300px]">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Created</span>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Last Sign In</span>
                      </div>
                    </TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="font-medium">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(user.created)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(user.lastSignIn as string)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={"secondary"}>
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2 pt-4">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="default" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
