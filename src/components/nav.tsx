import Link from "next/link"
import { logout } from "@/lib/auth/actions"
import { Button } from "@/components/ui/button"

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/properties", label: "Properties" },
  { href: "/guests", label: "Guests" },
  { href: "/bookings", label: "Bookings" },
]

export function Nav() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <nav className="flex items-center gap-4">
          <Link href="/" className="font-semibold">
            SOS Stays Admin
          </Link>
          <div className="flex items-center gap-1">
            {links.slice(1).map((link) => (
              <Link key={link.href} href={link.href}>
                <Button variant="ghost" size="sm">
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </nav>
        <form action={logout}>
          <Button type="submit" variant="outline" size="sm">
            Log out
          </Button>
        </form>
      </div>
    </header>
  )
}
