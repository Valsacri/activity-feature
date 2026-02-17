"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Megaphone } from "lucide-react"
import { useAppStore } from "@/lib/store"
import type { CommunicationItem, CommunicationType } from "@/lib/data"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

const commTypes: { value: CommunicationType; label: string }[] = [
  { value: "social-media", label: "Social Media" },
  { value: "press", label: "Press" },
  { value: "signage", label: "Signage" },
  { value: "email-campaign", label: "Email Campaign" },
  { value: "live-stream", label: "Live Stream" },
]

const typeColors: Record<CommunicationType, string> = {
  "social-media": "bg-primary/15 text-primary",
  press: "bg-accent/15 text-accent",
  signage: "bg-chart-3/15 text-chart-3",
  "email-campaign": "bg-chart-5/15 text-chart-5",
  "live-stream": "bg-chart-4/15 text-chart-4",
}

const emptyComm: Omit<CommunicationItem, "id"> = {
  name: "",
  type: "social-media",
  cost: 0,
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val)

export default function CommunicationPage() {
  const { state, dispatch } = useAppStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<CommunicationItem | null>(null)
  const [form, setForm] = useState<Omit<CommunicationItem, "id">>(emptyComm)
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = state.communication.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalCost = filtered.reduce((sum, c) => sum + c.cost, 0)

  const openCreate = () => {
    setEditingItem(null)
    setForm(emptyComm)
    setDialogOpen(true)
  }

  const openEdit = (item: CommunicationItem) => {
    setEditingItem(item)
    setForm({ name: item.name, type: item.type, cost: item.cost })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editingItem) {
      dispatch({ type: "UPDATE_COMMUNICATION", payload: { ...editingItem, ...form } })
    } else {
      dispatch({ type: "ADD_COMMUNICATION", payload: { id: `c${Date.now()}`, ...form } })
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deleteId) {
      dispatch({ type: "DELETE_COMMUNICATION", payload: deleteId })
      setDeleteId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-balance">Communication Plan</h1>
          <p className="text-muted-foreground mt-1">Manage social media campaigns, press releases, signage, and outreach.</p>
        </div>
        <Button onClick={openCreate} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Search communication items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Megaphone className="h-4 w-4" />
          {filtered.length} items &middot; {formatCurrency(totalCost)} total
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-card-foreground">{item.name}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${typeColors[item.type]}`}>
                      {commTypes.find((t) => t.value === item.type)?.label}
                    </span>
                  </TableCell>
                  <TableCell className="tabular-nums font-medium text-card-foreground">{formatCurrency(item.cost)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="sr-only">Edit {item.name}</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(item.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete {item.name}</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No communication items found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Communication Item" : "Add Communication Item"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update the communication item details." : "Fill in the details for the new communication item."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="comm-name">Name</Label>
              <Input id="comm-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Item name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(val: CommunicationType) => setForm({ ...form, type: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {commTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="comm-cost">Cost ($)</Label>
              <Input id="comm-cost" type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>
              {editingItem ? "Save Changes" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete communication item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the communication item from the system.
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
