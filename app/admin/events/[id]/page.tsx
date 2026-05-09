import { getEventById, getBookingsByEvent, mockEvents } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Flag,
  CheckCircle,
  XCircle,
  EyeOff,
  Clock
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

export function generateStaticParams() {
  return mockEvents.map((event) => ({
    id: event.id,
  }))
}

export default async function EventDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = getEventById(id)
  
  if (!event) {
    notFound()
  }

  const bookings = getBookingsByEvent(event.id).slice(0, 10)
  const soldPercentage = (event.ticketsSold / event.capacity) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{event.title}</h1>
            <StatusBadge status={event.status} />
            {event.flagCount && event.flagCount > 0 && (
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 gap-1">
                <Flag className="h-3 w-3" />
                {event.flagCount} flags
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{event.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {event.status === "pending_review" && (
            <>
              <Button variant="outline" className="gap-2 text-destructive border-destructive/50 hover:bg-destructive/10">
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button className="gap-2 bg-success hover:bg-success/90 text-success-foreground">
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
            </>
          )}
          {event.status === "published" && (
            <Button variant="outline" className="gap-2 text-warning border-warning/50 hover:bg-warning/10">
              <EyeOff className="h-4 w-4" />
              Unpublish
            </Button>
          )}
          <Button variant="outline" className="gap-2">
            <Flag className="h-4 w-4" />
            Flag
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Event Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Image */}
          <Card className="bg-card border-border overflow-hidden">
            <div className="h-64 bg-secondary">
              {event.imageUrl && (
                <img 
                  src={event.imageUrl} 
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </Card>

          {/* Event Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Event Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Date & Time</p>
                  <p className="text-sm text-card-foreground">
                    {format(event.startDate, "MMMM d, yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    to {format(event.endDate, "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm text-card-foreground">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                <Badge variant="outline" className="h-fit">{event.category}</Badge>
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm text-card-foreground">{event.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm text-card-foreground">
                    {format(event.createdAt, "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No bookings yet for this event.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Attendee</TableHead>
                      <TableHead className="text-muted-foreground">Ticket Type</TableHead>
                      <TableHead className="text-muted-foreground">Qty</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-right text-muted-foreground">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id} className="border-border">
                        <TableCell className="font-medium text-card-foreground">
                          {booking.user?.name || "Unknown"}
                        </TableCell>
                        <TableCell className="text-card-foreground">
                          {booking.ticketType}
                        </TableCell>
                        <TableCell className="text-card-foreground">
                          {booking.quantity}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={booking.status} />
                        </TableCell>
                        <TableCell className="text-right text-card-foreground">
                          {formatCurrency(booking.totalAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Sales */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Ticket Sales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sold</span>
                <span className="text-sm font-medium text-card-foreground">
                  {event.ticketsSold} / {event.capacity}
                </span>
              </div>
              <Progress value={soldPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {soldPercentage.toFixed(1)}% capacity filled
              </p>
            </CardContent>
          </Card>

          {/* Revenue */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-success/10 p-3">
                  <DollarSign className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-card-foreground">
                    {formatCurrency(event.revenue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capacity */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="text-2xl font-bold text-card-foreground">
                    {event.capacity}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                View Event Owner
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Export Attendee List
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Send Notification
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
