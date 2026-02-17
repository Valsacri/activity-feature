"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { AlertTriangle } from "lucide-react"

interface BudgetBreakdown {
  people: number
  equipment: number
  financials: number
  communication: number
  total: number
}

const BUDGET_THRESHOLD = 50000

const COLORS = [
  "hsl(160, 84%, 45%)",
  "hsl(37, 92%, 50%)",
  "hsl(200, 80%, 50%)",
  "hsl(340, 75%, 60%)",
]

export function BudgetSummary({ budget, compact = false }: { budget: BudgetBreakdown; compact?: boolean }) {
  const data = [
    { name: "People", value: budget.people },
    { name: "Equipment", value: budget.equipment },
    { name: "Financials", value: budget.financials },
    { name: "Communication", value: budget.communication },
  ].filter(d => d.value > 0)

  const isOverBudget = budget.total > BUDGET_THRESHOLD

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val)

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold font-display text-card-foreground">{formatCurrency(budget.total)}</span>
        {isOverBudget && <AlertTriangle className="h-4 w-4 text-accent" />}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Budget Breakdown</CardTitle>
          {isOverBudget && (
            <div className="flex items-center gap-1.5 text-accent">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium">Over threshold</span>
            </div>
          )}
        </div>
        <div className="text-3xl font-bold font-display tracking-tight text-card-foreground">
          {formatCurrency(budget.total)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="h-32 w-32 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={55}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
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
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2.5 flex-1 min-w-0">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-muted-foreground truncate">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-card-foreground tabular-nums">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
