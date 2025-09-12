import {
  Search,
  UsersIcon,
  Calendar,
  Mail,
  CircleUser,
  Pencil,
  Trash,
} from "lucide-react";
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
import { Link, useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { toasterStyle } from "@/static";
import Loader from "./Loader";

export default function Users() {
  const [refresh, setRefresh] = useState(false);
  const [currentUser] = useState(
    JSON.parse(localStorage.getItem(`sb-${import.meta.env.VITE_SUPABASE_PROJECT_ID}-auth-token`) || "")
  );
  const [loading, setLoading] = useState(false);
  const [categoryValue, setCategoryValue] = useState("all");
  const [sortValue, setSortValue] = useState("email");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const { users, error: usersError } = useUsers(refresh);
  const { admins, error: adminsError } = useAdmins();

  // Show loader if users or admins data is not loaded yet
  if (!users || !admins) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader />
      </div>
    );
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

  const isAdmin = (userId: string) => {
    return admins?.some((admin) => admin.user_id === userId);
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  };

  const handleDeleteUser = async (userId: string) => {
    setLoading(true);
    const response = await axios.delete(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/user`,
      {
        data: { id: userId },
        headers,
      }
    );
    if (response.status === 200) {
      setRefresh((prev) => !prev);
      toast.success("User deleted successfully!", toasterStyle.success);
    } else {
      toast.error("Failed to delete user", toasterStyle.error);
    }
    setLoading(false);
  };

  const allUsers = users.map((user) => ({
    id: user.id,
    name: user.user_metadata.firstName + " " + user.user_metadata.lastName,
    email: user.email,
    created: user.created_at,
    lastSignIn: user.last_sign_in_at,
    role: isAdmin(user.id) ? "Admin" : "User",
  }));

  // Filter users based on search and category
  const filteredUsers = allUsers.filter((user) => {
    // Search filter
    const matchesSearch =
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory =
      categoryValue === "all" ||
      (categoryValue === "admins" && user.role === "Admin") ||
      (categoryValue === "users" && user.role === "User");

    return matchesSearch && matchesCategory;
  });

  // Sort users
  switch (sortValue) {
    case "newest":
      filteredUsers.sort((a, b) => {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      });
      break;
    case "oldest":
      filteredUsers.sort((a, b) => {
        return new Date(a.created).getTime() - new Date(b.created).getTime();
      });
      break;
    case "email":
      filteredUsers.sort((a, b) => {
        return a.email?.localeCompare(b.email || "") || 0;
      });
      break;
    case "last-signin":
      filteredUsers.sort((a, b) => {
        return (
          new Date(b.lastSignIn as string).getTime() -
          new Date(a.lastSignIn as string).getTime()
        );
      });
      break;
  }

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

  const getCategoryCount = (category: string) => {
    if (category === "all") return allUsers.length;
    if (category === "admins")
      return allUsers.filter((u) => u.role === "Admin").length;
    if (category === "users")
      return allUsers.filter((u) => u.role === "User").length;
    return 0;
  };

  const handleEditUser = (
    first: string,
    last: string,
    email: string,
    role: string,
    id: string
  ) => {
    navigate({
      pathname: "edit",
      search: `?first=${encodeURIComponent(first)}&last=${encodeURIComponent(
        last
      )}&email=${encodeURIComponent(email)}&role=${encodeURIComponent(
        role
      )}&id=${encodeURIComponent(id)}`,
    });
  };

  return allUsers.length === 0 ? (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader />
    </div>
  ) : (
    <div className="min-h-screen bg-background">
      <Toaster duration={5000} position="bottom-right" />
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link to={"new"}>
                <Button>Add User</Button>
              </Link>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-4 bg-card rounded-lg">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={categoryValue === "all" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setCategoryValue("all")}
              >
                All Users
                <Badge variant="secondary" className="ml-2">
                  {getCategoryCount("all")}
                </Badge>
              </Button>
              <Button
                variant={categoryValue === "admins" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setCategoryValue("admins")}
              >
                Admins
                <Badge variant="secondary" className="ml-2">
                  {getCategoryCount("admins")}
                </Badge>
              </Button>
              <Button
                variant={categoryValue === "users" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setCategoryValue("users")}
              >
                Users
                <Badge variant="secondary" className="ml-2">
                  {getCategoryCount("users")}
                </Badge>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Select defaultValue="email" onValueChange={setSortValue}>
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
              Showing {filteredUsers.length} users
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
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredUsers.map((user) => (
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
                      <TableCell className="flex justify-center space-x-1">
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() =>
                            handleEditUser(
                              user.name.split(" ")[0],
                              user.name.split(" ")[1],
                              user.email || "",
                              user.role.toLowerCase(),
                              user.id
                            )
                          }
                          className="p-2"
                          title="Edit User"
                        >
                          <Pencil strokeWidth={3} />
                        </Button>
                        {user.id !== currentUser.user.id && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="link"
                                size="sm"
                                className="p-2 text-destructive hover:text-destructive"
                                title="Delete User"
                              >
                                <Trash strokeWidth={3} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirm User Delete</DialogTitle>
                                <DialogDescription>
                                  Do you wish to delete user {user.email}? This
                                  action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline">Cancel</Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDeleteUser(user.id)}
                                  disabled={loading}
                                >
                                  {loading ? "Deleting..." : "Delete User"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
