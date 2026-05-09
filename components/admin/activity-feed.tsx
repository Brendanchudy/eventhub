"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  UserPlus,
  Calendar,
  Flag,
  DollarSign,
  CheckCircle,
  XCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { formatNaira } from "@/lib/format-naira"

interface Activity {
  id: string
  type: "user_registered" | "event_created" | "event_flagged" | "payout_processed" | "owner_approved" | "owner_rejected" | "event_approved"
  title: string
  description: string
  timestamp: Date
}

const activityIcons = {
  user_registered: { icon: UserPlus, className: "bg-info/10 text-info" },
  event_created: { icon: Calendar, className: "bg-success/10 text-success" },
  event_flagged: { icon: Flag, className: "bg-destructive/10 text-destructive" },
  payout_processed: { icon: DollarSign, className: "bg-success/10 text-success" },
  owner_approved: { icon: CheckCircle, className: "bg-success/10 text-success" },
  owner_rejected: { icon: XCircle, className: "bg-destructive/10 text-destructive" },
  event_approved: { icon: CheckCircle, className: "bg-success/10 text-success" }
}

export function ActivityFeed() {
  const recentActivities: Activity[] = [
    {
      id: "1",
      type: "user_registered",
      title: "New user registered",
      description: "Funmilayo Adeyemi joined the platform",
      timestamp: new Date(Date.now() - 1000 * 60 * 5)
    },
    {
      id: "2",
      type: "event_created",
      title: "New event submitted",
      description: "Lagos Tech & Startup Summit 2026 pending review",
      timestamp: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      id: "3",
      type: "event_flagged",
      title: "Event flagged",
      description: "Afrobeats Live — Freedom Park flagged by 3 users",
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: "4",
      type: "payout_processed",
      title: "Payout completed",
      description: `${formatNaira(2_450_000)} sent to Lagos Events Collective`,
      timestamp: new Date(Date.now() - 1000 * 60 * 45)
    },
    {
      id: "5",
      type: "owner_approved",
      title: "Owner approved",
      description: "Abuja Summit Productions can now publish events",
      timestamp: new Date(Date.now() - 1000 * 60 * 60)
    },
    {
      id: "6",
      type: "event_approved",
      title: "Event approved",
      description: "Jazz Under the Stars — Ikoyi is now live",
      timestamp: new Date(Date.now() - 1000 * 60 * 90)
    },
    {
      id: "7",
      type: "user_registered",
      title: "New user registered",
      description: "Obinna Okafor joined the platform",
      timestamp: new Date(Date.now() - 1000 * 60 * 120)
    },
    {
      id: "8",
      type: "owner_rejected",
      title: "Owner application rejected",
      description: "Quick Tickets NG — incomplete documents",
      timestamp: new Date(Date.now() - 1000 * 60 * 180)
    }
  ]

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-6">
          <div className="space-y-4 pb-4">
            {recentActivities.map((activity) => {
              const { icon: Icon, className } = activityIcons[activity.type]
              return (
                <div key={activity.id} className="flex gap-3">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", className)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-card-foreground">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
