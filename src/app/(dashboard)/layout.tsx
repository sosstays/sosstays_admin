import { Nav } from "@/components/nav"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

// Every page here reads live Supabase data behind the auth gate — never
// statically prerender against it.
export const dynamic = "force-dynamic"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <Nav />
      <SidebarInset className="overflow-y-auto bg-[var(--background)]">
        <div className="border-b border-[var(--border-soft)] px-4 py-2">
          <SidebarTrigger />
        </div>
        <div className="px-13 py-11">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
