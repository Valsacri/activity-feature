"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Users, Mail, Phone } from "lucide-react"
import { useAppStore } from "@/lib/store"
import type { Person, PersonRole } from "@/lib/data"
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

const roles: { value: PersonRole; label: string }[] = [
  { value: "coordinator", label: "Coordinator" },
  { value: "volunteer", label: "Volunteer" },
  { value: "coach", label: "Coach" },
  { value: "medic", label: "Medic" },
  { value: "security", label: "Security" },
  { value: "referee", label: "Referee" },
]

const roleColors: Record<PersonRole, string> = {
  coordinator: "bg-primary/15 text-primary",
  volunteer: "bg-chart-3/15 text-chart-3",
  coach: "bg-accent/15 text-accent",
  medic: "bg-chart-4/15 text-chart-4",
  security: "bg-muted text-muted-foreground",
  referee: "bg-chart-5/15 text-chart-5",
}

const emptyPerson: Omit<Person, "id"> = {
  name: "",
  role: "volunteer",
  hourlyRate: 0,
  email: "",
  phone: "",
}

export default function PeoplePage() {
  const { state, dispatch } = useAppStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingPerson, setEditingPerson] = useState<Person | null>(null)
  const [form, setForm] = useState<Omit<Person, "id">>(emptyPerson)
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = state.people.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openCreate = () => {
    setEditingPerson(null)
    setForm(emptyPerson)
    setDialogOpen(true)
  }

  const openEdit = (person: Person) => {
    setEditingPerson(person)
    setForm({ name: person.name, role: person.role, hourlyRate: person.hourlyRate, email: person.email, phone: person.phone })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editingPerson) {
      dispatch({ type: "UPDATE_PERSON", payload: { ...editingPerson, ...form } })
    } else {
      dispatch({ type: "ADD_PERSON", payload: { id: `p${Date.now()}`, ...form } })
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deleteId) {
      dispatch({ type: "DELETE_PERSON", payload: deleteId })
      setDeleteId(null)
    }
  }

  // Find events each person is assigned to
  const getAssignedEvents = (personId: string) =>
    state.events.filter((e) => e.assignedPeople.includes(personId))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-balance">People</h1>
          <p className="text-muted-foreground mt-1">Manage staff, volunteers, coaches, and other personnel.</p>
        </div>
        <Button onClick={openCreate} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Person
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Search people..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          {filtered.length} {filtered.length === 1 ? "person" : "people"}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Rate</TableHead>
                <TableHead className="hidden lg:table-cell">Contact</TableHead>
                <TableHead className="hidden lg:table-cell">Assigned Events</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((person) => {
                const assignedEvents = getAssignedEvents(person.id)
                return (
                  <TableRow key={person.id}>
                    <TableCell className="font-medium text-card-foreground">{person.name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${roleColors[person.role]}`}>
                        {roles.find((r) => r.value === person.role)?.label}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell tabular-nums">
                      ${person.hourlyRate}/hr
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {person.email}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {person.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {assignedEvents.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {assignedEvents.map((ev) => (
                            <span key={ev.id} className="inline-flex rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                              {ev.name.length > 18 ? ev.name.slice(0, 18) + "..." : ev.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(person)}>
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit {person.name}</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(person.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Delete {person.name}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No people found.
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
            <DialogTitle>{editingPerson ? "Edit Person" : "Add Person"}</DialogTitle>
            <DialogDescription>
              {editingPerson ? "Update the person's details below." : "Fill in the details to add a new person."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(val: PersonRole) => setForm({ ...form, role: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="rate">Hourly Rate ($)</Label>
                <Input id="rate" type="number" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: Number(e.target.value) })} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555-0100" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>
              {editingPerson ? "Save Changes" : "Add Person"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete person?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the person from the system. They will also be unassigned from any events.
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
