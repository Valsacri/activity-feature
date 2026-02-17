import { cn } from "@/lib/utils"

const statusConfig: Record<string, { className: string; label: string }> = {
  // Event statuses
  draft: { className: "bg-muted text-muted-foreground", label: "Draft" },
  planned: { className: "bg-chart-3/15 text-chart-3", label: "Planned" },
  active: { className: "bg-primary/15 text-primary", label: "Active" },
  completed: { className: "bg-muted text-muted-foreground", label: "Completed" },
  // Sponsor statuses
  prospect: { className: "bg-muted text-muted-foreground", label: "Prospect" },
  contacted: { className: "bg-chart-3/15 text-chart-3", label: "Contacted" },
  confirmed: { className: "bg-primary/15 text-primary", label: "Confirmed" },
  declined: { className: "bg-destructive/15 text-destructive", label: "Declined" },
  // Proposal statuses
  sent: { className: "bg-chart-3/15 text-chart-3", label: "Sent" },
  accepted: { className: "bg-primary/15 text-primary", label: "Accepted" },
  rejected: { className: "bg-destructive/15 text-destructive", label: "Rejected" },
}

const tierConfig: Record<string, { className: string; label: string }> = {
  platinum: { className: "bg-[hsl(210,20%,88%)]/20 text-[hsl(210,20%,68%)]", label: "Platinum" },
  gold: { className: "bg-accent/15 text-accent", label: "Gold" },
  silver: { className: "bg-muted text-muted-foreground", label: "Silver" },
  bronze: { className: "bg-[hsl(25,60%,50%)]/15 text-[hsl(25,60%,50%)]", label: "Bronze" },
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const config = statusConfig[status] || { className: "bg-muted text-muted-foreground", label: status }
  return (
    <span className={cn("inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium", config.className, className)}>
      {config.label}
    </span>
  )
}

export function TierBadge({ tier, className }: { tier: string; className?: string }) {
  const config = tierConfig[tier] || { className: "bg-muted text-muted-foreground", label: tier }
  return (
    <span className={cn("inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider", config.className, className)}>
      {config.label}
    </span>
  )
}
