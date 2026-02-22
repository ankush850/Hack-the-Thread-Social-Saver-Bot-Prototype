"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"
import { Bookmark, ArrowLeft, Loader2, Mail, Phone } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-provider"

type Step = "identifier" | "otp"

export function LoginForm() {
  const { login } = useAuth()
  const [step, setStep] = useState<Step>("identifier")
  const [type, setType] = useState<"email" | "phone">("email")
  const [identifier, setIdentifier] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [devOtp, setDevOtp] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) {
      toast.error(type === "email" ? "Enter an email address" : "Enter a phone number")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), type }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP")
      }

      // Store dev OTP for display
      if (data._dev_otp) {
        setDevOtp(data._dev_otp)
      }

      toast.success(data.message)
      setStep("otp")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpCode.length !== 6) {
      toast.error("Enter the complete 6-digit code")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          type,
          code: otpCode,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Verification failed")
      }

      toast.success("Welcome to Social Saver!")
      login(data.user)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
      setOtpCode("")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setStep("identifier")
    setOtpCode("")
    setDevOtp(null)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary">
            <Bookmark className="size-7 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground text-balance">
              Social Saver Bot
            </h1>
            <p className="text-sm text-muted-foreground">
              Save and organize links from WhatsApp
            </p>
          </div>
        </div>

        {/* Card */}
        <Card className="w-full border-border/60">
          {step === "identifier" ? (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Sign in</CardTitle>
                <CardDescription>
                  Enter your email or phone to receive a one-time code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={type}
                  onValueChange={(v) => {
                    setType(v as "email" | "phone")
                    setIdentifier("")
                  }}
                >
                  <TabsList className="mb-4 w-full">
                    <TabsTrigger value="email" className="flex-1 gap-1.5">
                      <Mail className="size-3.5" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger value="phone" className="flex-1 gap-1.5">
                      <Phone className="size-3.5" />
                      Phone
                    </TabsTrigger>
                  </TabsList>

                  <form onSubmit={handleRequestOtp}>
                    <TabsContent value="email">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          required
                          autoFocus
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="phone">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="phone">Phone number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          required
                          autoFocus
                        />
                        <p className="text-xs text-muted-foreground">
                          Include country code
                        </p>
                      </div>
                    </TabsContent>

                    <Button
                      type="submit"
                      className="mt-6 w-full"
                      disabled={loading || !identifier.trim()}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Sending code...
                        </>
                      ) : (
                        "Send verification code"
                      )}
                    </Button>
                  </form>
                </Tabs>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Enter verification code</CardTitle>
                <CardDescription>
                  {"We sent a 6-digit code to "}
                  <span className="font-medium text-foreground">
                    {identifier}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleVerifyOtp}
                  className="flex flex-col items-center gap-6"
                >
                  <InputOTP
                    maxLength={6}
                    value={otpCode}
                    onChange={setOtpCode}
                    autoFocus
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>

                  {devOtp && (
                    <div className="w-full rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-center">
                      <p className="text-xs text-muted-foreground">
                        Demo mode &mdash; your code is:
                      </p>
                      <p className="font-mono text-lg font-bold tracking-widest text-primary">
                        {devOtp}
                      </p>
                    </div>
                  )}

                  <div className="flex w-full flex-col gap-3">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading || otpCode.length !== 6}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify & sign in"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="gap-1.5"
                      onClick={handleBack}
                    >
                      <ArrowLeft className="size-3.5" />
                      Use a different {type}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
