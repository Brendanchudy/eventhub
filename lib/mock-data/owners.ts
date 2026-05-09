import { EventOwner, OwnerStatus, User } from "./types"
import { mockUsers } from "./users"

const businessNames = [
  "TechVentures Events",
  "Creative Gatherings Co.",
  "Summit Productions",
  "EventCraft Studios",
  "Momentum Events",
  "Stellar Experiences",
  "Prime Event Group",
  "Horizon Productions",
  "Apex Event Management",
  "Vivid Events Co.",
  "NextGen Conferences",
  "Urban Event Collective",
  "Inspire Events LLC",
  "Catalyst Productions",
  "Elevate Experience Co."
]

// Seeded random function for consistent SSR/CSR data
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

function seededDate(seed: number, start: Date, end: Date): Date {
  return new Date(start.getTime() + seededRandom(seed) * (end.getTime() - start.getTime()))
}

function generateOwner(index: number): EventOwner {
  const statuses: OwnerStatus[] = ["approved", "approved", "approved", "approved", "pending", "pending", "rejected", "suspended"]
  const status = statuses[index % statuses.length]
  const user = mockUsers.find(u => u.role === "event_owner") || mockUsers[index]
  
  const applicationDate = seededDate(index * 10 + 1, new Date(2024, 0, 1), new Date(2025, 5, 1))
  const approvedDate = status === "approved" 
    ? seededDate(index * 10 + 2, applicationDate, new Date(2025, 12, 31))
    : undefined

  return {
    id: `owner_${String(index + 1).padStart(5, "0")}`,
    userId: user.id,
    user: {
      ...user,
      id: `user_owner_${index + 1}`,
      role: "event_owner" as const,
      name: `${businessNames[index % businessNames.length].split(" ")[0]} Owner`,
      email: `contact@${businessNames[index % businessNames.length].toLowerCase().replace(/\s+/g, "")}.com`
    },
    businessName: businessNames[index % businessNames.length],
    businessEmail: `info@${businessNames[index % businessNames.length].toLowerCase().replace(/\s+/g, "")}.com`,
    phone: `+1 (${Math.floor(seededRandom(index * 10 + 3) * 900) + 100}) ${Math.floor(seededRandom(index * 10 + 4) * 900) + 100}-${Math.floor(seededRandom(index * 10 + 5) * 9000) + 1000}`,
    status,
    applicationDate,
    approvedDate,
    totalEvents: status === "approved" ? Math.floor(seededRandom(index * 10 + 6) * 15) + 1 : 0,
    totalRevenue: status === "approved" ? Math.floor(seededRandom(index * 10 + 7) * 100000) + 5000 : 0,
    pendingPayout: status === "approved" ? Math.floor(seededRandom(index * 10 + 8) * 10000) : 0,
    documents: ["business_license.pdf", "tax_id.pdf"]
  }
}

export const mockOwners: EventOwner[] = Array.from({ length: 15 }, (_, i) => generateOwner(i))

export function getOwnerById(id: string): EventOwner | undefined {
  return mockOwners.find(o => o.id === id)
}

export function getOwnersByStatus(status: OwnerStatus): EventOwner[] {
  return mockOwners.filter(o => o.status === status)
}

export function getPendingOwners(): EventOwner[] {
  return mockOwners.filter(o => o.status === "pending")
}

export function getApprovedOwners(): EventOwner[] {
  return mockOwners.filter(o => o.status === "approved")
}

export function searchOwners(query: string): EventOwner[] {
  const lowerQuery = query.toLowerCase()
  return mockOwners.filter(o => 
    o.businessName.toLowerCase().includes(lowerQuery) ||
    o.user.name.toLowerCase().includes(lowerQuery) ||
    o.businessEmail.toLowerCase().includes(lowerQuery)
  )
}
