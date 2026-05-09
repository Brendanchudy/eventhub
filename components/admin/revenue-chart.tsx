"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { formatNaira } from "@/lib/format-naira"

const data = [
  { month: "Jan", revenue: 9_300_000, bookings: 145 },
  { month: "Feb", revenue: 11_100_000, bookings: 178 },
  { month: "Mar", revenue: 13_650_000, bookings: 203 },
  { month: "Apr", revenue: 12_375_000, bookings: 192 },
  { month: "May", revenue: 16_350_000, bookings: 256 },
  { month: "Jun", revenue: 18_450_000, bookings: 289 },
  { month: "Jul", revenue: 21_300_000, bookings: 324 },
  { month: "Aug", revenue: 24_075_000, bookings: 367 },
  { month: "Sep", revenue: 22_350_000, bookings: 341 },
  { month: "Oct", revenue: 25_875_000, bookings: 398 },
  { month: "Nov", revenue: 28_650_000, bookings: 445 },
  { month: "Dec", revenue: 32_100_000, bookings: 489 }
]

function formatNairaAxis(value: number) {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(0)}M`
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
            {entry.name === "revenue" ? "Revenue" : "Bookings"}: {" "}
            {entry.name === "revenue" ? formatNaira(entry.value) : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function RevenueChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.2 250)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.65 0.2 250)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" />
              <XAxis
                dataKey="month"
                stroke="oklch(0.65 0 0)"
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                tickLine={{ stroke: "oklch(0.25 0.01 260)" }}
              />
              <YAxis
                stroke="oklch(0.65 0 0)"
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                tickLine={{ stroke: "oklch(0.25 0.01 260)" }}
                tickFormatter={(value) => formatNairaAxis(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="oklch(0.65 0.2 250)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
