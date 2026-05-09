"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getPendingOwners, EventOwner } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Mail, 
  Phone, 
  Building, 
  FileText,
  Calendar
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

function OwnerApplicationCard({ owner }: { owner: EventOwner }) {
  const [rejectReason, setRejectReason] = useState("")

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Owner Info */}
          <div className="flex gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={owner.user.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {owner.businessName.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-card-foreground">
                {owner.businessName}
              </h3>
              <p className="text-sm text-muted-foreground">{owner.user.name}</p>
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                Pending Review
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-destructive border-destructive/50 hover:bg-destructive/10">
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Application</DialogTitle>
                  <DialogDescription>
                    Please provide a reason for rejecting this application. This will be sent to the applicant.
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  placeholder="Enter rejection reason..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="min-h-[100px]"
                />
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive">Confirm Rejection</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-success hover:bg-success/90 text-success-foreground">
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Approve Application</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to approve this event owner application? 
                    They will be able to create and publish events on the platform.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-success hover:bg-success/90">Confirm Approval</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Business Email</p>
              <p className="text-sm text-card-foreground">{owner.businessEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm text-card-foreground">{owner.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Applied</p>
              <p className="text-sm text-card-foreground">
                {format(owner.applicationDate, "MMM d, yyyy")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Documents</p>
              <p className="text-sm text-card-foreground">
                {owner.documents?.length || 0} files attached
              </p>
            </div>
          </div>
        </div>

        {/* Documents */}
        {owner.documents && owner.documents.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">Submitted Documents</p>
            <div className="flex flex-wrap gap-2">
              {owner.documents.map((doc, index) => (
                <Button key={index} variant="outline" size="sm" className="gap-2">
                  <FileText className="h-4 w-4" />
                  {doc}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function PendingOwnersPage() {
  const pendingOwners = getPendingOwners()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/owners">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pending Applications</h1>
          <p className="text-muted-foreground">
            Review and approve event owner applications
          </p>
        </div>
      </div>

      {pendingOwners.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-success mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground">All caught up!</h3>
            <p className="text-muted-foreground">No pending applications to review.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {pendingOwners.length} application{pendingOwners.length !== 1 ? "s" : ""} pending review
          </p>
          {pendingOwners.map((owner) => (
            <OwnerApplicationCard key={owner.id} owner={owner} />
          ))}
        </div>
      )}
    </div>
  )
}
