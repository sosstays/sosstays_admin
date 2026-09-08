"use server"

import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"

export interface LoginState {
  error?: string
}

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = formData.get("password")
  const from = formData.get("from")
  const dashboardPassword = process.env.DASHBOARD_PASSWORD

  if (!dashboardPassword) {
    return { error: "Server is not configured with DASHBOARD_PASSWORD." }
  }

  if (typeof password !== "string" || password !== dashboardPassword) {
    return { error: "Incorrect password." }
  }

  const session = await getSession()
  session.isLoggedIn = true
  await session.save()

  redirect(typeof from === "string" && from ? from : "/")
}
