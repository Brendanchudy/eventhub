"use client"

import { Card, CardContent } from "@/components/ui/card"
import { getPendingEvents, Event } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Calendar,
  Users,
  DollarSign,
  Eye
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { formatNaira } from "@/lib/format-naira"

function EventReviewCard({ event }: { event: Event }) {
  const [rejectReason, setRejectReason] = useState("")

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Event Image */}
        <div className="lg:w-72 h-48 lg:h-auto bg-secondary">
          {event.imageUrl && (
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <CardContent className="flex-1 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            {/* Event Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-card-foreground">
                  {event.title}
                </h3>
                <Badge variant="outline">{event.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              <Link href={`/admin/events/${event.id}`}>
                <Button variant="outline" size="sm" className="gap-1">
                  <Eye className="h-4 w-4" />
                  Details
                </Button>
              </Link>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 text-destructive border-destructive/50 hover:bg-destructive/10">
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Event</DialogTitle>
                    <DialogDescription>
                      Please provide a reason for rejecting &quot;{event.title}&quot;. This will be sent to the event owner.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Enter rejection reason..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive">Confirm Rejection</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1 bg-success hover:bg-success/90 text-success-foreground">
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Event</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to approve &quot;{event.title}&quot;? 
                      It will be published and visible to all users.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-success hover:bg-success/90">Confirm Approval</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Event Details Grid */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {format(event.startDate, "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Capacity: {event.capacity}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Est. Revenue: {formatNaira(event.capacity * 30000)}
              </span>
            </div>
          </div>

          {/* Submission Info */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Submitted {format(event.createdAt, "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

export default function PendingEventsPage() {
  const pendingEvents = getPendingEvents()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pending Review</h1>
          <p className="text-muted-foreground">
            Review and approve events before they go live
          </p>
        </div>
      </div>

      {pendingEvents.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-success mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground">All caught up!</h3>
            <p className="text-muted-foreground">No events pending review.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {pendingEvents.length} event{pendingEvents.length !== 1 ? "s" : ""} pending review
          </p>
          {pendingEvents.map((event) => (
            <EventReviewCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
