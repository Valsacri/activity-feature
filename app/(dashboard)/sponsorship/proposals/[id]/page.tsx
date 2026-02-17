"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft, Printer, Calendar, MapPin, Users, TrendingUp, Eye, BarChart3, Trophy } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { calculateEventBudget } from "@/lib/data"
import { StatusBadge, TierBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ProposalStatus } from "@/lib/data"

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val)

const formatNumber = (val: number) =>
  new Intl.NumberFormat("en-US").format(val)

export default function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { state, dispatch } = useAppStore()

  const proposal = state.proposals.find((p) => p.id === id)

  if (!proposal) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-xl font-semibold text-card-foreground">Proposal not found</h2>
        <p className="text-muted-foreground mt-2">This proposal may have been deleted.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/sponsorship/proposals">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Proposals
          </Link>
        </Button>
      </div>
    )
  }

  const event = state.events.find((e) => e.id === proposal.eventId)
  const sponsors = state.sponsors.filter((s) => proposal.sponsorIds.includes(s.id))
  const eventBudget = event
    ? calculateEventBudget(event, state.people, state.equipment, state.financials, state.communication)
    : null

  const handleStatusChange = (status: ProposalStatus) => {
    dispatch({ type: "UPDATE_PROPOSAL", payload: { ...proposal, status } })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Navigation - hidden in print */}
      <div className="no-print flex flex-col gap-4">
        <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 text-muted-foreground">
          <Link href="/sponsorship/proposals">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Proposals
          </Link>
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <StatusBadge status={proposal.status} />
            <Select value={proposal.status} onValueChange={(val: ProposalStatus) => handleStatusChange(val)}>
              <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrint}>
            <Printer className="h-3.5 w-3.5" />
            Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Printable Proposal Document */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Cover Header */}
        <div className="bg-sidebar-background px-8 py-10 text-sidebar-foreground">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-base font-bold font-display tracking-tight">SportOrg</span>
              <span className="text-xs text-sidebar-foreground/60 block">Activity Manager</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-balance mb-2">{proposal.title}</h1>
          <p className="text-sm text-sidebar-foreground/70">
            Prepared on {new Date(proposal.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        <div className="p-8 flex flex-col gap-8">
          {/* Event Overview */}
          {event && (
            <section>
              <h2 className="text-lg font-bold font-display text-card-foreground mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Event Overview
              </h2>
              <Card>
                <CardContent className="p-5">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-semibold text-card-foreground">{event.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })} - {new Date(event.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-primary">
                        {event.type}
                      </span>
                    </div>
                    {eventBudget && (
                      <div className="border-t border-border pt-3 mt-1 flex items-center gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">Event Budget</span>
                          <div className="font-bold text-card-foreground tabular-nums">{formatCurrency(eventBudget.total)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration</span>
                          <div className="font-bold text-card-foreground">{eventBudget.eventDays} days</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Personnel</span>
                          <div className="font-bold text-card-foreground">{event.assignedPeople.length} staff</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Sponsorship Tiers & Benefits */}
          <section className="print-break">
            <h2 className="text-lg font-bold font-display text-card-foreground mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Sponsorship Tiers & Benefits
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {proposal.benefits.map((benefit) => (
                <Card key={benefit.tier} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <TierBadge tier={benefit.tier} />
                  </CardHeader>
                  <CardContent>
                    <ul className="flex flex-col gap-1.5">
                      {benefit.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Sponsors Included */}
          <section>
            <h2 className="text-lg font-bold font-display text-card-foreground mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Sponsors ({sponsors.length})
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {sponsors.map((sponsor) => (
                <Card key={sponsor.id}>
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-sm font-semibold text-card-foreground">{sponsor.name}</span>
                      <span className="text-xs text-muted-foreground">{sponsor.contactPerson} &middot; {sponsor.email}</span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                      <TierBadge tier={sponsor.tier} />
                      <span className="text-sm font-bold text-card-foreground tabular-nums">{formatCurrency(sponsor.amount)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end mt-3 text-sm">
              <span className="text-muted-foreground mr-2">Total Sponsorship:</span>
              <span className="font-bold text-card-foreground tabular-nums">{formatCurrency(sponsors.reduce((s, sp) => s + sp.amount, 0))}</span>
            </div>
          </section>

          {/* Budget Allocation */}
          <section className="print-break">
            <h2 className="text-lg font-bold font-display text-card-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Budget Allocation
            </h2>
            <Card>
              <CardContent className="p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-muted-foreground">Proposed Budget</span>
                    <span className="text-3xl font-bold font-display text-card-foreground tabular-nums">{formatCurrency(proposal.proposedBudget)}</span>
                  </div>
                  {eventBudget && (
                    <>
                      <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${Math.min(100, (eventBudget.total / proposal.proposedBudget) * 100)}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-muted-foreground">Event Cost</span>
                          <span className="font-semibold text-card-foreground tabular-nums">{formatCurrency(eventBudget.total)}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-muted-foreground">Sponsorship</span>
                          <span className="font-semibold text-card-foreground tabular-nums">{formatCurrency(sponsors.reduce((s, sp) => s + sp.amount, 0))}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-muted-foreground">Coverage</span>
                          <span className="font-semibold text-primary">
                            {eventBudget.total > 0 ? ((sponsors.reduce((s, sp) => s + sp.amount, 0) / eventBudget.total) * 100).toFixed(0) : 0}%
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-muted-foreground">Remaining</span>
                          <span className="font-semibold text-card-foreground tabular-nums">
                            {formatCurrency(Math.max(0, eventBudget.total - sponsors.reduce((s, sp) => s + sp.amount, 0)))}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ROI Projections */}
          <section>
            <h2 className="text-lg font-bold font-display text-card-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              ROI Projections
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <span className="text-xs text-muted-foreground block mb-1">Expected Audience</span>
                  <span className="text-2xl font-bold font-display text-card-foreground tabular-nums">{formatNumber(proposal.roiEstimates.expectedAudience)}</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <span className="text-xs text-muted-foreground block mb-1">Media Reach</span>
                  <span className="text-2xl font-bold font-display text-card-foreground tabular-nums">{formatNumber(proposal.roiEstimates.mediaReach)}</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <span className="text-xs text-muted-foreground block mb-1">Social Impressions</span>
                  <span className="text-2xl font-bold font-display text-card-foreground tabular-nums">{formatNumber(proposal.roiEstimates.socialImpressions)}</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <span className="text-xs text-muted-foreground block mb-1">Estimated ROI</span>
                  <span className="text-2xl font-bold font-display text-primary tabular-nums">{proposal.roiEstimates.estimatedROI}</span>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-border pt-6 text-center">
            <p className="text-xs text-muted-foreground">
              This proposal was generated by SportOrg Activity Manager. For questions or modifications, please contact your event coordinator.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
