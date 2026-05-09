import { Event, EventStatus } from "./types"

const eventTitles = [
  "Lagos Tech & Startup Summit 2026",
  "Afrobeats Live — Freedom Park",
  "Digital Marketing Masterclass Abuja",
  "Founders Pitch Night Victoria Island",
  "Jazz Under the Stars — Ikoyi",
  "AI & Data Skills Workshop Lekki",
  "Taste of Nigeria Food Festival",
  "Street Photography Walk — CMS",
  "Wellness Weekend Retreat Obudu",
  "Laff Mattaz Comedy Special",
  "FinTech & Banking Forum",
  "Design Sprint Workshop Yaba",
  "Nollywood Indie Film Evening",
  "Chef's Table Pop-Up VI",
  "Electro Night Owambe Series",
  "SME Networking Mixer Ikeja",
  "Contemporary Art Opening Ikoyi",
  "National Science Fair Abuja",
  "Lagos Fashion Weekend Preview",
  "Health & Wellness Expo VI",
  "Esports Championship Lagos",
  "WordFest Poetry Slam",
  "Craft & Culture Festival Calabar",
  "City Marathon Training Camp",
  "Classical Evening Muson Centre"
]

const categories = [
  "Technology",
  "Music",
  "Business",
  "Food & Drink",
  "Health & Wellness",
  "Arts & Culture",
  "Sports",
  "Education",
  "Entertainment",
  "Networking"
]

const locations = [
  "Eko Hotel, Victoria Island, Lagos",
  "Landmark Centre, Oniru, Lagos",
  "Transcorp Hilton, Maitama, Abuja",
  "Freedom Park, Lagos Island",
  "Muson Centre, Onikan, Lagos",
  "ICC Abuja, Central Area",
  "OCC Event Centre, Port Harcourt",
  "IICC Ibadan, Oyo State",
  "Millennium Park, Abuja",
  "Terra Kulture, VI, Lagos"
]

// Seeded random function for consistent SSR/CSR data
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

function seededDate(seed: number, start: Date, end: Date): Date {
  return new Date(start.getTime() + seededRandom(seed) * (end.getTime() - start.getTime()))
}

function generateEvent(index: number): Event {
  const statuses: EventStatus[] = ["published", "published", "published", "pending_review", "draft", "completed", "cancelled"]
  const status = statuses[index % statuses.length]
  const capacity = Math.floor(seededRandom(index * 100 + 1) * 500) + 50
  const ticketsSold = status === "completed"
    ? Math.floor(capacity * (0.7 + seededRandom(index * 100 + 2) * 0.3))
    : Math.floor(seededRandom(index * 100 + 3) * capacity * 0.8)
  const ticketPrice = Math.floor(seededRandom(index * 100 + 4) * 45000) + 2500

  const startDate = seededDate(index * 100 + 5, new Date(2025, 0, 1), new Date(2026, 11, 31))
  const endDate = new Date(startDate.getTime() + Math.floor(seededRandom(index * 100 + 6) * 3 + 1) * 24 * 60 * 60 * 1000)

  return {
    id: `event_${String(index + 1).padStart(5, "0")}`,
    title: eventTitles[index % eventTitles.length],
    description: `A standout ${categories[index % categories.length].toLowerCase()} experience in Nigeria — top speakers, great networking, and local flavour.`,
    ownerId: `owner_${String((index % 10) + 1).padStart(5, "0")}`,
    category: categories[index % categories.length],
    status,
    startDate,
    endDate,
    location: locations[index % locations.length],
    capacity,
    ticketsSold,
    revenue: ticketsSold * ticketPrice,
    imageUrl: `https://picsum.photos/seed/${index}/800/400`,
    createdAt: seededDate(index * 100 + 7, new Date(2024, 0, 1), new Date(2025, 5, 1)),
    updatedAt: seededDate(index * 100 + 8, new Date(2025, 5, 1), new Date(2025, 12, 31)),
    flagCount: seededRandom(index * 100 + 9) > 0.9 ? Math.floor(seededRandom(index * 100 + 10) * 5) + 1 : 0
  }
}

export const mockEvents: Event[] = Array.from({ length: 25 }, (_, i) => generateEvent(i))

export function getEventById(id: string): Event | undefined {
  return mockEvents.find(e => e.id === id)
}

export function getEventsByStatus(status: EventStatus): Event[] {
  return mockEvents.filter(e => e.status === status)
}

export function getEventsByOwner(ownerId: string): Event[] {
  return mockEvents.filter(e => e.ownerId === ownerId)
}

export function searchEvents(query: string): Event[] {
  const lowerQuery = query.toLowerCase()
  return mockEvents.filter(e =>
    e.title.toLowerCase().includes(lowerQuery) ||
    e.category.toLowerCase().includes(lowerQuery) ||
    e.location.toLowerCase().includes(lowerQuery)
  )
}

export function getPendingEvents(): Event[] {
  return mockEvents.filter(e => e.status === "pending_review")
}

export function getFlaggedEvents(): Event[] {
  return mockEvents.filter(e => (e.flagCount ?? 0) > 0)
}
