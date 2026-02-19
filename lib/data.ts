// ==========================================
// TYPES
// ==========================================

export type PersonRole = "coordinator" | "volunteer" | "coach" | "medic" | "security" | "referee"

export interface Person {
  id: string
  name: string
  role: PersonRole
  hourlyRate: number
  email: string
  phone: string
  provider?: string
}

export type EquipmentCategory = "venue" | "gear" | "transport" | "tech" | "furniture"

export interface Equipment {
  id: string
  name: string
  category: EquipmentCategory
  unitCost: number
  quantity: number
  description: string
  provider?: string
}

export type FinancialCategory = "marketing" | "catering" | "insurance" | "permits" | "printing" | "misc"

export interface FinancialItem {
  id: string
  name: string
  category: FinancialCategory
  unitCost: number
  quantity: number
  provider?: string
}

export type CommunicationType = "social-media" | "press" | "signage" | "email-campaign" | "live-stream"

export interface CommunicationItem {
  id: string
  name: string
  type: CommunicationType
  cost: number
  provider?: string
}

export type EventType = "tournament" | "program" | "session"
export type EventStatus = "draft" | "planned" | "active" | "completed"

export type SocialImpactAngle =
  | "health-wellbeing"
  | "youth-empowerment"
  | "social-inclusion-diversity"
  | "community-building"
  | "grassroots-sports-development"
  | "employment-economic-opportunity"
  | "gender-equity-in-sport"
  | "urban-safe-public-spaces"
  | "peace-fair-play-social-cohesion"
  | "education-through-sport"
  | "environmental-responsibility"
  | "partnerships-for-impact"

export const SOCIAL_IMPACT_ANGLES: { value: SocialImpactAngle; label: string; description: string }[] = [
  { value: "health-wellbeing", label: "Health & Well-Being", description: "Promoting physical and mental health through active participation in sport." },
  { value: "youth-empowerment", label: "Youth Empowerment", description: "Developing leadership, confidence, and life skills among young people." },
  { value: "social-inclusion-diversity", label: "Social Inclusion & Diversity", description: "Creating equal opportunities for all regardless of background." },
  { value: "community-building", label: "Community Building", description: "Strengthening social bonds and local community ties through shared experiences." },
  { value: "grassroots-sports-development", label: "Grassroots Sports Development", description: "Growing sport participation at the local and amateur level." },
  { value: "employment-economic-opportunity", label: "Employment & Economic Opportunity", description: "Creating jobs and economic activity through event operations." },
  { value: "gender-equity-in-sport", label: "Gender Equity in Sport", description: "Advancing equal representation and opportunity across genders." },
  { value: "urban-safe-public-spaces", label: "Urban & Safe Public Spaces", description: "Activating public spaces and making urban areas safer through sport." },
  { value: "peace-fair-play-social-cohesion", label: "Peace, Fair Play & Social Cohesion", description: "Using sport to build trust, respect, and peaceful coexistence." },
  { value: "education-through-sport", label: "Education Through Sport", description: "Leveraging sport as a vehicle for learning and personal development." },
  { value: "environmental-responsibility", label: "Environmental Responsibility", description: "Minimizing environmental impact and promoting sustainability." },
  { value: "partnerships-for-impact", label: "Partnerships for Impact", description: "Building cross-sector partnerships to amplify social outcomes." },
]

export interface SportEvent {
  id: string
  name: string
  type: EventType
  sport: string
  startDate: string
  endDate: string
  location: string
  description: string
  status: EventStatus
  assignedPeople: string[]
  assignedEquipment: string[]
  assignedFinancials: string[]
  assignedCommunication: string[]
  sponsorshipId?: string
  // Event project wizard fields
  mission?: string
  targetAudience?: string
  expectedImpact?: string
  valueProposition?: string
  socialImpactAngles?: SocialImpactAngle[]
  expectedAttendance?: number
  createdAt?: string
}

export type SponsorTier = "platinum" | "gold" | "silver" | "bronze"
export type SponsorStatus = "prospect" | "contacted" | "confirmed" | "declined"

export interface Sponsor {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  tier: SponsorTier
  amount: number
  status: SponsorStatus
}

export type ProposalStatus = "draft" | "sent" | "accepted" | "rejected"

export interface BenefitItem {
  tier: SponsorTier
  benefits: string[]
}

export interface SponsorshipProposal {
  id: string
  title: string
  eventId: string
  sponsorIds: string[]
  proposedBudget: number
  benefits: BenefitItem[]
  roiEstimates: {
    expectedAudience: number
    mediaReach: number
    socialImpressions: number
    estimatedROI: string
  }
  status: ProposalStatus
  createdAt: string
}

// ==========================================
// DUMMY DATA
// ==========================================

export const initialPeople: Person[] = [
  { id: "p1", name: "Sarah Mitchell", role: "coordinator", hourlyRate: 45, email: "sarah@sportorg.com", phone: "+1 555-0101", provider: "SportOrg Events" },
  { id: "p2", name: "James Rodriguez", role: "coach", hourlyRate: 55, email: "james@sportorg.com", phone: "+1 555-0102", provider: "Elite Coaching Co." },
  { id: "p3", name: "Emily Chen", role: "medic", hourlyRate: 60, email: "emily@sportorg.com", phone: "+1 555-0103", provider: "MedTeam Inc." },
  { id: "p4", name: "Marcus Johnson", role: "security", hourlyRate: 35, email: "marcus@sportorg.com", phone: "+1 555-0104", provider: "SecureEvents Ltd." },
  { id: "p5", name: "Lisa Park", role: "volunteer", hourlyRate: 15, email: "lisa@sportorg.com", phone: "+1 555-0105", provider: "Community Volunteers" },
  { id: "p6", name: "David Thompson", role: "referee", hourlyRate: 50, email: "david@sportorg.com", phone: "+1 555-0106", provider: "Officials Association" },
  { id: "p7", name: "Ana Gutierrez", role: "coordinator", hourlyRate: 45, email: "ana@sportorg.com", phone: "+1 555-0107", provider: "SportOrg Events" },
  { id: "p8", name: "Ryan O'Brien", role: "volunteer", hourlyRate: 15, email: "ryan@sportorg.com", phone: "+1 555-0108", provider: "Community Volunteers" },
  { id: "p9", name: "Priya Sharma", role: "coach", hourlyRate: 55, email: "priya@sportorg.com", phone: "+1 555-0109", provider: "Elite Coaching Co." },
  { id: "p10", name: "Tom Baker", role: "security", hourlyRate: 35, email: "tom@sportorg.com", phone: "+1 555-0110", provider: "SecureEvents Ltd." },
]

export const initialEquipment: Equipment[] = [
  { id: "e1", name: "Main Stadium Rental", category: "venue", unitCost: 5000, quantity: 1, description: "Full-day stadium rental with seating for 2000", provider: "StadiumCo" },
  { id: "e2", name: "Indoor Court Rental", category: "venue", unitCost: 800, quantity: 2, description: "Basketball/volleyball court per day", provider: "City Sports Center" },
  { id: "e3", name: "Soccer Ball Set (20)", category: "gear", unitCost: 300, quantity: 1, description: "Professional match-quality soccer balls", provider: "RentAll Sports" },
  { id: "e4", name: "Basketball Set (15)", category: "gear", unitCost: 250, quantity: 1, description: "Official game basketballs", provider: "RentAll Sports" },
  { id: "e5", name: "Team Bus Charter", category: "transport", unitCost: 600, quantity: 2, description: "50-seat charter bus for the day", provider: "Metro Transit Charters" },
  { id: "e6", name: "Sound System", category: "tech", unitCost: 1200, quantity: 1, description: "PA system with microphones and speakers", provider: "AV Solutions" },
  { id: "e7", name: "Scoreboard Display", category: "tech", unitCost: 800, quantity: 2, description: "LED digital scoreboard", provider: "AV Solutions" },
  { id: "e8", name: "Folding Tables (10-pack)", category: "furniture", unitCost: 150, quantity: 3, description: "6-foot folding tables for registration/catering", provider: "Event Furnishings" },
  { id: "e9", name: "Folding Chairs (50-pack)", category: "furniture", unitCost: 200, quantity: 4, description: "Standard event folding chairs", provider: "Event Furnishings" },
  { id: "e10", name: "First Aid Kit (Pro)", category: "gear", unitCost: 120, quantity: 2, description: "Professional sports first aid kit", provider: "MedTeam Inc." },
]

export const initialFinancials: FinancialItem[] = [
  { id: "f1", name: "Social Media Ad Campaign", category: "marketing", unitCost: 500, quantity: 1, provider: "MediaBuzz Agency" },
  { id: "f2", name: "Print Flyers (500 pcs)", category: "printing", unitCost: 150, quantity: 2, provider: "PrintHouse" },
  { id: "f3", name: "Catering - Lunch Buffet", category: "catering", unitCost: 25, quantity: 100, provider: "FreshBite Catering" },
  { id: "f4", name: "Event Insurance", category: "insurance", unitCost: 1200, quantity: 1, provider: "CityInsure" },
  { id: "f5", name: "City Event Permit", category: "permits", unitCost: 350, quantity: 1, provider: "City Hall" },
  { id: "f6", name: "Trophies & Medals", category: "misc", unitCost: 80, quantity: 10, provider: "Trophy World" },
  { id: "f7", name: "Banners & Signage", category: "printing", unitCost: 200, quantity: 4, provider: "PrintHouse" },
  { id: "f8", name: "Photographer", category: "marketing", unitCost: 400, quantity: 1, provider: "LensCapture Studio" },
]

export const initialCommunication: CommunicationItem[] = [
  { id: "c1", name: "Instagram Campaign", type: "social-media", cost: 300, provider: "MediaBuzz Agency" },
  { id: "c2", name: "Facebook Event Promotion", type: "social-media", cost: 200, provider: "MediaBuzz Agency" },
  { id: "c3", name: "Local Press Release", type: "press", cost: 150, provider: "PR Newswire" },
  { id: "c4", name: "Event Banner Set", type: "signage", cost: 450, provider: "PrintHouse" },
  { id: "c5", name: "Email Newsletter Blast", type: "email-campaign", cost: 100, provider: "EmailMarketing Plus" },
  { id: "c6", name: "YouTube Live Stream", type: "live-stream", cost: 800, provider: "StreamTech Pro" },
]

export const initialEvents: SportEvent[] = [
  {
    id: "ev1",
    name: "City Cup Football Tournament",
    type: "tournament",
    sport: "Football",
    startDate: "2026-03-15",
    endDate: "2026-03-17",
    location: "Central Stadium",
    description: "Annual inter-city football tournament featuring 16 teams competing over 3 days.",
    status: "planned",
    assignedPeople: ["p1", "p2", "p4", "p5", "p6"],
    assignedEquipment: ["e1", "e3", "e6", "e8"],
    assignedFinancials: ["f1", "f3", "f4", "f5", "f6"],
    assignedCommunication: ["c1", "c3", "c4"],
  },
  {
    id: "ev2",
    name: "Youth Basketball Program",
    type: "program",
    sport: "Basketball",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    location: "Community Sports Center",
    description: "12-week youth development basketball program for ages 10-16.",
    status: "draft",
    assignedPeople: ["p2", "p3", "p5", "p9"],
    assignedEquipment: ["e2", "e4", "e10"],
    assignedFinancials: ["f2", "f8"],
    assignedCommunication: ["c2", "c5"],
  },
  {
    id: "ev3",
    name: "Marathon Training Session",
    type: "session",
    sport: "Athletics",
    startDate: "2026-03-01",
    endDate: "2026-03-01",
    location: "Riverside Park Track",
    description: "One-day intensive marathon preparation session with certified coaches.",
    status: "active",
    assignedPeople: ["p2", "p3", "p8"],
    assignedEquipment: ["e10"],
    assignedFinancials: ["f2"],
    assignedCommunication: ["c5"],
  },
  {
    id: "ev4",
    name: "Swimming Championship",
    type: "tournament",
    sport: "Swimming",
    startDate: "2026-05-10",
    endDate: "2026-05-12",
    location: "Aquatic Center",
    description: "Regional swimming championship with individual and relay events.",
    status: "planned",
    assignedPeople: ["p1", "p3", "p6", "p7", "p10"],
    assignedEquipment: ["e6", "e7", "e8", "e9"],
    assignedFinancials: ["f1", "f3", "f4", "f6", "f7"],
    assignedCommunication: ["c1", "c2", "c3", "c6"],
  },
]

export const initialSponsors: Sponsor[] = [
  { id: "s1", name: "SportMax Athletics", contactPerson: "Michael Foster", email: "michael@sportmax.com", phone: "+1 555-0201", tier: "platinum", amount: 25000, status: "confirmed" },
  { id: "s2", name: "FitLife Nutrition", contactPerson: "Jessica Wang", email: "jessica@fitlife.com", phone: "+1 555-0202", tier: "gold", amount: 15000, status: "confirmed" },
  { id: "s3", name: "City First Bank", contactPerson: "Robert Hayes", email: "robert@cityfirst.com", phone: "+1 555-0203", tier: "gold", amount: 12000, status: "contacted" },
  { id: "s4", name: "TechWave Solutions", contactPerson: "Amanda Lee", email: "amanda@techwave.com", phone: "+1 555-0204", tier: "silver", amount: 7500, status: "prospect" },
  { id: "s5", name: "GreenLeaf Organics", contactPerson: "Daniel Cruz", email: "daniel@greenleaf.com", phone: "+1 555-0205", tier: "bronze", amount: 3000, status: "confirmed" },
]

export const initialProposals: SponsorshipProposal[] = [
  {
    id: "pr1",
    title: "City Cup 2026 Sponsorship Package",
    eventId: "ev1",
    sponsorIds: ["s1", "s2", "s3"],
    proposedBudget: 52000,
    benefits: [
      { tier: "platinum", benefits: ["Main jersey branding", "Stadium banner placement", "Opening ceremony mention", "VIP booth", "Social media feature (10 posts)", "Press conference presence"] },
      { tier: "gold", benefits: ["Sideline banner", "Program booklet ad (full page)", "Social media feature (5 posts)", "Event tickets (20)"] },
      { tier: "silver", benefits: ["Program booklet ad (half page)", "Social media mention (3 posts)", "Event tickets (10)"] },
      { tier: "bronze", benefits: ["Program booklet logo", "Social media mention (1 post)", "Event tickets (5)"] },
    ],
    roiEstimates: {
      expectedAudience: 5000,
      mediaReach: 50000,
      socialImpressions: 120000,
      estimatedROI: "3.2x",
    },
    status: "sent",
    createdAt: "2026-01-15",
  },
  {
    id: "pr2",
    title: "Youth Basketball Development Sponsorship",
    eventId: "ev2",
    sponsorIds: ["s2", "s5"],
    proposedBudget: 18000,
    benefits: [
      { tier: "platinum", benefits: ["Program naming rights", "All jersey branding", "Exclusive social media campaign", "Youth community award naming"] },
      { tier: "gold", benefits: ["Jersey sleeve branding", "Facility banner placement", "Social media features (5 posts)"] },
      { tier: "silver", benefits: ["Program booklet ad", "Social media mentions (3 posts)"] },
      { tier: "bronze", benefits: ["Program booklet logo", "Social media mention (1 post)"] },
    ],
    roiEstimates: {
      expectedAudience: 800,
      mediaReach: 15000,
      socialImpressions: 35000,
      estimatedROI: "2.5x",
    },
    status: "draft",
    createdAt: "2026-02-01",
  },
]

// ==========================================
// BUDGET CALCULATION HELPERS
// ==========================================

export function calculateEventBudget(
  event: SportEvent,
  people: Person[],
  equipment: Equipment[],
  financials: FinancialItem[],
  communication: CommunicationItem[]
) {
  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)
  const eventDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1)
  const hoursPerDay = 8

  const peopleCost = event.assignedPeople.reduce((sum, personId) => {
    const person = people.find(p => p.id === personId)
    return sum + (person ? person.hourlyRate * hoursPerDay * eventDays : 0)
  }, 0)

  const equipmentCost = event.assignedEquipment.reduce((sum, equipId) => {
    const equip = equipment.find(e => e.id === equipId)
    return sum + (equip ? equip.unitCost * equip.quantity : 0)
  }, 0)

  const financialsCost = event.assignedFinancials.reduce((sum, finId) => {
    const fin = financials.find(f => f.id === finId)
    return sum + (fin ? fin.unitCost * fin.quantity : 0)
  }, 0)

  const communicationCost = event.assignedCommunication.reduce((sum, commId) => {
    const comm = communication.find(c => c.id === commId)
    return sum + (comm ? comm.cost : 0)
  }, 0)

  return {
    people: peopleCost,
    equipment: equipmentCost,
    financials: financialsCost,
    communication: communicationCost,
    total: peopleCost + equipmentCost + financialsCost + communicationCost,
    eventDays,
  }
}
