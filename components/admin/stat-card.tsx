import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value?: string | number
  loading?: boolean
  change?: {
    value: number
    label: string
  }
  icon: LucideIcon
  variant?: "default" | "success" | "warning" | "info"
}

export function StatCard({ title, value, loading, change, icon: Icon, variant = "default" }: StatCardProps) {
  const variantStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    info: "bg-info/10 text-info"
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <div
                className="h-9 w-28 max-w-full animate-pulse rounded-md bg-muted"
                aria-busy="true"
                aria-label="Loading"
              />
            ) : (
              <p className="text-3xl font-bold text-card-foreground">{value}</p>
            )}
            {!loading && change && (
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "text-sm font-medium",
                    change.value >= 0 ? "text-success" : "text-destructive"
                  )}
                >
                  {change.value >= 0 ? "+" : ""}{change.value}%
                </span>
                <span className="text-sm text-muted-foreground">{change.label}</span>
              </div>
            )}
          </div>
          <div className={cn("rounded-lg p-3", variantStyles[variant])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
