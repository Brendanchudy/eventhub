import { User, UserRole, UserStatus } from "./types"

const firstNames = [
  "Adebayo", "Chioma", "Emeka", "Funmilayo", "Ibrahim", "Kemi", "Ngozi", "Obinna",
  "Olumide", "Tolu", "Yewande", "Zainab", "Amaka", "Chidi", "Damilola", "Folake",
  "Habiba", "Ifeanyi", "Jumoke", "Kunle", "Mosunmola", "Nnamdi", "Oluwaseun", "Peace",
  "Quadri", "Sade", "Tunde", "Uche", "Yusuf", "Amina", "Bukola", "Chinedu",
  "Ejiro", "Gbenga", "Halima", "Isioma", "Jamila", "Kehinde", "Lola", "Mustapha",
  "Nwakaego", "Olayinka", "Peter", "Rukayat", "Segun", "Taiwo", "Victoria", "Wale",
  "Yetunde", "Zara"
]

const lastNames = [
  "Adeyemi", "Okonkwo", "Mohammed", "Okafor", "Ibrahim", "Adeleke", "Nwosu", "Bello",
  "Eze", "Ogunleye", "Yusuf", "Chukwu", "Danjuma", "Ajayi", "Balogun", "Ezeilo",
  "Fashola", "Garba", "Hassan", "Idris", "Jimoh", "Kalu", "Lawal", "Musa",
  "Nnaji", "Obi", "Onyeka", "Popoola", "Quadri", "Raji", "Suleiman", "Taiwo",
  "Udo", "Uwais", "Williams", "Yakubu", "Abubakar", "Bako", "Chukwuma", "Dauda",
  "Effiong", "Farouk", "Gbadamosi", "Ibeanusi", "Jibril", "Kashim", "Lawrence", "Maduka"
]

// Seeded random function for consistent SSR/CSR data
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

function seededDate(seed: number, start: Date, end: Date): Date {
  return new Date(start.getTime() + seededRandom(seed) * (end.getTime() - start.getTime()))
}

function slugEmailPart(first: string, last: string): string {
  const raw = `${first}.${last}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  return raw.replace(/[^a-z0-9.]/g, "")
}

function generateUser(index: number): User {
  const firstName = firstNames[index % firstNames.length]
  const lastName = lastNames[(index * 7) % lastNames.length]
  const roles: UserRole[] = ["attendee", "attendee", "attendee", "attendee", "event_owner"]
  const statuses: UserStatus[] = ["active", "active", "active", "active", "active", "pending", "suspended"]

  return {
    id: `user_${String(index + 1).padStart(5, "0")}`,
    name: `${firstName} ${lastName}`,
    email: `${slugEmailPart(firstName, lastName)}@example.ng`,
    avatar: index % 3 === 0 ? `https://i.pravatar.cc/150?u=${index}` : undefined,
    role: roles[index % roles.length],
    status: statuses[index % statuses.length],
    createdAt: seededDate(index * 10 + 1, new Date(2023, 0, 1), new Date(2025, 11, 31)),
    lastLogin: seededRandom(index * 10 + 2) > 0.2 ? seededDate(index * 10 + 3, new Date(2025, 0, 1), new Date(2025, 12, 31)) : undefined,
    totalBookings: Math.floor(seededRandom(index * 10 + 4) * 20),
    totalSpent: Math.floor(seededRandom(index * 10 + 5) * 800000)
  }
}

export const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => generateUser(i))

// Add some specific admin users
mockUsers.push({
  id: "admin_001",
  name: "Chioma Okonkwo",
  email: "admin@brendanskitchen.ng",
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
