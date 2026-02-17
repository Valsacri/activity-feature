"use client"

import Link from "next/link"
import { Calendar, DollarSign, Handshake, FileText, ArrowRight, MapPin } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useAppStore } from "@/lib/store"
import { calculateEventBudget } from "@/lib/data"
import { StatCard } from "@/components/stat-card"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val)

export default function DashboardPage() {
  const { state } = useAppStore()
  const { events, people, equipment, financials, communication, sponsors, proposals } = state

  // Calculate budgets for all events
  const eventBudgets = events.map((event) => {
    const budget = calculateEventBudget(event, people, equipment, financials, communication)
    return { event, budget }
  })

  const totalBudget = eventBudgets.reduce((sum, eb) => sum + eb.budget.total, 0)
  const activeSponsors = sponsors.filter((s) => s.status === "confirmed").length
  const pendingProposals = proposals.filter((p) => p.status === "draft" || p.status === "sent").length

  // Chart data
  const chartData = eventBudgets.map((eb) => ({
    name: eb.event.name.length > 20 ? eb.event.name.slice(0, 20) + "..." : eb.event.name,
    People: eb.budget.people,
    Equipment: eb.budget.equipment,
    Financials: eb.budget.financials,
    Communication: eb.budget.communication,
  }))

  // Upcoming events sorted by start date
  const upcomingEvents = [...events]
    .filter((e) => e.status !== "completed")
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight text-balance">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your sport activities and sponsorship projects.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Events" value={events.length} subtitle={`${events.filter(e => e.status === "active").length} active`} icon={Calendar} />
        <StatCard title="Total Budget" value={formatCurrency(totalBudget)} subtitle="Across all events" icon={DollarSign} />
        <StatCard title="Active Sponsors" value={activeSponsors} subtitle={`${sponsors.length} total`} icon={Handshake} />
        <StatCard title="Proposals" value={pendingProposals} subtitle="Pending review" icon={FileText} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Budget Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Budget by Event</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 16%, 18%)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "hsl(215, 14%, 56%)", fontSize: 11 }}
                    axisLine={{ stroke: "hsl(220, 16%, 18%)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(215, 14%, 56%)", fontSize: 11 }}
                    axisLine={{ stroke: "hsl(220, 16%, 18%)" }}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "hsl(222, 22%, 11%)",
                      border: "1px solid hsl(220, 16%, 18%)",
                      borderRadius: "8px",
                      color: "hsl(210, 20%, 96%)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", color: "hsl(215, 14%, 56%)" }}
                  />
                  <Bar dataKey="People" stackId="a" fill="hsl(160, 84%, 45%)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Equipment" stackId="a" fill="hsl(37, 92%, 50%)" />
                  <Bar dataKey="Financials" stackId="a" fill="hsl(200, 80%, 50%)" />
                  <Bar dataKey="Communication" stackId="a" fill="hsl(340, 75%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Upcoming Events</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <Link href="/events">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {upcomingEvents.map((event) => {
                const budget = calculateEventBudget(event, people, equipment, financials, communication)
                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="flex flex-col gap-1.5 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium text-card-foreground leading-tight">{event.name}</span>
                      <StatusBadge status={event.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                      <span>{new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                    <div className="text-xs font-medium text-primary">
                      {formatCurrency(budget.total)}
                    </div>
                  </Link>
                )
              })}
              {upcomingEvents.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">No upcoming events.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
