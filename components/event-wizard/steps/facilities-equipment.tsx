"use client"

import { useState } from "react"
import { Check, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Equipment } from "@/lib/data"
import { cn } from "@/lib/utils"

interface FacilitiesEquipmentStepProps {
  formData: any
  onUpdate: (data: any) => void
  equipment: Equipment[]
}

export function FacilitiesEquipmentStep({
  formData,
  onUpdate,
  equipment,
}: FacilitiesEquipmentStepProps) {
  const [search, setSearch] = useState("")

  const filtered = equipment.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.provider?.toLowerCase().includes(search.toLowerCase())
  )

  const selectedEquipment = equipment.filter((e) => formData.selectedEquipment.includes(e.id))

  const toggleEquipment = (id: string) => {
    const updated = formData.selectedEquipment.includes(id)
      ? formData.selectedEquipment.filter((eid: string) => eid !== id)
      : [...formData.selectedEquipment, id]
    onUpdate({ selectedEquipment: updated })
  }

  const totalEquipmentCost = selectedEquipment.reduce(
    (sum, item) => sum + item.unitCost * item.quantity,
    0
  )

  const categoryColors: Record<string, string> = {
    venue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    gear: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    transport: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    tech: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    furniture: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Search and Select Facilities & Equipment</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, category, or provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-card-foreground">Available Equipment ({filtered.length})</h3>
          <ScrollArea className="h-96 rounded-lg border border-border">
            <div className="flex flex-col gap-1 p-3">
              {filtered.map((item) => {
                const isSelected = formData.selectedEquipment.includes(item.id)
                const cost = item.unitCost * item.quantity
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleEquipment(item.id)}
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
                      <div className="text-sm font-medium truncate">{item.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${categoryColors[item.category as keyof typeof categoryColors]}`}
                        >
                          {item.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{item.provider}</span>
                      </div>
                      <div className="text-xs font-semibold text-green-600 mt-1">
                        ${cost.toLocaleString()} ({item.quantity}x @ ${item.unitCost})
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
            Selected Equipment ({selectedEquipment.length})
          </h3>
          <Card className="p-3 space-y-2 bg-muted/30">
            {selectedEquipment.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No equipment selected yet
              </p>
            ) : (
              <>
                {selectedEquipment.map((item) => {
                  const cost = item.unitCost * item.quantity
                  return (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-2 rounded-lg bg-card p-2 border border-border"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{item.name}</div>
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${categoryColors[item.category as keyof typeof categoryColors]}`}
                          >
                            {item.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{item.provider}</span>
                        </div>
                        <div className="text-xs font-semibold text-green-600 mt-1">
                          ${cost.toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleEquipment(item.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 mt-0.5"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )
                })}
              </>
            )}
          </Card>

          {selectedEquipment.length > 0 && (
            <div className="rounded-lg bg-green-50 dark:bg-green-950 p-3 border border-green-200 dark:border-green-800">
              <div className="text-xs font-semibold text-green-900 dark:text-green-100">Equipment Cost Summary</div>
              <div className="text-sm font-bold text-green-900 dark:text-green-100 mt-1">
                ${totalEquipmentCost.toLocaleString()}
              </div>
              <div className="text-xs text-green-800 dark:text-green-200 mt-1">
                {selectedEquipment.length} item(s) total
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
