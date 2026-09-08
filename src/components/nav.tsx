"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Building2, Users, CalendarDays, LogOut } from "lucide-react"
import { logout } from "@/lib/auth/actions"
import { Logo } from "@/components/logo"

const links = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/guests", label: "Guests", icon: Users },
  { href: "/bookings", label: "Bookings", icon: CalendarDays },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-[var(--forest)] px-4 py-6 text-[var(--cream)]">
      <div className="flex items-center gap-2.5 px-2">
        <Logo className="h-[17px] w-[26px] shrink-0" />
        <div className="flex flex-col leading-tight">
          <span className="font-heading text-base font-bold">SOS Stays</span>
          <span className="text-[10.5px] uppercase tracking-wider opacity-65">Admin</span>
        </div>
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {links.map((link) => {
          const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive
                  ? "flex items-center gap-2.5 rounded-lg bg-[var(--sage-300)] px-3.5 py-2.5 font-semibold text-[var(--forest-deep)]"
                  : "flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-[var(--cream)] opacity-[.82] transition-colors hover:bg-white/[0.08]"
              }
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <form action={logout} className="mt-auto border-t border-white/15 pt-4">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/30 px-3.5 py-2 text-sm text-[var(--cream)] transition-colors hover:bg-white/[0.08]"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.9} />
          Log out
        </button>
      </form>
    </aside>
  )
}
