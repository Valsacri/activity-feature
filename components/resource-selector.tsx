"use client"

import { useState } from "react"
import { Check, Plus, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface ResourceItem {
  id: string
  name: string
  subtitle: string
  detail?: string
}

interface ResourceSelectorProps {
  title: string
  items: ResourceItem[]
  selectedIds: string[]
  onToggle: (id: string) => void
  triggerLabel?: string
}

export function ResourceSelector({
  title,
  items,
  selectedIds,
  onToggle,
  triggerLabel = "Add Resource",
}: ResourceSelectorProps) {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Select resources to assign to this event. Click items to toggle them.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <ScrollArea className="max-h-[320px]">
          <div className="flex flex-col gap-1">
            {filtered.map((item) => {
              const isSelected = selectedIds.includes(item.id)
              return (
                <button
                  key={item.id}
                  onClick={() => onToggle(item.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                    isSelected
                      ? "bg-primary/10 text-card-foreground"
                      : "hover:bg-muted text-card-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-md border flex-shrink-0 transition-colors",
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-border"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">{item.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{item.subtitle}</span>
                  </div>
                  {item.detail && (
                    <span className="text-xs font-medium text-muted-foreground flex-shrink-0">
                      {item.detail}
                    </span>
                  )}
                </button>
              )
            })}
            {filtered.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No items found.
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
