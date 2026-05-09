"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

const data = [
  { month: "Jan", bookings: 145, cancelled: 12 },
  { month: "Feb", bookings: 178, cancelled: 15 },
  { month: "Mar", bookings: 203, cancelled: 18 },
  { month: "Apr", bookings: 192, cancelled: 14 },
  { month: "May", bookings: 256, cancelled: 22 },
  { month: "Jun", bookings: 289, cancelled: 25 },
  { month: "Jul", bookings: 324, cancelled: 28 },
  { month: "Aug", bookings: 367, cancelled: 31 },
  { month: "Sep", bookings: 341, cancelled: 29 },
  { month: "Oct", bookings: 398, cancelled: 35 },
  { month: "Nov", bookings: 445, cancelled: 38 },
  { month: "Dec", bookings: 489, cancelled: 42 }
]

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
            {entry.name === "bookings" ? "Confirmed" : "Cancelled"}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function BookingsChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Bookings Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="bookings" 
                fill="oklch(0.7 0.15 165)" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="cancelled" 
                fill="oklch(0.55 0.2 25)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
