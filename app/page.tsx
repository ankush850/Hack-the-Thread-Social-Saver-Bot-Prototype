import { AuthProvider } from "@/components/auth-provider"
import { AuthGate } from "@/components/auth-gate"

export default function Page() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  )
}
