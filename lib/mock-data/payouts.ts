import { Payout, PayoutStatus } from "./types"
import { mockOwners } from "./owners"

// Seeded random function for consistent SSR/CSR data
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

function seededDate(seed: number, start: Date, end: Date): Date {
  return new Date(start.getTime() + seededRandom(seed) * (end.getTime() - start.getTime()))
}

const PLATFORM_FEE_RATE = 0.10 // 10% commission

function generatePayout(index: number): Payout {
  const statuses: PayoutStatus[] = ["completed", "completed", "completed", "pending", "pending", "processing", "failed"]
  const status = statuses[index % statuses.length]
  const owner = mockOwners[index % mockOwners.length]
  const amount = Math.floor(seededRandom(index * 10 + 1) * 450000) + 25000
  const platformFee = Math.floor(amount * PLATFORM_FEE_RATE)
  const createdAt = seededDate(index * 10 + 2, new Date(2024, 6, 1), new Date(2025, 12, 31))
  
  return {
    id: `payout_${String(index + 1).padStart(6, "0")}`,
    ownerId: owner.id,
    owner,
    amount,
    platformFee,
    netAmount: amount - platformFee,
    status,
    createdAt,
    processedAt: status === "completed" 
      ? seededDate(index * 10 + 3, createdAt, new Date(2025, 12, 31))
      : undefined,
    bankDetails: `****${Math.floor(seededRandom(index * 10 + 4) * 9000) + 1000}`
  }
}

export const mockPayouts: Payout[] = Array.from({ length: 50 }, (_, i) => generatePayout(i))

export function getPayoutById(id: string): Payout | undefined {
  return mockPayouts.find(p => p.id === id)
}

export function getPayoutsByOwner(ownerId: string): Payout[] {
  return mockPayouts.filter(p => p.ownerId === ownerId)
}

export function getPayoutsByStatus(status: PayoutStatus): Payout[] {
  return mockPayouts.filter(p => p.status === status)
}

export function getPendingPayouts(): Payout[] {
  return mockPayouts.filter(p => p.status === "pending" || p.status === "processing")
}

export function getPayoutStats() {
  const totalPayouts = mockPayouts.length
  const completedPayouts = mockPayouts.filter(p => p.status === "completed")
  const pendingPayouts = mockPayouts.filter(p => p.status === "pending" || p.status === "processing")
  
  const totalPaid = completedPayouts.reduce((sum, p) => sum + p.netAmount, 0)
  const totalPending = pendingPayouts.reduce((sum, p) => sum + p.netAmount, 0)
  const totalCommission = mockPayouts.reduce((sum, p) => sum + p.platformFee, 0)

  return {
    totalPayouts,
    completedCount: completedPayouts.length,
    pendingCount: pendingPayouts.length,
    totalPaid,
    totalPending,
    totalCommission
  }
}

export function getPayoutsByMonth(): { month: string; paid: number; commission: number }[] {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]
  
  return months.map((month, index) => {
    const monthPayouts = mockPayouts.filter(p => 
      p.createdAt.getMonth() === index && 
      p.createdAt.getFullYear() === 2025 &&
      p.status === "completed"
    )
    return {
      month,
      paid: monthPayouts.reduce((sum, p) => sum + p.netAmount, 0),
      commission: monthPayouts.reduce((sum, p) => sum + p.platformFee, 0)
    }
  })
}
