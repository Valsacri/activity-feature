"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Calendar, MapPin, Clock, ArrowRight } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { calculateEventBudget, type SportEvent, type EventType, type EventStatus } from "@/lib/data"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const eventTypes: { value: EventType; label: string }[] = [
  { value: "tournament", label: "Tournament" },
  { value: "program", label: "Program" },
  { value: "session", label: "Session" },
]

const eventStatuses: { value: EventStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "planned", label: "Planned" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
]

const typeIcons: Record<EventType, string> = {
  tournament: "bg-accent/15 text-accent",
  program: "bg-primary/15 text-primary",
  session: "bg-chart-3/15 text-chart-3",
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val)

export default function EventsPage() {
  const { state } = useAppStore()
  const { events, people, equipment, financials, communication } = state
  const [filterType, setFilterType] = useState<EventType | "all">("all")
  const [filterStatus, setFilterStatus] = useState<EventStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = events.filter((e) => {
    if (filterType !== "all" && e.type !== filterType) return false
    if (filterStatus !== "all" && e.status !== filterStatus) return false
    if (searchQuery && !e.name.toLowerCase().includes(searchQuery.toLowerCase()) && !e.sport.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-balance">Events</h1>
          <p className="text-muted-foreground mt-1">Manage tournaments, programs, and training sessions.</p>
        </div>
        <Button asChild className="gap-1.5">
          <Link href="/events/create">
            <Plus className="h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select value={filterType} onValueChange={(val) => setFilterType(val as EventType | "all")}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="All types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {eventTypes.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val as EventStatus | "all")}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {eventStatuses.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground ml-auto">
          {filtered.length} {filtered.length === 1 ? "event" : "events"}
        </span>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((event) => {
          const budget = calculateEventBudget(event, people, equipment, financials, communication)
          const startDate = new Date(event.startDate)
          const endDate = new Date(event.endDate)
          const dateStr = event.startDate === event.endDate
            ? startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`

          return (
            <Card key={event.id} className="group relative overflow-hidden transition-all hover:shadow-md hover:shadow-primary/5 hover:border-primary/30">
              <CardContent className="p-5 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider ${typeIcons[event.type]}`}>
                        {event.type}
                      </span>
                      <StatusBadge status={event.status} />
                    </div>
                    <h3 className="text-base font-semibold text-card-foreground leading-tight truncate">{event.name}</h3>
                    <span className="text-sm text-primary font-medium">{event.sport}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    {dateStr}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    {event.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                    {budget.eventDays} {budget.eventDays === 1 ? "day" : "days"}
                  </span>
                </div>

                {/* Budget + Resources */}
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <div>
                    <span className="text-xs text-muted-foreground">Total Budget</span>
                    <div className="text-lg font-bold font-display text-card-foreground tabular-nums">{formatCurrency(budget.total)}</div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{event.assignedPeople.length} people</span>
                    <span>{event.assignedEquipment.length + event.assignedFinancials.length + event.assignedCommunication.length} items</span>
                  </div>
                </div>

                {/* Link */}
                <Button variant="ghost" size="sm" asChild className="w-full justify-between text-xs mt-auto">
                  <Link href={`/events/${event.id}`}>
                    Manage Event
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-card-foreground">No events found</h3>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or create a new event.</p>
        </div>
      )}
    </div>
  )
}
