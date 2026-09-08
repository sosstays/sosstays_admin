import { Nav } from "@/components/nav"

// Every page here reads live Supabase data behind the auth gate — never
// statically prerender against it.
export const dynamic = "force-dynamic"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </div>
  )
}
