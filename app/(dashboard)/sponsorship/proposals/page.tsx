"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, FileText, ArrowRight, Eye } from "lucide-react"
import { useAppStore } from "@/lib/store"
import type { SponsorshipProposal, BenefitItem, SponsorTier } from "@/lib/data"
import { StatusBadge, TierBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val)

const defaultBenefits: BenefitItem[] = [
  { tier: "platinum", benefits: ["Main jersey branding", "Stadium banner placement", "Opening ceremony mention", "VIP booth", "Social media feature (10 posts)", "Press conference presence"] },
  { tier: "gold", benefits: ["Sideline banner", "Program booklet ad (full page)", "Social media feature (5 posts)", "Event tickets (20)"] },
  { tier: "silver", benefits: ["Program booklet ad (half page)", "Social media mention (3 posts)", "Event tickets (10)"] },
  { tier: "bronze", benefits: ["Program booklet logo", "Social media mention (1 post)", "Event tickets (5)"] },
]

export default function ProposalsPage() {
  const { state, dispatch } = useAppStore()
  const [createOpen, setCreateOpen] = useState(false)
  const [step, setStep] = useState(1)

  // Form state for multi-step
  const [formTitle, setFormTitle] = useState("")
  const [formEventId, setFormEventId] = useState("")
  const [formSponsorIds, setFormSponsorIds] = useState<string[]>([])
  const [formBudget, setFormBudget] = useState(0)
  const [formBenefits, setFormBenefits] = useState<BenefitItem[]>(defaultBenefits)
  const [formROI, setFormROI] = useState({ expectedAudience: 5000, mediaReach: 50000, socialImpressions: 100000, estimatedROI: "3.0x" })

  const resetForm = () => {
    setStep(1)
    setFormTitle("")
    setFormEventId("")
    setFormSponsorIds([])
    setFormBudget(0)
    setFormBenefits(defaultBenefits.map(b => ({ ...b, benefits: [...b.benefits] })))
    setFormROI({ expectedAudience: 5000, mediaReach: 50000, socialImpressions: 100000, estimatedROI: "3.0x" })
  }

  const handleCreate = () => {
    const proposal: SponsorshipProposal = {
      id: `pr${Date.now()}`,
      title: formTitle,
      eventId: formEventId,
      sponsorIds: formSponsorIds,
      proposedBudget: formBudget,
      benefits: formBenefits,
      roiEstimates: formROI,
      status: "draft",
      createdAt: new Date().toISOString().split("T")[0],
    }
    dispatch({ type: "ADD_PROPOSAL", payload: proposal })
    setCreateOpen(false)
    resetForm()
  }

  const toggleSponsor = (sponsorId: string) => {
    setFormSponsorIds((prev) =>
      prev.includes(sponsorId) ? prev.filter((id) => id !== sponsorId) : [...prev, sponsorId]
    )
  }

  const updateBenefitText = (tier: SponsorTier, text: string) => {
    setFormBenefits((prev) =>
      prev.map((b) => b.tier === tier ? { ...b, benefits: text.split("\n").filter(Boolean) } : b)
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-balance">Sponsorship Proposals</h1>
          <p className="text-muted-foreground mt-1">Create and manage sponsorship proposals for your events.</p>
        </div>
        <Button onClick={() => { resetForm(); setCreateOpen(true) }} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Create Proposal
        </Button>
      </div>

      {/* Proposal Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {state.proposals.map((proposal) => {
          const event = state.events.find((e) => e.id === proposal.eventId)
          const sponsorCount = proposal.sponsorIds.length
          return (
            <Card key={proposal.id} className="group overflow-hidden transition-all hover:shadow-md hover:shadow-primary/5 hover:border-primary/30">
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                    <StatusBadge status={proposal.status} />
                    <h3 className="text-base font-semibold text-card-foreground leading-tight">{proposal.title}</h3>
                    {event && <span className="text-sm text-primary">{event.name}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{sponsorCount} {sponsorCount === 1 ? "sponsor" : "sponsors"}</span>
                  <span>Created {new Date(proposal.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <div>
                    <span className="text-xs text-muted-foreground">Proposed Budget</span>
                    <div className="text-lg font-bold font-display text-card-foreground tabular-nums">
                      {formatCurrency(proposal.proposedBudget)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">Est. ROI</span>
                    <div className="text-lg font-bold font-display text-primary tabular-nums">
                      {proposal.roiEstimates.estimatedROI}
                    </div>
                  </div>
                </div>

                <Button variant="ghost" size="sm" asChild className="w-full justify-between text-xs mt-auto">
                  <Link href={`/sponsorship/proposals/${proposal.id}`}>
                    <span className="flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      View Proposal
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {state.proposals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-card-foreground">No proposals yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Create your first sponsorship proposal to get started.</p>
        </div>
      )}

      {/* Multi-step Create Proposal Dialog */}
      <Dialog open={createOpen} onOpenChange={(val) => { setCreateOpen(val); if (!val) resetForm() }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Create Proposal - Step {step} of 4
            </DialogTitle>
            <DialogDescription>
              {step === 1 && "Select an event and give your proposal a title."}
              {step === 2 && "Choose sponsors to include and set the proposed budget."}
              {step === 3 && "Define the benefits for each sponsorship tier."}
              {step === 4 && "Set ROI estimates and review before creating."}
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Event + Title */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="pr-title">Proposal Title</Label>
                <Input id="pr-title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. City Cup 2026 Sponsorship Package" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Event</Label>
                <Select value={formEventId} onValueChange={setFormEventId}>
                  <SelectTrigger><SelectValue placeholder="Select an event" /></SelectTrigger>
                  <SelectContent>
                    {state.events.map((ev) => (
                      <SelectItem key={ev.id} value={ev.id}>{ev.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Sponsors + Budget */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Select Sponsors</Label>
                <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto rounded-lg border border-border p-2">
                  {state.sponsors.map((sponsor) => (
                    <label key={sponsor.id} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/50 cursor-pointer">
                      <Checkbox
                        checked={formSponsorIds.includes(sponsor.id)}
                        onCheckedChange={() => toggleSponsor(sponsor.id)}
                      />
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <span className="text-sm font-medium text-card-foreground">{sponsor.name}</span>
                        <span className="text-xs text-muted-foreground">{sponsor.contactPerson}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <TierBadge tier={sponsor.tier} />
                        <span className="text-sm font-medium text-card-foreground tabular-nums">{formatCurrency(sponsor.amount)}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pr-budget">Proposed Budget ($)</Label>
                <Input id="pr-budget" type="number" value={formBudget} onChange={(e) => setFormBudget(Number(e.target.value))} />
                <p className="text-xs text-muted-foreground">
                  Selected sponsors total: {formatCurrency(state.sponsors.filter(s => formSponsorIds.includes(s.id)).reduce((sum, s) => sum + s.amount, 0))}
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Benefits per tier */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">Define benefits for each tier. One benefit per line.</p>
              {(["platinum", "gold", "silver", "bronze"] as SponsorTier[]).map((tier) => {
                const benefit = formBenefits.find((b) => b.tier === tier)
                return (
                  <div key={tier} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <TierBadge tier={tier} />
                    </div>
                    <Textarea
                      value={benefit?.benefits.join("\n") || ""}
                      onChange={(e) => updateBenefitText(tier, e.target.value)}
                      placeholder={`Enter ${tier} benefits, one per line...`}
                      rows={3}
                      className="text-sm"
                    />
                  </div>
                )
              })}
            </div>
          )}

          {/* Step 4: ROI Estimates + Review */}
          {step === 4 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="roi-audience">Expected Audience</Label>
                  <Input id="roi-audience" type="number" value={formROI.expectedAudience} onChange={(e) => setFormROI({ ...formROI, expectedAudience: Number(e.target.value) })} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="roi-media">Media Reach</Label>
                  <Input id="roi-media" type="number" value={formROI.mediaReach} onChange={(e) => setFormROI({ ...formROI, mediaReach: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="roi-social">Social Impressions</Label>
                  <Input id="roi-social" type="number" value={formROI.socialImpressions} onChange={(e) => setFormROI({ ...formROI, socialImpressions: Number(e.target.value) })} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="roi-est">Estimated ROI</Label>
                  <Input id="roi-est" value={formROI.estimatedROI} onChange={(e) => setFormROI({ ...formROI, estimatedROI: e.target.value })} placeholder="e.g. 3.0x" />
                </div>
              </div>

              {/* Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Proposal Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title</span>
                      <span className="font-medium text-card-foreground">{formTitle || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Event</span>
                      <span className="font-medium text-card-foreground">{state.events.find(e => e.id === formEventId)?.name || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sponsors</span>
                      <span className="font-medium text-card-foreground">{formSponsorIds.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-medium text-card-foreground">{formatCurrency(formBudget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. ROI</span>
                      <span className="font-bold text-primary">{formROI.estimatedROI}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="flex-row justify-between gap-2">
            <div>
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setCreateOpen(false); resetForm() }}>
                Cancel
              </Button>
              {step < 4 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && (!formTitle.trim() || !formEventId)) ||
                    (step === 2 && formSponsorIds.length === 0)
                  }
                >
                  Next
                </Button>
              ) : (
                <Button onClick={handleCreate}>
                  Create Proposal
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
