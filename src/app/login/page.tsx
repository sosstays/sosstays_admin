import { Logo } from "@/components/logo"
import { LoginForm } from "./login-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const { from } = await searchParams

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col items-center justify-center gap-6 bg-[var(--forest)] px-12 text-center text-[var(--cream)] md:flex">
        <Logo className="h-14 w-[86px]" />
        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-[32px] font-bold">SOS Stays Admin</h1>
          <p className="max-w-xs text-sm opacity-80">
            Internal dashboard for managing properties, guests, and bookings.
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center bg-[var(--background)] px-6 md:w-1/2">
        <LoginForm from={from} />
      </div>
    </div>
  )
}
