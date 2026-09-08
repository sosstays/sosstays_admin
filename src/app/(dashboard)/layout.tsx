import { Nav } from "@/components/nav"

// Every page here reads live Supabase data behind the auth gate — never
// statically prerender against it.
export const dynamic = "force-dynamic"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Nav />
      <main className="flex-1 overflow-y-auto bg-[var(--background)] px-13 py-11">
        {children}
      </main>
    </div>
  )
}
