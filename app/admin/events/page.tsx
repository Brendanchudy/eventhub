"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/admin/data-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { mockEvents, Event } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  MoreHorizontal, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Flag, 
  EyeOff,
  Calendar,
  MapPin,
  AlertTriangle
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatNaira } from "@/lib/format-naira"

const columns = [
  {
    key: "event",
    header: "Event",
    cell: (event: Event) => (
      <div className="flex items-start gap-3">
        <div className="h-12 w-16 rounded-md bg-secondary overflow-hidden">
          {event.imageUrl && (
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-card-foreground">{event.title}</p>
            {event.flagCount && event.flagCount > 0 && (
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 gap-1">
                <Flag className="h-3 w-3" />
                {event.flagCount}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {event.location}
          </p>
        </div>
      </div>
    )
  },
  {
    key: "category",
    header: "Category",
    cell: (event: Event) => (
      <Badge variant="outline">{event.category}</Badge>
    )
  },
  {
    key: "status",
    header: "Status",
    cell: (event: Event) => <StatusBadge status={event.status} />
  },
  {
    key: "date",
    header: "Event Date",
    cell: (event: Event) => (
      <span className="text-muted-foreground">
        {format(event.startDate, "MMM d, yyyy")}
      </span>
    )
  },
  {
    key: "tickets",
    header: "Tickets",
    cell: (event: Event) => (
      <span className="text-card-foreground">
        {event.ticketsSold} / {event.capacity}
      </span>
    )
  },
  {
    key: "revenue",
    header: "Revenue",
    cell: (event: Event) => (
      <span className="font-medium text-card-foreground">
        {formatNaira(event.revenue)}
      </span>
    )
  },
  {
    key: "actions",
    header: "",
    cell: (event: Event) => (
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
            <Link href={`/admin/events/${event.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          {event.status === "pending_review" && (
            <>
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
          {event.status === "published" && (
            <DropdownMenuItem className="text-warning">
              <EyeOff className="mr-2 h-4 w-4" />
              Unpublish
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <Flag className="mr-2 h-4 w-4" />
            Flag for Review
          </DropdownMenuItem>
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
      { value: "published", label: "Published" },
      { value: "pending_review", label: "Pending Review" },
      { value: "draft", label: "Draft" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" }
    ]
  },
  {
    key: "category",
    label: "Category",
    options: [
      { value: "Technology", label: "Technology" },
      { value: "Music", label: "Music" },
      { value: "Business", label: "Business" },
      { value: "Food & Drink", label: "Food & Drink" },
      { value: "Health & Wellness", label: "Health & Wellness" },
      { value: "Arts & Culture", label: "Arts & Culture" }
    ]
  }
]

// Stats
const stats = {
  total: mockEvents.length,
  published: mockEvents.filter(e => e.status === "published").length,
  pending: mockEvents.filter(e => e.status === "pending_review").length,
  flagged: mockEvents.filter(e => (e.flagCount ?? 0) > 0).length
}

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground">Manage and moderate all platform events</p>
        </div>
        <div className="flex items-center gap-2">
          {stats.pending > 0 && (
            <Link href="/admin/events/pending">
              <Button className="gap-2">
                Review Pending ({stats.pending})
              </Button>
            </Link>
          )}
          {stats.flagged > 0 && (
            <Button variant="outline" className="gap-2 text-destructive border-destructive/50">
              <AlertTriangle className="h-4 w-4" />
              {stats.flagged} Flagged
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-2xl font-bold text-card-foreground">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Published</p>
            <p className="text-2xl font-bold text-success">{stats.published}</p>
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
            <p className="text-sm text-muted-foreground">Flagged</p>
            <p className="text-2xl font-bold text-destructive">{stats.flagged}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">All Events</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockEvents}
            columns={columns}
            searchPlaceholder="Search events by title or location..."
            searchKeys={["title", "location"] as (keyof Event)[]}
            filters={filters}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}
