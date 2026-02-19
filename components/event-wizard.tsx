"use client"

import { useState } from "react"
import { ChevronRight, Check, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Person, Equipment, FinancialItem, CommunicationItem, SOCIAL_IMPACT_ANGLES } from "@/lib/data"

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val)

// ============= STEP COMPONENTS =============

function EventBasicsStep({ formData, onUpdate }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Event Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="e.g., City Cup Tournament"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="sport">Sport</Label>
          <Input
            id="sport"
            value={formData.sport}
            onChange={(e) => onUpdate({ sport: e.target.value })}
            placeholder="e.g., Football"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="type">Event Type</Label>
          <Select value={formData.type} onValueChange={(val) => onUpdate({ type: val })}>
            <SelectTrigger id="type"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tournament">Tournament</SelectItem>
              <SelectItem value="program">Program</SelectItem>
              <SelectItem value="session">Session</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
            placeholder="Venue or address"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => onUpdate({ startDate: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => onUpdate({ endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Brief description of the event"
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="mission">Mission Statement</Label>
        <Textarea
          id="mission"
          value={formData.mission}
          onChange={(e) => onUpdate({ mission: e.target.value })}
          placeholder="What is the core mission and purpose of this event?"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="targetAudience">Target Audience</Label>
          <Input
            id="targetAudience"
            value={formData.targetAudience}
            onChange={(e) => onUpdate({ targetAudience: e.target.value })}
            placeholder="e.g., Youth aged 13-18, Professional athletes"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="expectedAttendance">Expected Attendance</Label>
          <Input
            id="expectedAttendance"
            type="number"
            value={formData.expectedAttendance}
            onChange={(e) => onUpdate({ expectedAttendance: parseInt(e.target.value) || 0 })}
            placeholder="Number of participants"
          />
        </div>
      </div>
    </div>
  )
}

function StaffRefsStep({ formData, onUpdate, people }: any) {
  const [searchQuery, setSearchQuery] = useState("")
  const filtered = people.filter((p: Person) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Select staff members and referees to assign to this event. Their hourly rates and provider information will be tracked for budgeting.
      </p>

      <div className="flex flex-col gap-3">
        <Input
          placeholder="Search by name or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filtered.map((person: Person) => (
            <div key={person.id} className="flex items-center justify-between rounded-md border border-border p-3">
              <div className="flex flex-1 items-center gap-3">
                <Checkbox
                  checked={formData.selectedPeople.includes(person.id)}
                  onCheckedChange={(checked) => {
                    const updated = checked
                      ? [...formData.selectedPeople, person.id]
                      : formData.selectedPeople.filter((id: string) => id !== person.id)
                    onUpdate({ selectedPeople: updated })
                  }}
                />
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-sm">{person.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {person.role} • {formatCurrency(person.hourlyRate)}/hr • {person.provider}
                  </span>
                </div>
              </div>
              <Check className={`h-4 w-4 ${formData.selectedPeople.includes(person.id) ? "text-green-500" : "text-transparent"}`} />
            </div>
          ))}
        </div>

        <div className="rounded-md bg-muted p-3">
          <p className="text-sm font-medium">{formData.selectedPeople.length} staff members selected</p>
        </div>
      </div>
    </div>
  )
}

function FacilitiesEquipmentStep({ formData, onUpdate, equipment }: any) {
  const [searchQuery, setSearchQuery] = useState("")
  const filtered = equipment.filter((e: Equipment) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Select venues, equipment, transport, and other facility needs. Provider and cost information included.
      </p>

      <div className="flex flex-col gap-3">
        <Input
          placeholder="Search by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filtered.map((item: Equipment) => (
            <div key={item.id} className="flex items-center justify-between rounded-md border border-border p-3">
              <div className="flex flex-1 items-center gap-3">
                <Checkbox
                  checked={formData.selectedEquipment.includes(item.id)}
                  onCheckedChange={(checked) => {
                    const updated = checked
                      ? [...formData.selectedEquipment, item.id]
                      : formData.selectedEquipment.filter((id: string) => id !== item.id)
                    onUpdate({ selectedEquipment: updated })
                  }}
                />
                <div className="flex flex-col gap-1 flex-1">
                  <span className="font-medium text-sm">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.category} • {formatCurrency(item.unitCost)} × {item.quantity} • {item.provider}
                  </span>
                </div>
              </div>
              <div className="text-sm font-semibold">{formatCurrency(item.unitCost * item.quantity)}</div>
            </div>
          ))}
        </div>

        <div className="rounded-md bg-muted p-3">
          <p className="text-sm font-medium">{formData.selectedEquipment.length} items selected</p>
        </div>
      </div>
    </div>
  )
}

function AdvertisingCommsStep({ formData, onUpdate, communication }: any) {
  const [searchQuery, setSearchQuery] = useState("")
  const filtered = communication.filter((c: CommunicationItem) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Select marketing, advertising, and communication channels to promote your event. Costs and providers included.
      </p>

      <div className="flex flex-col gap-3">
        <Input
          placeholder="Search by name or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filtered.map((item: CommunicationItem) => (
            <div key={item.id} className="flex items-center justify-between rounded-md border border-border p-3">
              <div className="flex flex-1 items-center gap-3">
                <Checkbox
                  checked={formData.selectedCommunication.includes(item.id)}
                  onCheckedChange={(checked) => {
                    const updated = checked
                      ? [...formData.selectedCommunication, item.id]
                      : formData.selectedCommunication.filter((id: string) => id !== item.id)
                    onUpdate({ selectedCommunication: updated })
                  }}
                />
                <div className="flex flex-col gap-1 flex-1">
                  <span className="font-medium text-sm">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.type} • {item.provider}
                  </span>
                </div>
              </div>
              <div className="text-sm font-semibold">{formatCurrency(item.cost)}</div>
            </div>
          ))}
        </div>

        <div className="rounded-md bg-muted p-3">
          <p className="text-sm font-medium">{formData.selectedCommunication.length} items selected</p>
        </div>
      </div>
    </div>
  )
}

function SocialImpactStep({ formData, onUpdate }: any) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Select the social impact angles this event addresses. These will be highlighted in sponsorship proposals.
      </p>

      <div className="grid gap-3">
        {SOCIAL_IMPACT_ANGLES.map((angle) => (
          <div
            key={angle.value}
            className="flex items-start gap-3 rounded-md border border-border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => {
              const updated = formData.socialImpactAngles.includes(angle.value)
                ? formData.socialImpactAngles.filter((a: string) => a !== angle.value)
                : [...formData.socialImpactAngles, angle.value]
              onUpdate({ socialImpactAngles: updated })
            }}
          >
            <Checkbox
              checked={formData.socialImpactAngles.includes(angle.value)}
              onCheckedChange={() => {}}
              className="mt-1"
            />
            <div className="flex flex-col gap-1 flex-1">
              <span className="font-medium text-sm">{angle.label}</span>
              <span className="text-xs text-muted-foreground">{angle.description}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-md bg-muted p-3">
        <p className="text-sm font-medium">{formData.socialImpactAngles.length} impact angles selected</p>
      </div>
    </div>
  )
}

function BudgetFinancialsStep({ formData, onUpdate, financials }: any) {
  const [searchQuery, setSearchQuery] = useState("")
  const filtered = financials.filter((f: FinancialItem) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Select additional budget items like insurance, permits, catering, and miscellaneous expenses. Provider information included.
      </p>

      <div className="flex flex-col gap-3">
        <Input
          placeholder="Search by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filtered.map((item: FinancialItem) => (
            <div key={item.id} className="flex items-center justify-between rounded-md border border-border p-3">
              <div className="flex flex-1 items-center gap-3">
                <Checkbox
                  checked={formData.selectedFinancials.includes(item.id)}
                  onCheckedChange={(checked) => {
                    const updated = checked
                      ? [...formData.selectedFinancials, item.id]
                      : formData.selectedFinancials.filter((id: string) => id !== item.id)
                    onUpdate({ selectedFinancials: updated })
                  }}
                />
                <div className="flex flex-col gap-1 flex-1">
                  <span className="font-medium text-sm">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.category} • {formatCurrency(item.unitCost)} × {item.quantity} • {item.provider}
                  </span>
                </div>
              </div>
              <div className="text-sm font-semibold">{formatCurrency(item.unitCost * item.quantity)}</div>
            </div>
          ))}
        </div>

        <div className="rounded-md bg-muted p-3">
          <p className="text-sm font-medium">{formData.selectedFinancials.length} items selected</p>
        </div>
      </div>
    </div>
  )
}

function ReviewSummaryStep({ formData, people, equipment, financials, communication }: any) {
  const calculateTotal = () => {
    let total = 0

    formData.selectedPeople.forEach((pId: string) => {
      const person = people.find((p: Person) => p.id === pId)
      if (person) total += person.hourlyRate * 8 // Assume 8-hour day
    })

    formData.selectedEquipment.forEach((eId: string) => {
      const item = equipment.find((e: Equipment) => e.id === eId)
      if (item) total += item.unitCost * item.quantity
    })

    formData.selectedFinancials.forEach((fId: string) => {
      const item = financials.find((f: FinancialItem) => f.id === fId)
      if (item) total += item.unitCost * item.quantity
    })

    formData.selectedCommunication.forEach((cId: string) => {
      const item = communication.find((c: CommunicationItem) => c.id === cId)
      if (item) total += item.cost
    })

    return total
  }

  const total = calculateTotal()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">EVENT NAME</p>
          <p className="text-lg font-semibold">{formData.name}</p>
        </div>
        <div className="rounded-md border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">SPORT</p>
          <p className="text-lg font-semibold">{formData.sport}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">STAFF ASSIGNED</p>
          <p className="text-2xl font-bold">{formData.selectedPeople.length}</p>
        </div>
        <div className="rounded-md border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">ITEMS SELECTED</p>
          <p className="text-2xl font-bold">
            {formData.selectedEquipment.length + formData.selectedFinancials.length + formData.selectedCommunication.length}
          </p>
        </div>
        <div className="rounded-md border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">TOTAL BUDGET</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(total)}</p>
        </div>
      </div>

      {formData.mission && (
        <div className="rounded-md border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">MISSION</p>
          <p className="text-sm text-card-foreground leading-relaxed">{formData.mission}</p>
        </div>
      )}

      {formData.socialImpactAngles.length > 0 && (
        <div className="rounded-md border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-3">SOCIAL IMPACT ANGLES</p>
          <div className="flex flex-wrap gap-2">
            {formData.socialImpactAngles.map((angle: string) => {
              const angleData = SOCIAL_IMPACT_ANGLES.find((a) => a.value === angle)
              return <Badge key={angle} variant="secondary">{angleData?.label}</Badge>
            })}
          </div>
        </div>
      )}

      <div className="rounded-md bg-green-50 border border-green-200 p-4">
        <p className="text-sm font-medium text-green-900">
          ✓ Ready to create! Your event is complete with all necessary details for sponsorship proposals.
        </p>
      </div>
    </div>
  )
}

// ============= MAIN WIZARD =============

const STEPS = [
  { id: 1, label: "Event Basics", description: "Name, dates, location, and mission" },
  { id: 2, label: "Staff & Referees", description: "Assign people and roles" },
  { id: 3, label: "Facilities & Equipment", description: "Venues, gear, and transport" },
  { id: 4, label: "Advertising & Comms", description: "Marketing and outreach" },
  { id: 5, label: "Social Impact", description: "Target social angles and outcomes" },
  { id: 6, label: "Budget & Financials", description: "Additional costs and expenses" },
  { id: 7, label: "Review & Summary", description: "Final review and publish" },
]

interface EventWizardProps {
  currentStep: number
  onStepChange: (step: number) => void
  onComplete: (eventData: any) => void
  onCancel: () => void
  people: Person[]
  equipment: Equipment[]
  financials: FinancialItem[]
  communication: CommunicationItem[]
}

export function EventWizard({
  currentStep,
  onStepChange,
  onComplete,
  onCancel,
  people,
  equipment,
  financials,
  communication,
}: EventWizardProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "tournament" as const,
    sport: "",
    startDate: "",
    endDate: "",
    location: "",
    description: "",
    mission: "",
    targetAudience: "",
    expectedImpact: "",
    valueProposition: "",
    socialImpactAngles: [] as string[],
    expectedAttendance: 0,
    selectedPeople: [] as string[],
    selectedEquipment: [] as string[],
    selectedFinancials: [] as string[],
    selectedCommunication: [] as string[],
  })

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      onStepChange(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1)
    }
  }

  const handleUpdateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const isLastStep = currentStep === STEPS.length - 1
  const isFirstStep = currentStep === 0

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <EventBasicsStep formData={formData} onUpdate={handleUpdateFormData} />
      case 1:
        return <StaffRefsStep formData={formData} onUpdate={handleUpdateFormData} people={people} />
      case 2:
        return <FacilitiesEquipmentStep formData={formData} onUpdate={handleUpdateFormData} equipment={equipment} />
      case 3:
        return <AdvertisingCommsStep formData={formData} onUpdate={handleUpdateFormData} communication={communication} />
      case 4:
        return <SocialImpactStep formData={formData} onUpdate={handleUpdateFormData} />
      case 5:
        return <BudgetFinancialsStep formData={formData} onUpdate={handleUpdateFormData} financials={financials} />
      case 6:
        return <ReviewSummaryStep formData={formData} people={people} equipment={equipment} financials={financials} communication={communication} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2">
            <button
              onClick={() => onStepChange(index)}
              className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-colors flex-shrink-0 ${
                index === currentStep
                  ? "bg-primary text-primary-foreground"
                  : index < currentStep
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-muted text-muted-foreground hover:bg-muted"
              }`}
            >
              {index < currentStep ? "✓" : index + 1}
            </button>
            {index < STEPS.length - 1 && (
              <div className={`h-1 w-12 flex-shrink-0 ${index < currentStep ? "bg-green-500" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Current Step */}
      <div>
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-card-foreground">{STEPS[currentStep].label}</h1>
          <p className="text-muted-foreground text-sm mt-1">{STEPS[currentStep].description}</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            {renderStep()}
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstStep}
          >
            Previous
          </Button>
          {isLastStep ? (
            <Button
              onClick={() => onComplete(formData)}
              className="gap-1.5"
            >
              Create Event
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="gap-1.5"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
