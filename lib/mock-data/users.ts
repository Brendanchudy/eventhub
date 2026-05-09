import { User, UserRole, UserStatus } from "./types"

const firstNames = [
  "James", "Emma", "Liam", "Olivia", "Noah", "Ava", "William", "Sophia",
  "Oliver", "Isabella", "Benjamin", "Mia", "Elijah", "Charlotte", "Lucas",
  "Amelia", "Mason", "Harper", "Ethan", "Evelyn", "Alexander", "Abigail",
  "Henry", "Emily", "Sebastian", "Elizabeth", "Daniel", "Sofia", "Matthew",
  "Avery", "Joseph", "Ella", "David", "Scarlett", "Carter", "Grace",
  "Owen", "Victoria", "Wyatt", "Riley", "John", "Aria", "Jack", "Luna",
  "Luke", "Chloe", "Jayden", "Penelope", "Dylan", "Layla"
]

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
  "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
  "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
  "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark",
  "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King",
  "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green",
  "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell"
]

// Seeded random function for consistent SSR/CSR data
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

function seededDate(seed: number, start: Date, end: Date): Date {
  return new Date(start.getTime() + seededRandom(seed) * (end.getTime() - start.getTime()))
}

function generateUser(index: number): User {
  const firstName = firstNames[index % firstNames.length]
  const lastName = lastNames[(index * 7) % lastNames.length]
  const roles: UserRole[] = ["attendee", "attendee", "attendee", "attendee", "event_owner"]
  const statuses: UserStatus[] = ["active", "active", "active", "active", "active", "pending", "suspended"]
  
  return {
    id: `user_${String(index + 1).padStart(5, "0")}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    avatar: index % 3 === 0 ? `https://i.pravatar.cc/150?u=${index}` : undefined,
    role: roles[index % roles.length],
    status: statuses[index % statuses.length],
    createdAt: seededDate(index * 10 + 1, new Date(2023, 0, 1), new Date(2025, 11, 31)),
    lastLogin: seededRandom(index * 10 + 2) > 0.2 ? seededDate(index * 10 + 3, new Date(2025, 0, 1), new Date(2025, 12, 31)) : undefined,
    totalBookings: Math.floor(seededRandom(index * 10 + 4) * 20),
    totalSpent: Math.floor(seededRandom(index * 10 + 5) * 5000)
  }
}

export const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => generateUser(i))

// Add some specific admin users
mockUsers.push({
  id: "admin_001",
  name: "Super Admin",
  email: "admin@eventhub.com",
  avatar: "https://i.pravatar.cc/150?u=admin",
  role: "admin",
  status: "active",
  createdAt: new Date(2023, 0, 1),
  lastLogin: new Date()
})

export function getUserById(id: string): User | undefined {
  return mockUsers.find(u => u.id === id)
}

export function getUsersByRole(role: UserRole): User[] {
  return mockUsers.filter(u => u.role === role)
}

export function searchUsers(query: string): User[] {
  const lowerQuery = query.toLowerCase()
  return mockUsers.filter(u => 
    u.name.toLowerCase().includes(lowerQuery) ||
    u.email.toLowerCase().includes(lowerQuery)
  )
}
