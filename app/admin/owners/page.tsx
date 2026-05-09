"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/admin/data-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { mockOwners, EventOwner } from "@/lib/mock-data"
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
import { MoreHorizontal, Eye, Ban, CheckCircle, XCircle, Calendar } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { formatNaira } from "@/lib/format-naira"

const columns = [
  {
    key: "owner",
    header: "Event Owner",
    cell: (owner: EventOwner) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={owner.user.avatar} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {owner.businessName.split(" ").map(n => n[0]).slice(0, 2).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-card-foreground">{owner.businessName}</p>
          <p className="text-sm text-muted-foreground">{owner.businessEmail}</p>
        </div>
      </div>
    )
  },
  {
    key: "status",
    header: "Status",
    cell: (owner: EventOwner) => <StatusBadge status={owner.status} />
  },
  {
    key: "events",
    header: "Events",
    cell: (owner: EventOwner) => (
      <span className="text-card-foreground">{owner.totalEvents}</span>
    )
  },
  {
    key: "revenue",
    header: "Total Revenue",
    cell: (owner: EventOwner) => (
      <span className="text-card-foreground">{formatNaira(owner.totalRevenue)}</span>
    )
  },
  {
    key: "pending",
    header: "Pending Payout",
    cell: (owner: EventOwner) => (
      <span className="text-card-foreground">{formatNaira(owner.pendingPayout)}</span>
    )
  },
  {
    key: "applicationDate",
    header: "Applied",
    cell: (owner: EventOwner) => (
      <span className="text-muted-foreground">
        {format(owner.applicationDate, "MMM d, yyyy")}
      </span>
    )
  },
  {
    key: "actions",
    header: "",
    cell: (owner: EventOwner) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Calendar className="mr-2 h-4 w-4" />
            View Events
          </DropdownMenuItem>
          {owner.status === "pending" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-success">
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </DropdownMenuItem>
            </>
          )}
          {owner.status === "approved" && (
            <DropdownMenuItem className="text-warning">
              <Ban className="mr-2 h-4 w-4" />
              Suspend
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
]

const filters = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "approved", label: "Approved" },
      { value: "pending", label: "Pending" },
      { value: "rejected", label: "Rejected" },
      { value: "suspended", label: "Suspended" }
    ]
  }
]

// Stats for the top
const stats = {
  total: mockOwners.length,
  approved: mockOwners.filter(o => o.status === "approved").length,
  pending: mockOwners.filter(o => o.status === "pending").length,
  suspended: mockOwners.filter(o => o.status === "suspended").length
}

export default function OwnersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Event Owners</h1>
          <p className="text-muted-foreground">Manage event organizers and their applications</p>
        </div>
        {stats.pending > 0 && (
          <Link href="/admin/owners/pending">
            <Button className="gap-2">
              Review Pending ({stats.pending})
            </Button>
          </Link>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Owners</p>
            <p className="text-2xl font-bold text-card-foreground">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold text-success">{stats.approved}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending Review</p>
            <p className="text-2xl font-bold text-warning">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Suspended</p>
            <p className="text-2xl font-bold text-destructive">{stats.suspended}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">All Event Owners</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockOwners}
            columns={columns}
            searchPlaceholder="Search by business name or email..."
            searchKeys={["businessName", "businessEmail"] as (keyof EventOwner)[]}
            filters={filters}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}
