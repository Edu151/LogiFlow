"use client"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Truck } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd have authentication logic here
    router.push('/dashboard')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-4 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="bg-primary p-3 rounded-full">
              <Truck className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold font-headline text-primary">LogiFlow</h1>
          </div>
          <CardTitle className="text-2xl font-headline">Bem-vindo de volta!</CardTitle>
          <CardDescription>Faça login para gerenciar sua logística.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" defaultValue="admin@logiflow.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required defaultValue="password" />
            </div>
            <Button type="submit" className="w-full !mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
              Entrar
            </Button>
            <Button variant="link" className="w-full text-muted-foreground">
              Esqueceu a senha?
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
