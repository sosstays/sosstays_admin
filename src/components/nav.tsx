"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Building2, Users, CalendarDays, Handshake, MessageSquare, LogOut } from "lucide-react"
import { logout } from "@/lib/auth/actions"
import { Logo } from "@/components/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const links = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/guests", label: "Guests", icon: Users },
  { href: "/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/leads", label: "Landlord Leads", icon: Handshake },
  { href: "/contact-queries", label: "Contact Queries", icon: MessageSquare },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-1 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Logo className="h-[17px] w-[26px] shrink-0 text-[var(--cream)]" />
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-heading text-base font-bold text-[var(--cream)]">
              SOS Stays
            </span>
            <span className="text-[10.5px] uppercase tracking-wider text-[var(--cream)] opacity-65">
              Admin
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="gap-1 px-2">
          {links.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
            const Icon = link.icon
            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={link.label}
                  render={<Link href={link.href} />}
                  className="text-[var(--cream)] data-[active=true]:font-semibold"
                >
                  <Icon strokeWidth={1.9} />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <form action={logout}>
          <SidebarMenuButton
            tooltip="Log out"
            render={<button type="submit" />}
            className="justify-center border border-white/30 text-[var(--cream)]"
          >
            <LogOut strokeWidth={1.9} />
            <span>Log out</span>
          </SidebarMenuButton>
        </form>
      </SidebarFooter>
    </Sidebar>
  )
}
