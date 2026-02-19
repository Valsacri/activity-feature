"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface EventBasicsStepProps {
  formData: any
  onUpdate: (data: any) => void
}

export function EventBasicsStep({ formData, onUpdate }: EventBasicsStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Event Name *</Label>
          <Input
            id="name"
            placeholder="e.g., City Cup Football Tournament"
            value={formData.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sport">Sport *</Label>
          <Input
            id="sport"
            placeholder="e.g., Football, Basketball, Athletics"
            value={formData.sport}
            onChange={(e) => onUpdate({ sport: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Event Type *</Label>
          <Select value={formData.type} onValueChange={(value) => onUpdate({ type: value })}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tournament">Tournament</SelectItem>
              <SelectItem value="program">Program</SelectItem>
              <SelectItem value="session">Session</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            placeholder="e.g., Central Stadium, City Sports Center"
            value={formData.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => onUpdate({ startDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => onUpdate({ endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Event Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the event, target participants, and key objectives..."
          value={formData.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mission">Mission Statement / Pitch *</Label>
        <Textarea
          id="mission"
          placeholder="What is the core mission and value proposition of this event? This will be used in sponsorship proposals."
          value={formData.mission}
          onChange={(e) => onUpdate({ mission: e.target.value })}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetAudience">Target Audience</Label>
        <Input
          id="targetAudience"
          placeholder="e.g., Youth ages 10-16, Professional athletes, Community members"
          value={formData.targetAudience}
          onChange={(e) => onUpdate({ targetAudience: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expectedAttendance">Expected Attendance</Label>
        <Input
          id="expectedAttendance"
          type="number"
          placeholder="Expected number of attendees"
          value={formData.expectedAttendance}
          onChange={(e) => onUpdate({ expectedAttendance: parseInt(e.target.value) || 0 })}
        />
      </div>
    </div>
  )
}
