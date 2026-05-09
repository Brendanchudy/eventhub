import { AuditLog } from "./types"

const actions = [
  { action: "user.suspended", resourceType: "user" as const, details: "Suspended user due to policy violation" },
  { action: "user.activated", resourceType: "user" as const, details: "Reactivated user account" },
  { action: "user.impersonated", resourceType: "user" as const, details: "Started impersonation session" },
  { action: "event.approved", resourceType: "event" as const, details: "Approved event for publication" },
  { action: "event.rejected", resourceType: "event" as const, details: "Rejected event - inappropriate content" },
  { action: "event.unpublished", resourceType: "event" as const, details: "Unpublished event due to user reports" },
  { action: "owner.approved", resourceType: "owner" as const, details: "Approved event owner application" },
  { action: "owner.rejected", resourceType: "owner" as const, details: "Rejected owner application - incomplete documents" },
  { action: "owner.suspended", resourceType: "owner" as const, details: "Suspended owner publishing privileges" },
  { action: "payout.processed", resourceType: "payout" as const, details: "Processed payout to owner bank account" },
  { action: "payout.held", resourceType: "payout" as const, details: "Held payout pending investigation" },
  { action: "settings.updated", resourceType: "settings" as const, details: "Updated platform commission rate" },
  { action: "settings.feature_flag", resourceType: "settings" as const, details: "Toggled feature flag" },
]

const adminNames = [
  "Chioma Okonkwo",
  "Emeka Adeyemi",
  "Ngozi Mohammed",
  "Ibrahim Lawal"
]

// Seeded random function for consistent SSR/CSR data
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

function seededDate(seed: number, start: Date, end: Date): Date {
  return new Date(start.getTime() + seededRandom(seed) * (end.getTime() - start.getTime()))
}

function generateAuditLog(index: number): AuditLog {
  const actionData = actions[index % actions.length]
  const adminName = adminNames[index % adminNames.length]

  return {
    id: `audit_${String(index + 1).padStart(6, "0")}`,
    adminId: `admin_${String((index % 4) + 1).padStart(3, "0")}`,
    adminName,
    action: actionData.action,
    resourceType: actionData.resourceType,
    resourceId: `${actionData.resourceType}_${String(Math.floor(seededRandom(index * 10 + 1) * 50) + 1).padStart(5, "0")}`,
    details: actionData.details,
    timestamp: seededDate(index * 10 + 2, new Date(2024, 6, 1), new Date(2025, 12, 31)),
    ipAddress: `105.${112 + Math.floor(seededRandom(index * 10 + 3) * 8)}.${Math.floor(seededRandom(index * 10 + 4) * 255)}.${Math.floor(seededRandom(index * 10 + 5) * 255)}`
  }
}

export const mockAuditLogs: AuditLog[] = Array.from({ length: 100 }, (_, i) => generateAuditLog(i))
  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

export function getAuditLogById(id: string): AuditLog | undefined {
  return mockAuditLogs.find(l => l.id === id)
}

export function getAuditLogsByAdmin(adminId: string): AuditLog[] {
  return mockAuditLogs.filter(l => l.adminId === adminId)
}

export function getAuditLogsByResourceType(resourceType: AuditLog["resourceType"]): AuditLog[] {
  return mockAuditLogs.filter(l => l.resourceType === resourceType)
}

export function getAuditLogsByAction(action: string): AuditLog[] {
  return mockAuditLogs.filter(l => l.action === action)
}

export function getRecentAuditLogs(limit: number = 20): AuditLog[] {
  return mockAuditLogs.slice(0, limit)
}

export function searchAuditLogs(query: string): AuditLog[] {
  const lowerQuery = query.toLowerCase()
  return mockAuditLogs.filter(l =>
    l.action.toLowerCase().includes(lowerQuery) ||
    l.adminName.toLowerCase().includes(lowerQuery) ||
    l.details.toLowerCase().includes(lowerQuery) ||
    l.resourceId.toLowerCase().includes(lowerQuery)
  )
}
