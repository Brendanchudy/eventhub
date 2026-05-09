"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { featureFlags, FeatureFlag } from "@/lib/mock-data"
import { ArrowLeft, Plus, Settings } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { useState } from "react"

function FeatureFlagCard({ flag }: { flag: FeatureFlag }) {
  const [enabled, setEnabled] = useState(flag.enabled)

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-card-foreground">{flag.name}</h3>
              <Badge variant="outline" className="font-mono text-xs">
                {flag.key}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{flag.description}</p>
            <p className="text-xs text-muted-foreground">
              Last updated: {format(flag.updatedAt, "MMM d, yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${enabled ? "text-success" : "text-muted-foreground"}`}>
              {enabled ? "Enabled" : "Disabled"}
            </span>
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function FeatureFlagsPage() {
  const enabledCount = featureFlags.filter(f => f.enabled).length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/settings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Feature Flags</h1>
          <p className="text-muted-foreground">Toggle platform features on and off</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Flag
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Flags</p>
            <p className="text-2xl font-bold text-card-foreground">{featureFlags.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Enabled</p>
            <p className="text-2xl font-bold text-success">{enabledCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Disabled</p>
            <p className="text-2xl font-bold text-muted-foreground">
              {featureFlags.length - enabledCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Flags List */}
      <div className="space-y-3">
        {featureFlags.map((flag) => (
          <FeatureFlagCard key={flag.id} flag={flag} />
        ))}
      </div>
    </div>
  )
}
