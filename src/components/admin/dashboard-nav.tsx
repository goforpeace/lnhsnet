"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ImageIcon, Building2 } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const links = [
  {
    href: "/cmi",
    label: "Home",
    icon: Home,
  },
  {
    href: "/cmi/hero-images",
    label: "Hero Images",
    icon: ImageIcon,
  },
  {
    href: "/cmi/projects",
    label: "Projects",
    icon: Building2,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === link.href}
            tooltip={link.label}
          >
            <Link href={link.href}>
              <link.icon />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
