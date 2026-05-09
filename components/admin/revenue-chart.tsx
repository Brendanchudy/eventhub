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

const data = [
  { month: "Jan", revenue: 12400, bookings: 145 },
  { month: "Feb", revenue: 14800, bookings: 178 },
  { month: "Mar", revenue: 18200, bookings: 203 },
  { month: "Apr", revenue: 16500, bookings: 192 },
  { month: "May", revenue: 21800, bookings: 256 },
  { month: "Jun", revenue: 24600, bookings: 289 },
  { month: "Jul", revenue: 28400, bookings: 324 },
  { month: "Aug", revenue: 32100, bookings: 367 },
  { month: "Sep", revenue: 29800, bookings: 341 },
  { month: "Oct", revenue: 34500, bookings: 398 },
  { month: "Nov", revenue: 38200, bookings: 445 },
  { month: "Dec", revenue: 42800, bookings: 489 }
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
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
            {entry.name === "revenue" ? formatCurrency(entry.value) : entry.value}
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
                tickFormatter={(value) => `$${value / 1000}k`}
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
