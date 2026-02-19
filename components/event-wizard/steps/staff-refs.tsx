"use client"

import { useState } from "react"
import { Check, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Person } from "@/lib/data"
import { cn } from "@/lib/utils"

interface StaffRefsStepProps {
  formData: any
  onUpdate: (data: any) => void
  people: Person[]
}

export function StaffRefsStep({ formData, onUpdate, people }: StaffRefsStepProps) {
  const [search, setSearch] = useState("")

  const filtered = people.filter(
    (person) =>
      person.name.toLowerCase().includes(search.toLowerCase()) ||
      person.role.toLowerCase().includes(search.toLowerCase()) ||
      person.provider?.toLowerCase().includes(search.toLowerCase())
  )

  const selectedPeople = people.filter((p) => formData.selectedPeople.includes(p.id))

  const togglePerson = (id: string) => {
    const updated = formData.selectedPeople.includes(id)
      ? formData.selectedPeople.filter((pid: string) => pid !== id)
      : [...formData.selectedPeople, id]
    onUpdate({ selectedPeople: updated })
  }

  const totalStaffCost = selectedPeople.reduce((sum, person) => {
    const eventDays = formData.startDate && formData.endDate 
      ? Math.max(1, Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)
      : 1
    return sum + (person.hourlyRate * 8 * eventDays)
  }, 0)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Search and Select Staff Members</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, role, or provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-card-foreground">Available Staff ({filtered.length})</h3>
          <ScrollArea className="h-96 rounded-lg border border-border">
            <div className="flex flex-col gap-1 p-3">
              {filtered.map((person) => {
                const isSelected = formData.selectedPeople.includes(person.id)
                return (
                  <button
                    key={person.id}
                    onClick={() => togglePerson(person.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                      isSelected
                        ? "bg-primary/10 text-card-foreground"
                        : "hover:bg-muted text-card-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-md border flex-shrink-0 mt-0.5 transition-colors",
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-border"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{person.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{person.role}</div>
                      <div className="text-xs text-muted-foreground truncate">{person.provider}</div>
                      <div className="text-xs font-semibold text-green-600 mt-1">
                        ${person.hourlyRate}/hr
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-card-foreground">
            Selected Staff ({selectedPeople.length})
          </h3>
          <Card className="p-3 space-y-2 bg-muted/30">
            {selectedPeople.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No staff selected yet
              </p>
            ) : (
              <>
                {selectedPeople.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center justify-between gap-2 rounded-lg bg-card p-2 border border-border"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{person.name}</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs mt-1">
                          {person.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{person.provider}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => togglePerson(person.id)}
                      className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </>
            )}
          </Card>

          {selectedPeople.length > 0 && (
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 border border-blue-200 dark:border-blue-800">
              <div className="text-xs font-semibold text-blue-900 dark:text-blue-100">Staff Cost Summary</div>
              <div className="text-sm font-bold text-blue-900 dark:text-blue-100 mt-1">
                ${totalStaffCost.toLocaleString()}
              </div>
              <div className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                {selectedPeople.length} person(s) × 8 hrs/day
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
