"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { SOCIAL_IMPACT_ANGLES } from "@/lib/data"

interface SocialImpactStepProps {
  formData: any
  onUpdate: (data: any) => void
}

export function SocialImpactStep({ formData, onUpdate }: SocialImpactStepProps) {
  const toggleAngle = (angle: string) => {
    const updated = formData.socialImpactAngles.includes(angle)
      ? formData.socialImpactAngles.filter((a: string) => a !== angle)
      : [...formData.socialImpactAngles, angle]
    onUpdate({ socialImpactAngles: updated })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-semibold">Event Social Impact Angles</Label>
        <p className="text-sm text-muted-foreground">
          Select the social impact angles that your event addresses. These will help sponsors understand the value and alignment of their investment.
        </p>
      </div>

      <div className="grid gap-3">
        {SOCIAL_IMPACT_ANGLES.map((angle) => {
          const isSelected = formData.socialImpactAngles.includes(angle.value)
          return (
            <Card
              key={angle.value}
              className={`p-4 cursor-pointer transition-colors ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => toggleAngle(angle.value)}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleAngle(angle.value)}
                  className="mt-1"
                  aria-label={angle.label}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-card-foreground">{angle.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{angle.description}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {formData.socialImpactAngles.length > 0 && (
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 border border-blue-200 dark:border-blue-800">
          <div className="text-sm font-semibold text-blue-900 dark:text-blue-100">Selected Impact Angles ({formData.socialImpactAngles.length})</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.socialImpactAngles.map((angle: string) => {
              const angleData = SOCIAL_IMPACT_ANGLES.find((a) => a.value === angle)
              return (
                <span
                  key={angle}
                  className="inline-block bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 text-xs px-2 py-1 rounded"
                >
                  {angleData?.label}
                </span>
              )
            })}
          </div>
        </div>
      )}

      <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-4 border border-amber-200 dark:border-amber-800">
        <div className="text-sm font-semibold text-amber-900 dark:text-amber-100">Sponsorship Deck Tip</div>
        <p className="text-sm text-amber-900 dark:text-amber-100 mt-2">
          The social impact angles you select here will be prominently featured in auto-generated sponsorship proposals. This helps sponsors see the specific value your event creates for the community.
        </p>
      </div>
    </div>
  )
}
