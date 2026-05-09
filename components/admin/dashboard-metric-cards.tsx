import { StatCard } from "@/components/admin/stat-card"
import { supabase } from "@/lib/supabase"
import { Users, Calendar, DollarSign, Ticket } from "lucide-react"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

export function DashboardMetricCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        loading
        change={{ value: 12.5, label: "from last month" }}
        icon={Users}
        variant="info"
      />
      <StatCard
        title="Active Events"
        loading
        change={{ value: 8.2, label: "from last month" }}
        icon={Calendar}
        variant="success"
      />
      <StatCard
        title="Total Bookings"
        loading
        change={{ value: 15.3, label: "from last month" }}
        icon={Ticket}
        variant="default"
      />
      <StatCard
        title="Platform Revenue"
        loading
        change={{ value: 22.1, label: "from last month" }}
        icon={DollarSign}
        variant="success"
      />
    </div>
  )
}

export async function DashboardMetricCards() {
  const [usersRes, eventsRes, bookingsCountRes, revenueRes] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("amount.sum()")
  ])

  const totalUsers = usersRes.error ? 0 : (usersRes.count ?? 0)
  const totalEvents = eventsRes.error ? 0 : (eventsRes.count ?? 0)
  const totalBookings = bookingsCountRes.error ? 0 : (bookingsCountRes.count ?? 0)

  const sumRow = revenueRes.data?.[0] as { sum: number | null } | undefined
  const totalRevenue = revenueRes.error ? 0 : Number(sumRow?.sum ?? 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={totalUsers.toLocaleString()}
        change={{ value: 12.5, label: "from last month" }}
        icon={Users}
        variant="info"
      />
      <StatCard
        title="Active Events"
        value={totalEvents.toLocaleString()}
        change={{ value: 8.2, label: "from last month" }}
        icon={Calendar}
        variant="success"
      />
      <StatCard
        title="Total Bookings"
        value={totalBookings.toLocaleString()}
        change={{ value: 15.3, label: "from last month" }}
        icon={Ticket}
        variant="default"
      />
      <StatCard
        title="Platform Revenue"
        value={formatCurrency(totalRevenue)}
        change={{ value: 22.1, label: "from last month" }}
        icon={DollarSign}
        variant="success"
      />
    </div>
  )
}
