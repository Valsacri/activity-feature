"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Person, Equipment, FinancialItem, CommunicationItem } from "@/lib/data"
import { EventBasicsStep } from "./event-wizard/steps/event-basics"
import { StaffRefsStep } from "./event-wizard/steps/staff-refs"
import { FacilitiesEquipmentStep } from "./event-wizard/steps/facilities-equipment"
import { AdvertisingCommsStep } from "./event-wizard/steps/advertising-comms"
import { BudgetFinancialsStep } from "./event-wizard/steps/budget-financials"
import { SocialImpactStep } from "./event-wizard/steps/social-impact"
import { ReviewSummaryStep } from "./event-wizard/steps/review-summary"

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
              className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-colors ${
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
              <div className={`h-1 w-12 ${index < currentStep ? "bg-green-500" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Current Step */}
      <div>
        <div className="mb-2">
          <h1 className="text-3xl font-bold tracking-tight text-card-foreground">{STEPS[currentStep].label}</h1>
          <p className="text-muted-foreground">{STEPS[currentStep].description}</p>
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
