"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Mail, Phone, Handshake } from "lucide-react"
import { useAppStore } from "@/lib/store"
import type { Sponsor, SponsorTier, SponsorStatus } from "@/lib/data"
import { StatusBadge, TierBadge } from "@/components/status-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const tiers: { value: SponsorTier; label: string }[] = [
  { value: "platinum", label: "Platinum" },
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "bronze", label: "Bronze" },
]

const statuses: { value: SponsorStatus; label: string }[] = [
  { value: "prospect", label: "Prospect" },
  { value: "contacted", label: "Contacted" },
  { value: "confirmed", label: "Confirmed" },
  { value: "declined", label: "Declined" },
]

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val)

const emptySponsor: Omit<Sponsor, "id"> = {
  name: "",
  contactPerson: "",
  email: "",
  phone: "",
  tier: "silver",
  amount: 0,
  status: "prospect",
}

export default function SponsorsPage() {
  const { state, dispatch } = useAppStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null)
  const [form, setForm] = useState<Omit<Sponsor, "id">>(emptySponsor)
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = state.sponsors.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalConfirmed = state.sponsors
    .filter((s) => s.status === "confirmed")
    .reduce((sum, s) => sum + s.amount, 0)

  const openCreate = () => {
    setEditingSponsor(null)
    setForm(emptySponsor)
    setDialogOpen(true)
  }

  const openEdit = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor)
    setForm({
      name: sponsor.name,
      contactPerson: sponsor.contactPerson,
      email: sponsor.email,
      phone: sponsor.phone,
      tier: sponsor.tier,
      amount: sponsor.amount,
      status: sponsor.status,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editingSponsor) {
      dispatch({ type: "UPDATE_SPONSOR", payload: { ...editingSponsor, ...form } })
    } else {
      dispatch({ type: "ADD_SPONSOR", payload: { id: `s${Date.now()}`, ...form } })
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deleteId) {
      dispatch({ type: "DELETE_SPONSOR", payload: deleteId })
      setDeleteId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-balance">Sponsors</h1>
          <p className="text-muted-foreground mt-1">
            Manage sponsor relationships. {formatCurrency(totalConfirmed)} confirmed sponsorship.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Sponsor
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Search sponsors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Handshake className="h-4 w-4" />
          {filtered.length} sponsors
        </div>
      </div>

      {/* Sponsor Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((sponsor) => (
          <Card key={sponsor.id} className="group relative overflow-hidden transition-all hover:shadow-md hover:shadow-primary/5 hover:border-primary/30">
            <CardContent className="p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <TierBadge tier={sponsor.tier} />
                    <StatusBadge status={sponsor.status} />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground leading-tight">{sponsor.name}</h3>
                  <span className="text-sm text-muted-foreground">{sponsor.contactPerson}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(sponsor)}>
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="sr-only">Edit {sponsor.name}</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(sponsor.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete {sponsor.name}</span>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                  {sponsor.email}
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                  {sponsor.phone}
                </span>
              </div>

              <div className="border-t border-border pt-3">
                <span className="text-xs text-muted-foreground">Sponsorship Amount</span>
                <div className="text-2xl font-bold font-display text-card-foreground tabular-nums">
                  {formatCurrency(sponsor.amount)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Handshake className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-card-foreground">No sponsors found</h3>
          <p className="text-sm text-muted-foreground mt-1">Add a sponsor to get started with sponsorship management.</p>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingSponsor ? "Edit Sponsor" : "Add Sponsor"}</DialogTitle>
            <DialogDescription>
              {editingSponsor ? "Update the sponsor details." : "Fill in the sponsor information below."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="sp-name">Company Name</Label>
              <Input id="sp-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Sponsor company name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sp-contact">Contact Person</Label>
              <Input id="sp-contact" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} placeholder="Primary contact name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="sp-email">Email</Label>
                <Input id="sp-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="sp-phone">Phone</Label>
                <Input id="sp-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Tier</Label>
                <Select value={form.tier} onValueChange={(val: SponsorTier) => setForm({ ...form, tier: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {tiers.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(val: SponsorStatus) => setForm({ ...form, status: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="sp-amount">Amount ($)</Label>
                <Input id="sp-amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>
              {editingSponsor ? "Save Changes" : "Add Sponsor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete sponsor?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the sponsor and their data. They will also be removed from any proposals.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
