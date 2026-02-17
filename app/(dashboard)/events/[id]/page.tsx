"use client"

import { use, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Clock, Users, Wrench, DollarSign, Megaphone, X, Pencil } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { calculateEventBudget, type SportEvent, type EventStatus } from "@/lib/data"
import { StatusBadge } from "@/components/status-badge"
import { BudgetSummary } from "@/components/budget-summary"
import { ResourceSelector } from "@/components/resource-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val)

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { state, dispatch } = useAppStore()
  const [editOpen, setEditOpen] = useState(false)

  const event = state.events.find((e) => e.id === id)

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-xl font-semibold text-card-foreground">Event not found</h2>
        <p className="text-muted-foreground mt-2">This event may have been deleted.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/events">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </Button>
      </div>
    )
  }

  const budget = calculateEventBudget(event, state.people, state.equipment, state.financials, state.communication)

  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)
  const dateStr = event.startDate === event.endDate
    ? startDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : `${startDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`

  // Resource items for selector
  const peopleItems = state.people.map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.role.charAt(0).toUpperCase() + p.role.slice(1),
    detail: `$${p.hourlyRate}/hr`,
  }))

  const equipmentItems = state.equipment.map((e) => ({
    id: e.id,
    name: e.name,
    subtitle: e.category.charAt(0).toUpperCase() + e.category.slice(1),
    detail: formatCurrency(e.unitCost * e.quantity),
  }))

  const financialItems = state.financials.map((f) => ({
    id: f.id,
    name: f.name,
    subtitle: f.category.charAt(0).toUpperCase() + f.category.slice(1),
    detail: formatCurrency(f.unitCost * f.quantity),
  }))

  const communicationItems = state.communication.map((c) => ({
    id: c.id,
    name: c.name,
    subtitle: c.type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    detail: formatCurrency(c.cost),
  }))

  const toggleResource = (resourceType: "people" | "equipment" | "financials" | "communication", resourceId: string) => {
    const fieldMap = {
      people: "assignedPeople",
      equipment: "assignedEquipment",
      financials: "assignedFinancials",
      communication: "assignedCommunication",
    } as const
    const current = event[fieldMap[resourceType]] as string[]
    if (current.includes(resourceId)) {
      dispatch({ type: "UNASSIGN_RESOURCE", payload: { eventId: id, resourceType, resourceId } })
    } else {
      dispatch({ type: "ASSIGN_RESOURCE", payload: { eventId: id, resourceType, resourceId } })
    }
  }

  const removeResource = (resourceType: "people" | "equipment" | "financials" | "communication", resourceId: string) => {
    dispatch({ type: "UNASSIGN_RESOURCE", payload: { eventId: id, resourceType, resourceId } })
  }

  // Resolve assigned resources
  const assignedPeople = state.people.filter((p) => event.assignedPeople.includes(p.id))
  const assignedEquipment = state.equipment.filter((e) => event.assignedEquipment.includes(e.id))
  const assignedFinancials = state.financials.filter((f) => event.assignedFinancials.includes(f.id))
  const assignedCommunication = state.communication.filter((c) => event.assignedCommunication.includes(c.id))

  return (
    <div className="flex flex-col gap-6">
      {/* Back + Header */}
      <div className="flex flex-col gap-4">
        <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 text-muted-foreground">
          <Link href="/events">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Events
          </Link>
        </Button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-primary">
                {event.type}
              </span>
              <StatusBadge status={event.status} />
              <span className="text-sm font-medium text-primary">{event.sport}</span>
            </div>
            <h1 className="text-3xl font-bold font-display tracking-tight text-balance">{event.name}</h1>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">{event.description}</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 flex-shrink-0" onClick={() => setEditOpen(true)}>
            <Pencil className="h-3.5 w-3.5" />
            Edit Event
          </Button>
        </div>

        {/* Event Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {dateStr}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {event.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {budget.eventDays} {budget.eventDays === 1 ? "day" : "days"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content - Resource Assignment Tabs */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Tabs defaultValue="people">
            <TabsList>
              <TabsTrigger value="people" className="gap-1.5">
                <Users className="h-3.5 w-3.5" />
                People ({assignedPeople.length})
              </TabsTrigger>
              <TabsTrigger value="equipment" className="gap-1.5">
                <Wrench className="h-3.5 w-3.5" />
                Equipment ({assignedEquipment.length})
              </TabsTrigger>
              <TabsTrigger value="financials" className="gap-1.5">
                <DollarSign className="h-3.5 w-3.5" />
                Financials ({assignedFinancials.length})
              </TabsTrigger>
              <TabsTrigger value="communication" className="gap-1.5">
                <Megaphone className="h-3.5 w-3.5" />
                Comms ({assignedCommunication.length})
              </TabsTrigger>
            </TabsList>

            {/* People Tab */}
            <TabsContent value="people">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base font-semibold">Assigned People</CardTitle>
                  <ResourceSelector
                    title="Select People"
                    items={peopleItems}
                    selectedIds={event.assignedPeople}
                    onToggle={(id) => toggleResource("people", id)}
                    triggerLabel="Add People"
                  />
                </CardHeader>
                <CardContent>
                  {assignedPeople.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">No people assigned. Click &quot;Add People&quot; to assign staff and volunteers.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {assignedPeople.map((person) => (
                        <div key={person.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-card-foreground">{person.name}</span>
                            <span className="text-xs text-muted-foreground capitalize">{person.role} &middot; ${person.hourlyRate}/hr</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-card-foreground tabular-nums">
                              {formatCurrency(person.hourlyRate * 8 * budget.eventDays)}
                            </span>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeResource("people", person.id)}>
                              <X className="h-3.5 w-3.5" />
                              <span className="sr-only">Remove {person.name}</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-end pt-1 text-sm font-medium text-card-foreground">
                        Subtotal: {formatCurrency(budget.people)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Equipment Tab */}
            <TabsContent value="equipment">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base font-semibold">Assigned Equipment</CardTitle>
                  <ResourceSelector
                    title="Select Equipment"
                    items={equipmentItems}
                    selectedIds={event.assignedEquipment}
                    onToggle={(id) => toggleResource("equipment", id)}
                    triggerLabel="Add Equipment"
                  />
                </CardHeader>
                <CardContent>
                  {assignedEquipment.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">No equipment assigned. Click &quot;Add Equipment&quot; to assign venue, gear, and tech resources.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {assignedEquipment.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-card-foreground">{item.name}</span>
                            <span className="text-xs text-muted-foreground capitalize">{item.category} &middot; {formatCurrency(item.unitCost)} x {item.quantity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-card-foreground tabular-nums">
                              {formatCurrency(item.unitCost * item.quantity)}
                            </span>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeResource("equipment", item.id)}>
                              <X className="h-3.5 w-3.5" />
                              <span className="sr-only">Remove {item.name}</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-end pt-1 text-sm font-medium text-card-foreground">
                        Subtotal: {formatCurrency(budget.equipment)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financials Tab */}
            <TabsContent value="financials">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base font-semibold">Financial Items</CardTitle>
                  <ResourceSelector
                    title="Select Financial Items"
                    items={financialItems}
                    selectedIds={event.assignedFinancials}
                    onToggle={(id) => toggleResource("financials", id)}
                    triggerLabel="Add Financial"
                  />
                </CardHeader>
                <CardContent>
                  {assignedFinancials.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">No financial items assigned. Click &quot;Add Financial&quot; to assign expense items.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {assignedFinancials.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-card-foreground">{item.name}</span>
                            <span className="text-xs text-muted-foreground capitalize">{item.category} &middot; {formatCurrency(item.unitCost)} x {item.quantity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-card-foreground tabular-nums">
                              {formatCurrency(item.unitCost * item.quantity)}
                            </span>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeResource("financials", item.id)}>
                              <X className="h-3.5 w-3.5" />
                              <span className="sr-only">Remove {item.name}</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-end pt-1 text-sm font-medium text-card-foreground">
                        Subtotal: {formatCurrency(budget.financials)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Communication Tab */}
            <TabsContent value="communication">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base font-semibold">Communication Plan</CardTitle>
                  <ResourceSelector
                    title="Select Communication Items"
                    items={communicationItems}
                    selectedIds={event.assignedCommunication}
                    onToggle={(id) => toggleResource("communication", id)}
                    triggerLabel="Add Comms"
                  />
                </CardHeader>
                <CardContent>
                  {assignedCommunication.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">No communication items assigned. Click &quot;Add Comms&quot; to add campaign and outreach items.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {assignedCommunication.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-card-foreground">{item.name}</span>
                            <span className="text-xs text-muted-foreground">{item.type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-card-foreground tabular-nums">
                              {formatCurrency(item.cost)}
                            </span>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeResource("communication", item.id)}>
                              <X className="h-3.5 w-3.5" />
                              <span className="sr-only">Remove {item.name}</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-end pt-1 text-sm font-medium text-card-foreground">
                        Subtotal: {formatCurrency(budget.communication)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Budget */}
        <div className="flex flex-col gap-6">
          <BudgetSummary budget={budget} />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Resource Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    People
                  </span>
                  <span className="text-sm font-medium text-card-foreground">{assignedPeople.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wrench className="h-4 w-4" />
                    Equipment
                  </span>
                  <span className="text-sm font-medium text-card-foreground">{assignedEquipment.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    Financial Items
                  </span>
                  <span className="text-sm font-medium text-card-foreground">{assignedFinancials.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Megaphone className="h-4 w-4" />
                    Communication
                  </span>
                  <span className="text-sm font-medium text-card-foreground">{assignedCommunication.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Event Dialog */}
      <EditEventDialog event={event} open={editOpen} onOpenChange={setEditOpen} />
    </div>
  )
}

// ==========================================
// Edit Event Dialog (inner component)
// ==========================================

function EditEventDialog({ event, open, onOpenChange }: { event: SportEvent; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { dispatch } = useAppStore()
  const [form, setForm] = useState({
    name: event.name,
    sport: event.sport,
    startDate: event.startDate,
    endDate: event.endDate,
    location: event.location,
    description: event.description,
    status: event.status,
  })

  // Keep form in sync when event changes
  const resetForm = () => {
    setForm({
      name: event.name,
      sport: event.sport,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      description: event.description,
      status: event.status,
    })
  }

  const handleSave = () => {
    dispatch({ type: "UPDATE_EVENT", payload: { ...event, ...form } })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) resetForm(); onOpenChange(val) }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>Update the event details below.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-name">Event Name</Label>
            <Input id="edit-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-sport">Sport</Label>
              <Input id="edit-sport" value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(val: EventStatus) => setForm({ ...form, status: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-start">Start Date</Label>
              <Input id="edit-start" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-end">End Date</Label>
              <Input id="edit-end" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-location">Location</Label>
            <Input id="edit-location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-desc">Description</Label>
            <Textarea id="edit-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { resetForm(); onOpenChange(false) }}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
