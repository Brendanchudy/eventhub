import { getUserById, getBookingsByUser, mockUsers } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Mail, 
  Calendar, 
  DollarSign, 
  Ticket,
  Ban,
  UserCheck,
  UserCog,
  Trash2
} from "lucide-react"
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

export function generateStaticParams() {
  return mockUsers.map((user) => ({
    id: user.id,
  }))
}

export default async function UserDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = getUserById(id)
  
  if (!user) {
    notFound()
  }

  const bookings = getBookingsByUser(user.id).slice(0, 10)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">User Details</h1>
          <p className="text-muted-foreground">View and manage user information</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <UserCog className="h-4 w-4" />
            Impersonate
          </Button>
          {user.status === "active" ? (
            <Button variant="outline" className="gap-2 text-warning border-warning/50 hover:bg-warning/10">
              <Ban className="h-4 w-4" />
              Suspend
            </Button>
          ) : (
            <Button variant="outline" className="gap-2 text-success border-success/50 hover:bg-success/10">
              <UserCheck className="h-4 w-4" />
              Activate
            </Button>
          )}
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Profile Card */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {user.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold text-card-foreground">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="mt-3 flex items-center gap-2">
                <StatusBadge status={user.status} />
                <Badge variant="outline" className="capitalize">
                  {user.role.replace("_", " ")}
                </Badge>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-card-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="text-sm text-card-foreground">
                    {format(user.createdAt, "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
              {user.lastLogin && (
                <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Last Login</p>
                    <p className="text-sm text-card-foreground">
                      {format(user.lastLogin, "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats & Bookings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="bg-card border-border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Ticket className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold text-card-foreground">
                    {user.totalBookings || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-lg bg-success/10 p-3">
                  <DollarSign className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold text-card-foreground">
                    {formatCurrency(user.totalSpent || 0)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No bookings found for this user.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Event</TableHead>
                      <TableHead className="text-muted-foreground">Ticket Type</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-right text-muted-foreground">Amount</TableHead>
                      <TableHead className="text-muted-foreground">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id} className="border-border">
                        <TableCell className="font-medium text-card-foreground">
                          {booking.event?.title || "Unknown Event"}
                        </TableCell>
                        <TableCell className="text-card-foreground">
                          {booking.ticketType}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={booking.status} />
                        </TableCell>
                        <TableCell className="text-right text-card-foreground">
                          {formatCurrency(booking.totalAmount)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(booking.createdAt, "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
