"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { Person, Equipment, FinancialItem, CommunicationItem, SOCIAL_IMPACT_ANGLES } from "@/lib/data"

interface ReviewSummaryStepProps {
  formData: any
  people: Person[]
  equipment: Equipment[]
  financials: FinancialItem[]
  communication: CommunicationItem[]
}

export function ReviewSummaryStep({
  formData,
  people,
  equipment,
  financials,
  communication,
}: ReviewSummaryStepProps) {
  const selectedPeople = people.filter((p) => formData.selectedPeople.includes(p.id))
  const selectedEquipment = equipment.filter((e) => formData.selectedEquipment.includes(e.id))
  const selectedFinancials = financials.filter((f) => formData.selectedFinancials.includes(f.id))
  const selectedComm = communication.filter((c) => formData.selectedCommunication.includes(c.id))

  // Calculate costs
  const eventDays = formData.startDate && formData.endDate 
    ? Math.max(1, Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)
    : 1

  const peopleCost = selectedPeople.reduce((sum, person) => {
    return sum + (person.hourlyRate * 8 * eventDays)
  }, 0)

  const equipmentCost = selectedEquipment.reduce((sum, item) => {
    return sum + (item.unitCost * item.quantity)
  }, 0)

  const financialsCost = selectedFinancials.reduce((sum, item) => {
    return sum + (item.unitCost * item.quantity)
  }, 0)

  const commCost = selectedComm.reduce((sum, item) => sum + item.cost, 0)
  const totalBudget = peopleCost + equipmentCost + financialsCost + commCost

  const getImpactLabel = (value: string) => {
    return SOCIAL_IMPACT_ANGLES.find((a) => a.value === value)?.label || value
  }

  return (
    <div className="space-y-6">
      {/* Event Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground">Event Name</div>
              <div className="font-semibold text-card-foreground">{formData.name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Sport</div>
              <div className="font-semibold text-card-foreground">{formData.sport}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Type</div>
              <div className="font-semibold text-card-foreground capitalize">{formData.type}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Location</div>
              <div className="font-semibold text-card-foreground">{formData.location}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Dates</div>
              <div className="font-semibold text-card-foreground">
                {formData.startDate} to {formData.endDate} ({eventDays} day{eventDays !== 1 ? 's' : ''})
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Expected Attendance</div>
              <div className="font-semibold text-card-foreground">{formData.expectedAttendance || 0}</div>
            </div>
          </div>
          {formData.mission && (
            <div>
              <div className="text-sm text-muted-foreground mb-2">Mission Statement</div>
              <div className="text-sm text-card-foreground bg-muted/50 p-3 rounded-lg">{formData.mission}</div>
            </div>
          )}
          {formData.description && (
            <div>
              <div className="text-sm text-muted-foreground mb-2">Description</div>
              <div className="text-sm text-card-foreground bg-muted/50 p-3 rounded-lg">{formData.description}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Impact Angles */}
      {formData.socialImpactAngles && formData.socialImpactAngles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Social Impact Angles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {formData.socialImpactAngles.map((angle: string) => (
                <Badge key={angle} variant="secondary">
                  {getImpactLabel(angle)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budget Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Budget Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {peopleCost > 0 && (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 border border-blue-200 dark:border-blue-800">
                <div className="text-sm text-blue-900 dark:text-blue-100">Staff Cost</div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                  ${peopleCost.toLocaleString()}
                </div>
                <div className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                  {selectedPeople.length} person(s) × {eventDays} day(s)
                </div>
              </div>
            )}
            {equipmentCost > 0 && (
              <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4 border border-green-200 dark:border-green-800">
                <div className="text-sm text-green-900 dark:text-green-100">Equipment & Facilities</div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                  ${equipmentCost.toLocaleString()}
                </div>
                <div className="text-xs text-green-800 dark:text-green-200 mt-1">
                  {selectedEquipment.length} item(s)
                </div>
              </div>
            )}
            {commCost > 0 && (
              <div className="rounded-lg bg-purple-50 dark:bg-purple-950 p-4 border border-purple-200 dark:border-purple-800">
                <div className="text-sm text-purple-900 dark:text-purple-100">Advertising & Comms</div>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                  ${commCost.toLocaleString()}
                </div>
                <div className="text-xs text-purple-800 dark:text-purple-200 mt-1">
                  {selectedComm.length} item(s)
                </div>
              </div>
            )}
            {financialsCost > 0 && (
              <div className="rounded-lg bg-orange-50 dark:bg-orange-950 p-4 border border-orange-200 dark:border-orange-800">
                <div className="text-sm text-orange-900 dark:text-orange-100">Other Expenses</div>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">
                  ${financialsCost.toLocaleString()}
                </div>
                <div className="text-xs text-orange-800 dark:text-orange-200 mt-1">
                  {selectedFinancials.length} item(s)
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg bg-slate-900 dark:bg-slate-100 p-4 border border-slate-700 dark:border-slate-300">
            <div className="text-sm text-slate-200 dark:text-slate-800">Total Event Budget</div>
            <div className="text-4xl font-bold text-slate-100 dark:text-slate-900 mt-2">
              ${totalBudget.toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resources Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {selectedPeople.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2">Staff ({selectedPeople.length})</h3>
                <div className="space-y-1 text-sm">
                  {selectedPeople.map((person) => (
                    <div key={person.id} className="flex justify-between text-muted-foreground">
                      <span>{person.name}</span>
                      <span>{person.provider}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedEquipment.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2">Equipment & Facilities ({selectedEquipment.length})</h3>
                <div className="space-y-1 text-sm">
                  {selectedEquipment.map((item) => (
                    <div key={item.id} className="flex justify-between text-muted-foreground">
                      <span>{item.name}</span>
                      <span>{item.provider}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedComm.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2">Advertising & Comms ({selectedComm.length})</h3>
                <div className="space-y-1 text-sm">
                  {selectedComm.map((item) => (
                    <div key={item.id} className="flex justify-between text-muted-foreground">
                      <span>{item.name}</span>
                      <span>{item.provider}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedFinancials.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2">Other Expenses ({selectedFinancials.length})</h3>
                <div className="space-y-1 text-sm">
                  {selectedFinancials.map((item) => (
                    <div key={item.id} className="flex justify-between text-muted-foreground">
                      <span>{item.name}</span>
                      <span>{item.provider}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Final Notes */}
      <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4 border border-green-200 dark:border-green-800">
        <div className="flex gap-3">
          <div className="text-green-600 dark:text-green-400">✓</div>
          <div>
            <div className="font-semibold text-green-900 dark:text-green-100">Ready to Create Event</div>
            <p className="text-sm text-green-800 dark:text-green-200 mt-1">
              Click "Create Event" below to save this event as a draft. You can continue editing and add sponsorship proposals later.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
