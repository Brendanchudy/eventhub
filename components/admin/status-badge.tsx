import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusType = 
  | "active" | "inactive" | "pending" | "suspended"
  | "published" | "draft" | "pending_review" | "cancelled" | "completed"
  | "approved" | "rejected"
  | "confirmed" | "refunded"
  | "processing" | "failed"

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  // User statuses
  active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
  inactive: { label: "Inactive", className: "bg-muted text-muted-foreground border-muted" },
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  suspended: { label: "Suspended", className: "bg-destructive/10 text-destructive border-destructive/20" },
  
  // Event statuses
  published: { label: "Published", className: "bg-success/10 text-success border-success/20" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground border-muted" },
  pending_review: { label: "Pending Review", className: "bg-warning/10 text-warning border-warning/20" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
  completed: { label: "Completed", className: "bg-info/10 text-info border-info/20" },
  
  // Approval statuses
  approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
  
  // Booking statuses
  confirmed: { label: "Confirmed", className: "bg-success/10 text-success border-success/20" },
  refunded: { label: "Refunded", className: "bg-warning/10 text-warning border-warning/20" },
  
  // Payout statuses
  processing: { label: "Processing", className: "bg-info/10 text-info border-info/20" },
  failed: { label: "Failed", className: "bg-destructive/10 text-destructive border-destructive/20" }
}

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" }
  
  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium", config.className, className)}
    >
      {config.label}
    </Badge>
  )
}
