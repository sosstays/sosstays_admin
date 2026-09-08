"use client"

import { useActionState } from "react"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login, type LoginState } from "./actions"

const initialState: LoginState = {}

export function LoginForm({ from }: { from?: string }) {
  const [state, formAction, pending] = useActionState(login, initialState)

  return (
    <div className="w-full max-w-sm">
      <h2 className="font-heading text-2xl font-bold text-[var(--ink)]">Welcome back</h2>
      <p className="mt-1 text-sm text-[var(--ink-soft)]">
        Enter the shared password to continue.
      </p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="from" value={from ?? ""} />
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-soft)]" strokeWidth={1.9} />
            <Input id="password" name="password" type="password" autoFocus required className="pl-9" />
          </div>
        </div>

        {state.error ? (
          <p className="rounded-md bg-[var(--error-bg)] px-3 py-2 text-sm text-[var(--error)]">
            {state.error}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={pending}
          className="bg-[var(--forest)] text-[var(--cream)] hover:bg-[var(--forest-deep)]"
        >
          {pending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  )
}
