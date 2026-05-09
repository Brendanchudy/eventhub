"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/admin/stat-card"
import { getPayoutStats, getBookingStats, getPayoutsByMonth } from "@/lib/mock-data"
import { DollarSign, TrendingUp, CreditCard, PiggyBank, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts"
import { formatNaira } from "@/lib/format-naira"

function formatNairaCompact(value: number) {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1000) return `₦${Math.round(value / 1000)}k`
  return formatNaira(value)
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    name: string
    color: string
  }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="mb-2 font-medium text-card-foreground">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name === "paid" ? "Paid to Owners" : "Platform Commission"}: {formatNaira(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function FinancePage() {
  const payoutStats = getPayoutStats()
  const bookingStats = getBookingStats()
  const payoutsByMonth = getPayoutsByMonth()

  // Revenue by month chart data
  const revenueData = [
    { month: "Jan", revenue: 12400, commission: 1240 },
    { month: "Feb", revenue: 14800, commission: 1480 },
    { month: "Mar", revenue: 18200, commission: 1820 },
    { month: "Apr", revenue: 16500, commission: 1650 },
    { month: "May", revenue: 21800, commission: 2180 },
    { month: "Jun", revenue: 24600, commission: 2460 },
    { month: "Jul", revenue: 28400, commission: 2840 },
    { month: "Aug", revenue: 32100, commission: 3210 },
    { month: "Sep", revenue: 29800, commission: 2980 },
    { month: "Oct", revenue: 34500, commission: 3450 },
    { month: "Nov", revenue: 38200, commission: 3820 },
    { month: "Dec", revenue: 42800, commission: 4280 }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Finance</h1>
          <p className="text-muted-foreground">Platform revenue and financial overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Link href="/admin/finance/payouts">
            <Button className="gap-2">
              Manage Payouts
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue (GMV)"
          value={formatNaira(bookingStats.totalRevenue)}
          change={{ value: 18.5, label: "from last month" }}
          icon={DollarSign}
          variant="success"
        />
        <StatCard
          title="Platform Commission"
          value={formatNaira(payoutStats.totalCommission)}
          change={{ value: 18.5, label: "from last month" }}
          icon={TrendingUp}
          variant="info"
        />
        <StatCard
          title="Paid to Owners"
          value={formatNaira(payoutStats.totalPaid)}
          change={{ value: 12.3, label: "from last month" }}
          icon={CreditCard}
          variant="default"
        />
        <StatCard
          title="Pending Payouts"
          value={formatNaira(payoutStats.totalPending)}
          icon={PiggyBank}
          variant="warning"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Over Time */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.7 0.15 165)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.7 0.15 165)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="oklch(0.65 0 0)"
                    tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="oklch(0.65 0 0)"
                    tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                    tickFormatter={(value) => formatNairaCompact(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="revenue"
                    stroke="oklch(0.7 0.15 165)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Commission vs Payouts */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Payouts vs Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payoutsByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="oklch(0.65 0 0)"
                    tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="oklch(0.65 0 0)"
                    tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                    tickFormatter={(value) => formatNairaCompact(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="paid" 
                    name="paid"
                    fill="oklch(0.65 0.2 250)" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="commission" 
                    name="commission"
                    fill="oklch(0.65 0.18 145)" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Breakdown */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Gross Revenue</span>
              <span className="font-medium text-card-foreground">
                {formatNaira(bookingStats.totalRevenue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Platform Fee (10%)</span>
              <span className="font-medium text-success">
                {formatNaira(payoutStats.totalCommission)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Owner Share (90%)</span>
              <span className="font-medium text-card-foreground">
                {formatNaira(bookingStats.totalRevenue - payoutStats.totalCommission)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Refunded</span>
              <span className="font-medium text-destructive">
                -{formatNaira(bookingStats.refundedAmount)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Payout Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Payouts</span>
              <span className="font-medium text-card-foreground">
                {payoutStats.totalPayouts}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="font-medium text-success">
                {payoutStats.completedCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending</span>
              <span className="font-medium text-warning">
                {payoutStats.pendingCount}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <span className="font-medium text-card-foreground">
                {((payoutStats.completedCount / payoutStats.totalPayouts) * 100).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Booking Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Bookings</span>
              <span className="font-medium text-card-foreground">
                {bookingStats.totalBookings}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Confirmed</span>
              <span className="font-medium text-success">
                {bookingStats.confirmedBookings}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg. Order Value</span>
              <span className="font-medium text-card-foreground">
                {formatNaira(bookingStats.totalRevenue / bookingStats.confirmedBookings)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Conversion Rate</span>
              <span className="font-medium text-card-foreground">
                {bookingStats.conversionRate}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
