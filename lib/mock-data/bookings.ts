import { Booking, BookingStatus } from "./types"
import { mockUsers } from "./users"
import { mockEvents } from "./events"

// Seeded random function for consistent SSR/CSR data
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

function seededDate(seed: number, start: Date, end: Date): Date {
  return new Date(start.getTime() + seededRandom(seed) * (end.getTime() - start.getTime()))
}

const ticketTypes = ["General Admission", "VIP", "Early Bird", "Student", "Group"]

function generateBooking(index: number): Booking {
  const statuses: BookingStatus[] = ["confirmed", "confirmed", "confirmed", "confirmed", "cancelled", "refunded", "pending"]
  const status = statuses[index % statuses.length]
  const user = mockUsers[index % mockUsers.length]
  const event = mockEvents[index % mockEvents.length]
  const quantity = Math.floor(seededRandom(index * 10 + 1) * 4) + 1
  const basePrice = Math.floor(seededRandom(index * 10 + 2) * 150) + 25
  
  return {
    id: `booking_${String(index + 1).padStart(6, "0")}`,
    userId: user.id,
    user,
    eventId: event.id,
    event,
    ticketType: ticketTypes[index % ticketTypes.length],
    quantity,
    totalAmount: quantity * basePrice,
    status,
    createdAt: seededDate(index * 10 + 3, new Date(2024, 6, 1), new Date(2025, 12, 31)),
    checkInTime: status === "confirmed" && seededRandom(index * 10 + 4) > 0.5 
      ? seededDate(index * 10 + 5, new Date(2025, 0, 1), new Date(2025, 12, 31))
      : undefined
  }
}

export const mockBookings: Booking[] = Array.from({ length: 100 }, (_, i) => generateBooking(i))

export function getBookingById(id: string): Booking | undefined {
  return mockBookings.find(b => b.id === id)
}

export function getBookingsByUser(userId: string): Booking[] {
  return mockBookings.filter(b => b.userId === userId)
}

export function getBookingsByEvent(eventId: string): Booking[] {
  return mockBookings.filter(b => b.eventId === eventId)
}

export function getBookingsByStatus(status: BookingStatus): Booking[] {
  return mockBookings.filter(b => b.status === status)
}

export function getRecentBookings(limit: number = 10): Booking[] {
  return [...mockBookings]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
}

// Calculate stats
export function getBookingStats() {
  const totalBookings = mockBookings.length
  const confirmedBookings = mockBookings.filter(b => b.status === "confirmed").length
  const totalRevenue = mockBookings
    .filter(b => b.status === "confirmed")
    .reduce((sum, b) => sum + b.totalAmount, 0)
  const refundedAmount = mockBookings
    .filter(b => b.status === "refunded")
    .reduce((sum, b) => sum + b.totalAmount, 0)

  return {
    totalBookings,
    confirmedBookings,
    totalRevenue,
    refundedAmount,
    conversionRate: ((confirmedBookings / totalBookings) * 100).toFixed(1)
  }
}

// Get bookings by date for charts
export function getBookingsByMonth(): { month: string; bookings: number; revenue: number }[] {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]
  
  return months.map((month, index) => {
    const monthBookings = mockBookings.filter(b => 
      b.createdAt.getMonth() === index && 
      b.createdAt.getFullYear() === 2025
    )
    return {
      month,
      bookings: monthBookings.length,
      revenue: monthBookings
        .filter(b => b.status === "confirmed")
        .reduce((sum, b) => sum + b.totalAmount, 0)
    }
  })
}
