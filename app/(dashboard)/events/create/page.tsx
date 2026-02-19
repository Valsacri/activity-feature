"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EventWizard } from "@/components/event-wizard"
import { initialEvents, initialPeople, initialEquipment, initialFinancials, initialCommunication } from "@/lib/data"
import { useAppStore } from "@/lib/store"

export default function CreateEventPage() {
  const router = useRouter()
  const { state, dispatch } = useAppStore()
  const [currentStep, setCurrentStep] = useState(0)

  const handleComplete = (eventData: any) => {
    const newEvent = {
      ...eventData,
      id: `ev${Date.now()}`,
      status: "draft" as const,
      assignedPeople: eventData.selectedPeople || [],
      assignedEquipment: eventData.selectedEquipment || [],
      assignedFinancials: eventData.selectedFinancials || [],
      assignedCommunication: eventData.selectedCommunication || [],
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: "ADD_EVENT", payload: newEvent })
    router.push("/events")
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <EventWizard
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onComplete={handleComplete}
          onCancel={handleCancel}
          people={state.people}
          equipment={state.equipment}
          financials={state.financials}
          communication={state.communication}
        />
      </div>
    </div>
  )
}
