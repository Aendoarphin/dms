import { Search, UsersIcon, Calendar, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Users() {
  // Mock user data
  const allUsers = [
    {
      id: 1,
      email: "sarah.johnson@company.com",
      created: "2024-01-15T10:30:00Z",
      lastSignIn: "2024-01-20T14:22:00Z",
      status: "active",
    },
    {
      id: 2,
      email: "michael.chen@company.com",
      created: "2024-01-12T09:15:00Z",
      lastSignIn: "2024-01-19T16:45:00Z",
      status: "active",
    },
    {
      id: 3,
      email: "emily.rodriguez@company.com",
      created: "2024-01-10T11:20:00Z",
      lastSignIn: "2024-01-18T13:30:00Z",
      status: "active",
    },
    {
      id: 4,
      email: "david.kim@company.com",
      created: "2024-01-08T08:45:00Z",
      lastSignIn: "2024-01-17T10:15:00Z",
      status: "active",
    },
    {
      id: 5,
      email: "lisa.wang@company.com",
      created: "2024-01-05T14:30:00Z",
      lastSignIn: "2024-01-16T12:20:00Z",
      status: "active",
    },
    {
      id: 6,
      email: "robert.taylor@company.com",
      created: "2024-01-03T16:10:00Z",
      lastSignIn: "2024-01-15T09:45:00Z",
      status: "active",
    },
    {
      id: 7,
      email: "jennifer.lee@company.com",
      created: "2023-12-28T13:25:00Z",
      lastSignIn: "2024-01-14T15:30:00Z",
      status: "active",
    },
    {
      id: 8,
      email: "alex.thompson@company.com",
      created: "2023-12-25T10:40:00Z",
      lastSignIn: "2024-01-13T11:10:00Z",
      status: "active",
    },
    {
      id: 9,
      email: "maria.garcia@company.com",
      created: "2023-12-20T12:15:00Z",
      lastSignIn: "2024-01-12T14:25:00Z",
      status: "active",
    },
    {
      id: 10,
      email: "james.wilson@company.com",
      created: "2023-12-18T15:50:00Z",
      lastSignIn: "2024-01-11T16:40:00Z",
      status: "active",
    },
    {
      id: 11,
      email: "amanda.brown@company.com",
      created: "2023-12-15T09:30:00Z",
      lastSignIn: "2024-01-10T13:15:00Z",
      status: "active",
    },
    {
      id: 12,
      email: "kevin.martinez@company.com",
      created: "2023-12-12T11:45:00Z",
      lastSignIn: "2023-12-20T10:30:00Z",
      status: "inactive",
    },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getLastSignInStatus = (lastSignIn: string) => {
    const daysSince = Math.floor((Date.now() - new Date(lastSignIn).getTime()) / (1000 * 60 * 60 * 24))
    if (daysSince > 30) return "inactive"
    if (daysSince > 7) return "warning"
    return "active"
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
              <p className="text-muted-foreground">Manage all users in the system</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search users..." className="w-full lg:w-[300px] pl-8" />
              </div>
              <Button>Add User</Button>
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
                Active
                <Badge variant="secondary" className="ml-2">
                  {allUsers.filter((u) => u.status === "active").length}
                </Badge>
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                Inactive
                <Badge variant="secondary" className="ml-2">
                  {allUsers.filter((u) => u.status === "inactive").length}
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
            <p className="text-sm text-muted-foreground">Showing {allUsers.length} users</p>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <UsersIcon className="h-5 w-5" />
                <CardTitle>System Users</CardTitle>
              </div>
              <CardDescription>Complete list of all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
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
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted">
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(user.created)}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDateTime(user.lastSignIn)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            getLastSignInStatus(user.lastSignIn) === "active"
                              ? "default"
                              : getLastSignInStatus(user.lastSignIn) === "warning"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {getLastSignInStatus(user.lastSignIn) === "active"
                            ? "Active"
                            : getLastSignInStatus(user.lastSignIn) === "warning"
                              ? "Inactive 7+ days"
                              : "Inactive 30+ days"}
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
  )
}