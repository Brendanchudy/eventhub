export type UserRole = "attendee" | "event_owner" | "admin"
export type UserStatus = "active" | "suspended" | "pending"
export type EventStatus = "draft" | "pending_review" | "published" | "cancelled" | "completed"
export type OwnerStatus = "pending" | "approved" | "rejected" | "suspended"
export type BookingStatus = "confirmed" | "cancelled" | "refunded" | "pending"
export type PayoutStatus = "pending" | "processing" | "completed" | "failed"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  status: UserStatus
  createdAt: Date
  lastLogin?: Date
  totalBookings?: number
  totalSpent?: number
}

export interface EventOwner {
  id: string
  userId: string
  user: User
  businessName: string
  businessEmail: string
  phone: string
  status: OwnerStatus
  applicationDate: Date
  approvedDate?: Date
  totalEvents: number
  totalRevenue: number
  pendingPayout: number
  documents?: string[]
}

export interface Event {
  id: string
  title: string
  description: string
  ownerId: string
  owner?: EventOwner
  category: string
  status: EventStatus
  startDate: Date
  endDate: Date
  location: string
  capacity: number
  ticketsSold: number
  revenue: number
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
  flagCount?: number
}

export interface Booking {
  id: string
  userId: string
  user?: User
  eventId: string
  event?: Event
  ticketType: string
  quantity: number
  totalAmount: number
  status: BookingStatus
  createdAt: Date
  checkInTime?: Date
}

export interface Payout {
  id: string
  ownerId: string
  owner?: EventOwner
  amount: number
  platformFee: number
  netAmount: number
  status: PayoutStatus
  createdAt: Date
  processedAt?: Date
  bankDetails?: string
}

export interface AuditLog {
  id: string
  adminId: string
  adminName: string
  action: string
  resourceType: "user" | "event" | "owner" | "payout" | "settings"
  resourceId: string
  details: string
  timestamp: Date
  ipAddress?: string
}

export interface PlatformStats {
  totalUsers: number
  totalEventOwners: number
  totalEvents: number
  totalBookings: number
  totalRevenue: number
  platformCommission: number
  activeEvents: number
  pendingOwnerApplications: number
  pendingEventReviews: number
}

export interface FeatureFlag {
  id: string
  name: string
  key: string
  description: string
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  key: string
  description: string
  updatedAt: Date
}
