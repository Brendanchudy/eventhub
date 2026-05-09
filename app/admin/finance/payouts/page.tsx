"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/admin/data-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { mockPayouts, Payout, getPayoutStats } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  MoreHorizontal, 
  Eye, 
  Play, 
  Pause, 
  RefreshCcw,
  ArrowLeft,
  DollarSign,
  Clock,
  CheckCircle
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

const columns = [
  {
    key: "payout",
    header: "Payout ID",
    cell: (payout: Payout) => (
      <span className="font-mono text-sm text-card-foreground">{payout.id}</span>
    )
  },
  {
    key: "owner",
    header: "Event Owner",
    cell: (payout: Payout) => (
      <div>
        <p className="font-medium text-card-foreground">
          {payout.owner?.businessName || "Unknown"}
        </p>
        <p className="text-sm text-muted-foreground">
          {payout.owner?.businessEmail}
        </p>
      </div>
    )
  },
  {
    key: "amount",
    header: "Amount",
    cell: (payout: Payout) => (
      <div>
        <p className="font-medium text-card-foreground">
          {formatCurrency(payout.amount)}
        </p>
        <p className="text-xs text-muted-foreground">
          Fee: {formatCurrency(payout.platformFee)}
        </p>
      </div>
    )
  },
  {
    key: "netAmount",
    header: "Net Payout",
    cell: (payout: Payout) => (
      <span className="font-medium text-success">
        {formatCurrency(payout.netAmount)}
      </span>
    )
  },
  {
    key: "status",
    header: "Status",
    cell: (payout: Payout) => <StatusBadge status={payout.status} />
  },
  {
    key: "date",
    header: "Date",
    cell: (payout: Payout) => (
      <div>
        <p className="text-card-foreground">
          {format(payout.createdAt, "MMM d, yyyy")}
        </p>
        {payout.processedAt && (
          <p className="text-xs text-muted-foreground">
            Processed: {format(payout.processedAt, "MMM d")}
          </p>
        )}
      </div>
    )
  },
  {
    key: "bankDetails",
    header: "Bank",
    cell: (payout: Payout) => (
      <span className="font-mono text-sm text-muted-foreground">
        {payout.bankDetails}
      </span>
    )
  },
  {
    key: "actions",
    header: "",
    cell: (payout: Payout) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          {payout.status === "pending" && (
            <DropdownMenuItem className="text-success">
              <Play className="mr-2 h-4 w-4" />
              Process Now
            </DropdownMenuItem>
          )}
          {payout.status === "pending" && (
            <DropdownMenuItem className="text-warning">
              <Pause className="mr-2 h-4 w-4" />
              Hold Payout
            </DropdownMenuItem>
          )}
          {payout.status === "failed" && (
            <DropdownMenuItem className="text-info">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
]

const filters = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "pending", label: "Pending" },
      { value: "processing", label: "Processing" },
      { value: "completed", label: "Completed" },
      { value: "failed", label: "Failed" }
    ]
  }
]

export default function PayoutsPage() {
  const stats = getPayoutStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/finance">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Payouts</h1>
          <p className="text-muted-foreground">Manage event owner payouts</p>
        </div>
        <Button className="gap-2">
          <Play className="h-4 w-4" />
          Process All Pending
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-2">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Payouts</p>
              <p className="text-xl font-bold text-card-foreground">{stats.totalPayouts}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-success/10 p-2">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-xl font-bold text-success">{formatCurrency(stats.totalPaid)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-warning/10 p-2">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-xl font-bold text-warning">{formatCurrency(stats.totalPending)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-info/10 p-2">
              <DollarSign className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Commission Earned</p>
              <p className="text-xl font-bold text-info">{formatCurrency(stats.totalCommission)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">All Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockPayouts}
            columns={columns}
            searchPlaceholder="Search by payout ID..."
            searchKeys={["id"] as (keyof Payout)[]}
            filters={filters}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}
