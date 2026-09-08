import "server-only"
import { cookies } from "next/headers"
import { getIronSession, type SessionOptions } from "iron-session"

export interface SessionData {
  isLoggedIn: boolean
}

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret || sessionSecret.length < 32) {
  throw new Error(
    "SESSION_SECRET environment variable must be set and at least 32 characters long"
  )
}

export const sessionOptions: SessionOptions = {
  password: sessionSecret,
  cookieName: "sos_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions)
}
