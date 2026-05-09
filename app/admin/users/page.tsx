"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/admin/data-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { mockUsers, User } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Ban, UserCheck, Trash2, UserCog } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const columns = [
  {
    key: "user",
    header: "User",
    cell: (user: User) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {user.name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-card-foreground">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
    )
  },
  {
    key: "role",
    header: "Role",
    cell: (user: User) => (
      <span className="capitalize text-card-foreground">
        {user.role.replace("_", " ")}
      </span>
    )
  },
  {
    key: "status",
    header: "Status",
    cell: (user: User) => <StatusBadge status={user.status} />
  },
  {
    key: "bookings",
    header: "Bookings",
    cell: (user: User) => (
      <span className="text-card-foreground">{user.totalBookings || 0}</span>
    )
  },
  {
    key: "spent",
    header: "Total Spent",
    cell: (user: User) => (
      <span className="text-card-foreground">{formatCurrency(user.totalSpent || 0)}</span>
    )
  },
  {
    key: "joined",
    header: "Joined",
    cell: (user: User) => (
      <span className="text-muted-foreground">
        {format(user.createdAt, "MMM d, yyyy")}
      </span>
    )
  },
  {
    key: "actions",
    header: "",
    cell: (user: User) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/admin/users/${user.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserCog className="mr-2 h-4 w-4" />
            Impersonate
          </DropdownMenuItem>
          {user.status === "active" ? (
            <DropdownMenuItem className="text-warning">
              <Ban className="mr-2 h-4 w-4" />
              Suspend User
            </DropdownMenuItem>
          ) : user.status === "suspended" ? (
            <DropdownMenuItem className="text-success">
              <UserCheck className="mr-2 h-4 w-4" />
              Activate User
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
]

const filters = [
  {
    key: "role",
    label: "Role",
    options: [
      { value: "attendee", label: "Attendee" },
      { value: "event_owner", label: "Event Owner" },
      { value: "admin", label: "Admin" }
    ]
  },
  {
    key: "status",
    label: "Status",
    options: [
      { value: "active", label: "Active" },
      { value: "pending", label: "Pending" },
      { value: "suspended", label: "Suspended" }
    ]
  }
]

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground">Manage all users on the platform</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockUsers}
            columns={columns}
            searchPlaceholder="Search users by name or email..."
            searchKeys={["name", "email"] as (keyof User)[]}
            filters={filters}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}
