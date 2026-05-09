"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { emailTemplates, EmailTemplate } from "@/lib/mock-data"
import { ArrowLeft, Edit, Eye, Mail } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function EmailTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/settings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Email Templates</h1>
          <p className="text-muted-foreground">Customize automated email notifications</p>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">All Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Template</TableHead>
                <TableHead className="text-muted-foreground">Key</TableHead>
                <TableHead className="text-muted-foreground">Subject</TableHead>
                <TableHead className="text-muted-foreground">Last Updated</TableHead>
                <TableHead className="text-muted-foreground"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emailTemplates.map((template) => (
                <TableRow key={template.id} className="border-border">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{template.name}</p>
                        <p className="text-xs text-muted-foreground">{template.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {template.key}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-card-foreground">
                    {template.subject}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(template.updatedAt, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
