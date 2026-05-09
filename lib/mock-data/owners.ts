import { EventOwner, OwnerStatus } from "./types"
import { mockUsers } from "./users"

const businessNames = [
  "Lagos Events Collective",
  "Abuja Summit Productions",
  "Calabar Creative Gatherings",
  "Port Harcourt Nightlife Co.",
  "Ibadan Experience Hub",
  "Kano Cultural Affairs",
  "Enugu Tech & Arts",
  "Benin Heritage Events",
  "Uyo Sound & Stage",
  "Jos Plateau Gatherings",
  "Akure Live Promotions",
  "Owerri Weekend Series",
  "Zaria Northern Lights Events",
  "Minna Community Festivals",
  "Asaba Delta Shows"
]

function slugBusiness(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 40)
}

// Seeded random function for consistent SSR/CSR data
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

function seededDate(seed: number, start: Date, end: Date): Date {
  return new Date(start.getTime() + seededRandom(seed) * (end.getTime() - start.getTime()))
}

function nigeriaMobile(seed: number): string {
  const prefixes = ["803", "806", "814", "903", "905", "708", "701", "802"]
  const prefix = prefixes[Math.floor(seededRandom(seed) * prefixes.length)]
  const mid = String(Math.floor(seededRandom(seed + 1) * 900) + 100).padStart(3, "0")
  const last = String(Math.floor(seededRandom(seed + 2) * 9000) + 1000).padStart(4, "0")
  return `+234 ${prefix} ${mid} ${last}`
}

function generateOwner(index: number): EventOwner {
  const statuses: OwnerStatus[] = ["approved", "approved", "approved", "approved", "pending", "pending", "rejected", "suspended"]
  const status = statuses[index % statuses.length]
  const user = mockUsers.find(u => u.role === "event_owner") || mockUsers[index]

  const businessName = businessNames[index % businessNames.length]
  const slug = slugBusiness(businessName)
  const applicationDate = seededDate(index * 10 + 1, new Date(2024, 0, 1), new Date(2025, 5, 1))
  const approvedDate = status === "approved"
    ? seededDate(index * 10 + 2, applicationDate, new Date(2025, 12, 31))
    : undefined

  const ownerFirst = businessName.split(" ")[0]

  return {
    id: `owner_${String(index + 1).padStart(5, "0")}`,
    userId: user.id,
    user: {
      ...user,
      id: `user_owner_${index + 1}`,
      role: "event_owner" as const,
      name: `${ownerFirst} Lead`,
      email: `contact@${slug}.ng`
    },
    businessName,
    businessEmail: `info@${slug}.ng`,
    phone: nigeriaMobile(index * 10 + 3),
    status,
    applicationDate,
    approvedDate,
    totalEvents: status === "approved" ? Math.floor(seededRandom(index * 10 + 6) * 15) + 1 : 0,
    totalRevenue: status === "approved" ? Math.floor(seededRandom(index * 10 + 7) * 9500000) + 500000 : 0,
    pendingPayout: status === "approved" ? Math.floor(seededRandom(index * 10 + 8) * 900000) + 50000 : 0,
    documents: ["cac_certificate.pdf", "tax_identification.pdf"]
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
