"use client"

import { useAuth } from "@/components/auth-provider"
import { LoginForm } from "@/components/login-form"
import { Dashboard } from "@/components/dashboard"
import { Loader2 } from "lucide-react"

export function AuthGate() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return <Dashboard />
}
