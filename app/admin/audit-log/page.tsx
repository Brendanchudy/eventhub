"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/admin/data-table"
import { mockAuditLogs, AuditLog } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Shield } from "lucide-react"
import { format } from "date-fns"

const actionColors: Record<string, string> = {
  "user.suspended": "bg-destructive/10 text-destructive border-destructive/20",
  "user.activated": "bg-success/10 text-success border-success/20",
  "user.impersonated": "bg-warning/10 text-warning border-warning/20",
  "event.approved": "bg-success/10 text-success border-success/20",
  "event.rejected": "bg-destructive/10 text-destructive border-destructive/20",
  "event.unpublished": "bg-warning/10 text-warning border-warning/20",
  "owner.approved": "bg-success/10 text-success border-success/20",
  "owner.rejected": "bg-destructive/10 text-destructive border-destructive/20",
  "owner.suspended": "bg-warning/10 text-warning border-warning/20",
  "payout.processed": "bg-success/10 text-success border-success/20",
  "payout.held": "bg-warning/10 text-warning border-warning/20",
  "settings.updated": "bg-info/10 text-info border-info/20",
  "settings.feature_flag": "bg-info/10 text-info border-info/20"
}

const resourceTypeColors: Record<string, string> = {
  user: "bg-primary/10 text-primary",
  event: "bg-chart-2/10 text-chart-2",
  owner: "bg-chart-3/10 text-chart-3",
  payout: "bg-chart-1/10 text-chart-1",
  settings: "bg-muted text-muted-foreground"
}

const columns = [
  {
    key: "timestamp",
    header: "Timestamp",
    cell: (log: AuditLog) => (
      <div className="text-card-foreground">
        <p className="font-medium">{format(log.timestamp, "MMM d, yyyy")}</p>
        <p className="text-xs text-muted-foreground">
          {format(log.timestamp, "h:mm:ss a")}
        </p>
      </div>
    )
  },
  {
    key: "admin",
    header: "Admin",
    cell: (log: AuditLog) => (
      <div>
        <p className="font-medium text-card-foreground">{log.adminName}</p>
        <p className="text-xs text-muted-foreground font-mono">{log.adminId}</p>
      </div>
    )
  },
  {
    key: "action",
    header: "Action",
    cell: (log: AuditLog) => (
      <Badge 
        variant="outline" 
        className={actionColors[log.action] || "bg-muted text-muted-foreground"}
      >
        {log.action}
      </Badge>
    )
  },
  {
    key: "resourceType",
    header: "Resource",
    cell: (log: AuditLog) => (
      <div className="flex items-center gap-2">
        <span className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${resourceTypeColors[log.resourceType]}`}>
          {log.resourceType}
        </span>
        <span className="text-xs text-muted-foreground font-mono">
          {log.resourceId}
        </span>
      </div>
    )
  },
  {
    key: "details",
    header: "Details",
    cell: (log: AuditLog) => (
      <p className="text-sm text-muted-foreground max-w-xs truncate">
        {log.details}
      </p>
    )
  },
  {
    key: "ip",
    header: "IP Address",
    cell: (log: AuditLog) => (
      <span className="font-mono text-xs text-muted-foreground">
        {log.ipAddress}
      </span>
    )
  }
]

const filters = [
  {
    key: "resourceType",
    label: "Resource",
    options: [
      { value: "user", label: "User" },
      { value: "event", label: "Event" },
      { value: "owner", label: "Owner" },
      { value: "payout", label: "Payout" },
      { value: "settings", label: "Settings" }
    ]
  }
]

export default function AuditLogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Audit Log</h1>
            <p className="text-muted-foreground">Immutable record of all admin actions</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Log
        </Button>
      </div>

      {/* Info Banner */}
      <Card className="bg-info/5 border-info/20">
        <CardContent className="flex items-center gap-3 p-4">
          <Shield className="h-5 w-5 text-info" />
          <p className="text-sm text-info">
            This audit log is immutable and cannot be modified or deleted. All admin actions are automatically recorded for compliance and security purposes.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockAuditLogs}
            columns={columns}
            searchPlaceholder="Search by action, admin, or resource..."
            searchKeys={["action", "adminName", "resourceId", "details"] as (keyof AuditLog)[]}
            filters={filters}
            pageSize={15}
          />
        </CardContent>
      </Card>
    </div>
  )
}
