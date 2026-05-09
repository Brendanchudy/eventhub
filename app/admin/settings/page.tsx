"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { platformSettings } from "@/lib/mock-data"
import { Save, AlertTriangle } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function SettingsPage() {
  const [settings, setSettings] = useState(platformSettings)
  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = (key: string, value: unknown) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Platform Settings</h1>
          <p className="text-muted-foreground">Configure global platform settings</p>
        </div>
        <Button className="gap-2" disabled={!hasChanges}>
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/settings/email-templates">
          <Card className="bg-card border-border hover:bg-secondary/50 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <h3 className="font-medium text-card-foreground">Email Templates</h3>
              <p className="text-sm text-muted-foreground">Customize email notifications</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/settings/feature-flags">
          <Card className="bg-card border-border hover:bg-secondary/50 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <h3 className="font-medium text-card-foreground">Feature Flags</h3>
              <p className="text-sm text-muted-foreground">Toggle platform features</p>
            </CardContent>
          </Card>
        </Link>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="font-medium text-card-foreground">API Keys</h3>
            <p className="text-sm text-muted-foreground">Manage integrations</p>
          </CardContent>
        </Card>
      </div>

      {/* Commission Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Commission Settings</CardTitle>
          <CardDescription>Configure platform commission rates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                value={settings.commissionRate}
                onChange={(e) => handleChange("commissionRate", Number(e.target.value))}
                className="bg-secondary border-0"
              />
              <p className="text-xs text-muted-foreground">
                Percentage of each booking taken as platform fee
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultCurrency">Default Currency</Label>
              <Input
                id="defaultCurrency"
                value={settings.defaultCurrency}
                onChange={(e) => handleChange("defaultCurrency", e.target.value)}
                className="bg-secondary border-0"
              />
              <p className="text-xs text-muted-foreground">
                Default currency for new events
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Ticket Settings</CardTitle>
          <CardDescription>Configure ticket pricing and limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="minTicketPrice">Minimum Ticket Price (₦)</Label>
              <Input
                id="minTicketPrice"
                type="number"
                value={settings.minTicketPrice}
                onChange={(e) => handleChange("minTicketPrice", Number(e.target.value))}
                className="bg-secondary border-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxTicketPrice">Maximum Ticket Price (₦)</Label>
              <Input
                id="maxTicketPrice"
                type="number"
                value={settings.maxTicketPrice}
                onChange={(e) => handleChange("maxTicketPrice", Number(e.target.value))}
                className="bg-secondary border-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxTicketsPerBooking">Max Tickets per Booking</Label>
              <Input
                id="maxTicketsPerBooking"
                type="number"
                value={settings.maxTicketsPerBooking}
                onChange={(e) => handleChange("maxTicketsPerBooking", Number(e.target.value))}
                className="bg-secondary border-0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refund Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Refund Policy</CardTitle>
          <CardDescription>Configure automatic refund rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="refundWindowDays">Refund Window (Days)</Label>
            <Input
              id="refundWindowDays"
              type="number"
              value={settings.refundWindowDays}
              onChange={(e) => handleChange("refundWindowDays", Number(e.target.value))}
              className="bg-secondary border-0"
            />
            <p className="text-xs text-muted-foreground">
              Number of days before event when refunds are no longer allowed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card className="bg-card border-border border-warning/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Maintenance Mode
          </CardTitle>
          <CardDescription>
            Enable maintenance mode to prevent new bookings while performing updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-card-foreground">
                Maintenance Mode
              </p>
              <p className="text-xs text-muted-foreground">
                When enabled, users cannot make new bookings
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => handleChange("maintenanceMode", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
