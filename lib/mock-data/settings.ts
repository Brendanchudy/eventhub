import { FeatureFlag, EmailTemplate, PlatformStats } from "./types"
import { mockUsers } from "./users"
import { mockOwners } from "./owners"
import { mockEvents } from "./events"
import { mockBookings } from "./bookings"

export const featureFlags: FeatureFlag[] = [
  {
    id: "ff_001",
    name: "New Booking Flow",
    key: "new_booking_flow",
    description: "Enable the redesigned booking checkout experience with improved UX",
    enabled: true,
    createdAt: new Date(2024, 6, 1),
    updatedAt: new Date(2025, 3, 15)
  },
  {
    id: "ff_002",
    name: "Event Recommendations",
    key: "event_recommendations",
    description: "AI-powered event recommendations on the homepage",
    enabled: true,
    createdAt: new Date(2024, 8, 1),
    updatedAt: new Date(2025, 2, 10)
  },
  {
    id: "ff_003",
    name: "Social Sharing",
    key: "social_sharing",
    description: "Allow users to share events to social media platforms",
    enabled: true,
    createdAt: new Date(2024, 3, 1),
    updatedAt: new Date(2024, 11, 20)
  },
  {
    id: "ff_004",
    name: "Waitlist Mode",
    key: "waitlist_mode",
    description: "Enable waitlist for sold-out events",
    enabled: false,
    createdAt: new Date(2025, 0, 15),
    updatedAt: new Date(2025, 1, 1)
  },
  {
    id: "ff_005",
    name: "Multi-currency Support",
    key: "multi_currency",
    description: "Allow event owners to set prices in multiple currencies",
    enabled: false,
    createdAt: new Date(2025, 2, 1),
    updatedAt: new Date(2025, 2, 1)
  },
  {
    id: "ff_006",
    name: "QR Check-in",
    key: "qr_checkin",
    description: "Enable QR code scanning for event check-in",
    enabled: true,
    createdAt: new Date(2024, 5, 1),
    updatedAt: new Date(2025, 0, 5)
  },
  {
    id: "ff_007",
    name: "Refund Automation",
    key: "refund_automation",
    description: "Automatically process refunds for cancelled events",
    enabled: true,
    createdAt: new Date(2024, 9, 1),
    updatedAt: new Date(2025, 1, 15)
  },
  {
    id: "ff_008",
    name: "Dark Mode",
    key: "dark_mode",
    description: "Allow users to switch to dark mode theme",
    enabled: true,
    createdAt: new Date(2024, 4, 1),
    updatedAt: new Date(2024, 10, 1)
  }
]

export const emailTemplates: EmailTemplate[] = [
  {
    id: "et_001",
    name: "Welcome Email",
    subject: "Welcome to EventHub!",
    key: "welcome_email",
    description: "Sent to new users after registration",
    updatedAt: new Date(2025, 2, 10)
  },
  {
    id: "et_002",
    name: "Booking Confirmation",
    subject: "Your booking is confirmed!",
    key: "booking_confirmation",
    description: "Sent after successful booking payment",
    updatedAt: new Date(2025, 3, 5)
  },
  {
    id: "et_003",
    name: "Event Reminder",
    subject: "Reminder: Your event is tomorrow",
    key: "event_reminder",
    description: "Sent 24 hours before event start",
    updatedAt: new Date(2025, 1, 20)
  },
  {
    id: "et_004",
    name: "Owner Application Approved",
    subject: "Congratulations! Your application is approved",
    key: "owner_approved",
    description: "Sent when event owner application is approved",
    updatedAt: new Date(2025, 0, 15)
  },
  {
    id: "et_005",
    name: "Owner Application Rejected",
    subject: "Update on your EventHub application",
    key: "owner_rejected",
    description: "Sent when event owner application is rejected",
    updatedAt: new Date(2025, 0, 15)
  },
  {
    id: "et_006",
    name: "Payout Processed",
    subject: "Your payout has been processed",
    key: "payout_processed",
    description: "Sent to event owners when payout is completed",
    updatedAt: new Date(2025, 2, 1)
  },
  {
    id: "et_007",
    name: "Event Approved",
    subject: "Your event has been approved!",
    key: "event_approved",
    description: "Sent when event passes moderation review",
    updatedAt: new Date(2025, 3, 1)
  },
  {
    id: "et_008",
    name: "Password Reset",
    subject: "Reset your password",
    key: "password_reset",
    description: "Sent when user requests password reset",
    updatedAt: new Date(2024, 11, 1)
  }
]

export function getPlatformStats(): PlatformStats {
  const totalUsers = mockUsers.length
  const totalEventOwners = mockOwners.filter(o => o.status === "approved").length
  const totalEvents = mockEvents.length
  const totalBookings = mockBookings.length
  const totalRevenue = mockBookings
    .filter(b => b.status === "confirmed")
    .reduce((sum, b) => sum + b.totalAmount, 0)
  const platformCommission = Math.floor(totalRevenue * 0.10)
  const activeEvents = mockEvents.filter(e => e.status === "published").length
  const pendingOwnerApplications = mockOwners.filter(o => o.status === "pending").length
  const pendingEventReviews = mockEvents.filter(e => e.status === "pending_review").length

  return {
    totalUsers,
    totalEventOwners,
    totalEvents,
    totalBookings,
    totalRevenue,
    platformCommission,
    activeEvents,
    pendingOwnerApplications,
    pendingEventReviews
  }
}

export const platformSettings = {
  commissionRate: 10,
  supportedCurrencies: ["USD", "EUR", "GBP"],
  defaultCurrency: "USD",
  maintenanceMode: false,
  minTicketPrice: 5,
  maxTicketPrice: 10000,
  maxTicketsPerBooking: 10,
  refundWindowDays: 7
}

export function getFeatureFlagByKey(key: string): FeatureFlag | undefined {
  return featureFlags.find(f => f.key === key)
}

export function getEmailTemplateByKey(key: string): EmailTemplate | undefined {
  return emailTemplates.find(t => t.key === key)
}
