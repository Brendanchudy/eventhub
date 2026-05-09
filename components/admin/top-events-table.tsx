"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "./status-badge"
import { mockEvents } from "@/lib/mock-data"
import { format } from "date-fns"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

// Get top 5 events by revenue
const topEvents = [...mockEvents]
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 5)

export function TopEventsTable() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Top Performing Events</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Event</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-right text-muted-foreground">Tickets Sold</TableHead>
              <TableHead className="text-right text-muted-foreground">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topEvents.map((event) => (
              <TableRow key={event.id} className="border-border">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-card-foreground">{event.title}</span>
                    <span className="text-xs text-muted-foreground">{event.location}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(event.startDate, "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <StatusBadge status={event.status} />
                </TableCell>
                <TableCell className="text-right text-card-foreground">
                  {event.ticketsSold} / {event.capacity}
                </TableCell>
                <TableCell className="text-right font-medium text-card-foreground">
                  {formatCurrency(event.revenue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
