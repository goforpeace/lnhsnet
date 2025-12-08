
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ImageIcon, Building2, PhoneForwarded, Mail, TrendingUp } from "lucide-react"

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
  {
    href: "/cmi/call-requests",
    label: "Call Requests",
    icon: PhoneForwarded,
  },
  {
    href: "/cmi/contact-submissions",
    label: "Contact Submissions",
    icon: Mail,
  },
  {
    href: "/cmi/seo",
    label: "SEO",
    icon: TrendingUp,
  }
]

export function DashboardNav() {
  const pathname = usePathname()

  // Don't render the nav on the login page itself
  if (pathname === "/cmi/login") {
    return null;
  }

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href + link.label}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(link.href) && (link.href !== '/cmi' || pathname === '/cmi')}
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
