"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  Settings,
  ScrollText,
  UserCheck,
  CalendarCheck,
  CreditCard,
  Flag,
  Mail,
  ChevronDown,
  Zap,
} from "lucide-react"
import { useState } from "react"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  children?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    children: [
      { title: "All Users", href: "/admin/users" },
      { title: "Event Owners", href: "/admin/users/owners" },
    ],
  },
  {
    title: "Event Owners",
    href: "/admin/owners",
    icon: UserCheck,
    children: [
      { title: "All Owners", href: "/admin/owners" },
      { title: "Pending Approval", href: "/admin/owners/pending" },
    ],
  },
  {
    title: "Events",
    href: "/admin/events",
    icon: Calendar,
    children: [
      { title: "All Events", href: "/admin/events" },
      { title: "Pending Review", href: "/admin/events/pending" },
    ],
  },
  {
    title: "Finance",
    href: "/admin/finance",
    icon: DollarSign,
    children: [
      { title: "Revenue", href: "/admin/finance" },
      { title: "Payouts", href: "/admin/finance/payouts" },
    ],
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    children: [
      { title: "Platform", href: "/admin/settings" },
      { title: "Email Templates", href: "/admin/settings/email-templates" },
      { title: "Feature Flags", href: "/admin/settings/feature-flags" },
    ],
  },
  {
    title: "Audit Log",
    href: "/admin/audit-log",
    icon: ScrollText,
  },
]

function NavItemComponent({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(
    item.children?.some((child) => pathname === child.href) || false
  )

  const isActive = pathname === item.href || 
    (item.children?.some((child) => pathname === child.href) ?? false)
  const Icon = item.icon

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          )}
        >
          <span className="flex items-center gap-3">
            <Icon className="h-4 w-4" />
            {item.title}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>
        {isOpen && (
          <div className="ml-6 mt-1 space-y-1 border-l border-sidebar-border pl-3">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                  pathname === child.href
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                {child.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        pathname === item.href
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {item.title}
    </Link>
  )
}

export function AdminSidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Zap className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">
          Brendan&apos;s Kitchen
        </span>
        <span className="ml-auto rounded bg-sidebar-accent px-2 py-0.5 text-xs font-medium text-sidebar-accent-foreground">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => (
          <NavItemComponent key={item.href} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-sidebar-accent/50 p-3">
          <p className="text-xs font-medium text-sidebar-foreground">
            Platform Status
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="text-xs text-sidebar-foreground/70">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
