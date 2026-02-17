"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Wrench } from "lucide-react"
import { useAppStore } from "@/lib/store"
import type { Equipment, EquipmentCategory } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
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

const categories: { value: EquipmentCategory; label: string }[] = [
  { value: "venue", label: "Venue" },
  { value: "gear", label: "Gear" },
  { value: "transport", label: "Transport" },
  { value: "tech", label: "Technology" },
  { value: "furniture", label: "Furniture" },
]

const categoryColors: Record<EquipmentCategory, string> = {
  venue: "bg-primary/15 text-primary",
  gear: "bg-accent/15 text-accent",
  transport: "bg-chart-3/15 text-chart-3",
  tech: "bg-chart-5/15 text-chart-5",
  furniture: "bg-muted text-muted-foreground",
}

const emptyEquipment: Omit<Equipment, "id"> = {
  name: "",
  category: "gear",
  unitCost: 0,
  quantity: 1,
  description: "",
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val)

export default function EquipmentPage() {
  const { state, dispatch } = useAppStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<Equipment | null>(null)
  const [form, setForm] = useState<Omit<Equipment, "id">>(emptyEquipment)
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = state.equipment.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openCreate = () => {
    setEditingItem(null)
    setForm(emptyEquipment)
    setDialogOpen(true)
  }

  const openEdit = (item: Equipment) => {
    setEditingItem(item)
    setForm({ name: item.name, category: item.category, unitCost: item.unitCost, quantity: item.quantity, description: item.description })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editingItem) {
      dispatch({ type: "UPDATE_EQUIPMENT", payload: { ...editingItem, ...form } })
    } else {
      dispatch({ type: "ADD_EQUIPMENT", payload: { id: `e${Date.now()}`, ...form } })
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deleteId) {
      dispatch({ type: "DELETE_EQUIPMENT", payload: deleteId })
      setDeleteId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-balance">Equipment</h1>
          <p className="text-muted-foreground mt-1">Manage venues, gear, transportation, and technology resources.</p>
        </div>
        <Button onClick={openCreate} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Equipment
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Search equipment..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Wrench className="h-4 w-4" />
          {filtered.length} items
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Unit Cost</TableHead>
                <TableHead className="hidden md:table-cell">Qty</TableHead>
                <TableHead className="hidden md:table-cell">Total</TableHead>
                <TableHead className="hidden lg:table-cell">Description</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-card-foreground">{item.name}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${categoryColors[item.category]}`}>
                      {categories.find((c) => c.value === item.category)?.label}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell tabular-nums">{formatCurrency(item.unitCost)}</TableCell>
                  <TableCell className="hidden md:table-cell tabular-nums">{item.quantity}</TableCell>
                  <TableCell className="hidden md:table-cell tabular-nums font-medium text-card-foreground">
                    {formatCurrency(item.unitCost * item.quantity)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell max-w-[200px]">
                    <span className="text-sm text-muted-foreground truncate block">{item.description}</span>
                  </TableCell>
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
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No equipment found.
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
            <DialogTitle>{editingItem ? "Edit Equipment" : "Add Equipment"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update the equipment details below." : "Fill in the details to add new equipment."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="eq-name">Name</Label>
              <Input id="eq-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Equipment name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(val: EquipmentCategory) => setForm({ ...form, category: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="eq-cost">Unit Cost ($)</Label>
                <Input id="eq-cost" type="number" value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: Number(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="eq-qty">Quantity</Label>
                <Input id="eq-qty" type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="eq-desc">Description</Label>
              <Textarea id="eq-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>
              {editingItem ? "Save Changes" : "Add Equipment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete equipment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the equipment item from the system and unassign it from any events.
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
