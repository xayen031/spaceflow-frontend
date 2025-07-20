import { GalleryVerticalEnd } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"
import React, { useState } from "react"

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message, {
        duration: 3000,
      })
    } else {
      toast.success("Giriş Başarılı Yönlendiriliyorsunuz", {
        duration: 2000,
      })
      navigate("/anasayfa")
    }
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Spaceflow
        </a>
        <div className={cn("flex flex-col gap-6")}>
        <Card>
            <CardHeader className="text-center">
            <CardTitle className="text-xl">Hoşgeldiniz</CardTitle>
            <CardDescription>
                Email ve Şifre ile giriş yapın
            </CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleLogin}> {/* */}
                <div className="grid gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="ornek@kullanici.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>
                    <div className="grid gap-3">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <Input 
                        id="password" 
                        type="password" 
                        required 
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </div>
                    <Button 
                        type="submit" 
                        className="w-full"
                        >
                        Giriş Yap
                    </Button>
                </div>
                </div>
            </form>
            </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}