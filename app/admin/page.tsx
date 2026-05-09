import {
  DashboardMetricCards,
  DashboardMetricCardsSkeleton
} from "@/components/admin/dashboard-metric-cards"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { BookingsChart } from "@/components/admin/bookings-chart"
import { ActivityFeed } from "@/components/admin/activity-feed"
import { TopEventsTable } from "@/components/admin/top-events-table"
import { getPlatformStats } from "@/lib/mock-data"
import { UserCheck, AlertTriangle, Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"
import { formatNaira } from "@/lib/format-naira"

export default function AdminDashboard() {
  const stats = getPlatformStats()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening on the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          {stats.pendingOwnerApplications > 0 && (
            <Link href="/admin/owners/pending">
              <Button variant="outline" className="gap-2">
                <UserCheck className="h-4 w-4" />
                {stats.pendingOwnerApplications} Pending Applications
              </Button>
            </Link>
          )}
          {stats.pendingEventReviews > 0 && (
            <Link href="/admin/events/pending">
              <Button variant="outline" className="gap-2">
                <Clock className="h-4 w-4" />
                {stats.pendingEventReviews} Events to Review
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <Suspense fallback={<DashboardMetricCardsSkeleton />}>
        <DashboardMetricCards />
      </Suspense>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Reviews</p>
              <p className="text-xl font-bold text-card-foreground">
                {stats.pendingEventReviews + stats.pendingOwnerApplications}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2">
              <UserCheck className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Event Owners</p>
              <p className="text-xl font-bold text-card-foreground">
                {stats.totalEventOwners}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total GMV</p>
              <p className="text-xl font-bold text-card-foreground">
                {formatNaira(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <BookingsChart />
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TopEventsTable />
        </div>
        <ActivityFeed />
      </div>
    </div>
  )
}
