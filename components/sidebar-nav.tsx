"use client"
import { Truck, LayoutDashboard, Users, DollarSign, LogOut } from 'lucide-react'
import { SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarContent } from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/button'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/trips', label: 'Viagens', icon: Truck },
  { href: '/drivers', label: 'Motoristas', icon: Users },
  { href: '/costs', label: 'Custos', icon: DollarSign },
]

export function SidebarNav() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-accent p-2 rounded-lg">
            <Truck className="w-6 h-6 text-accent-foreground" />
          </div>
          <span className="text-xl font-bold font-headline text-sidebar-foreground">LogiFlow</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive(item.href)}>
                  <Link href={item.href}>
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push('/')}>
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}
