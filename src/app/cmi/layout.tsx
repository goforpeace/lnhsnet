
"use client";

import Link from "next/link";
import { Mountain, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarFooter,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { DashboardNav } from "@/components/admin/dashboard-nav";
import { FirebaseClientProvider, useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";

function CmiContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const auth = useAuth();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      // After signing out, we might want to redirect or just let the app sign in anonymously again.
      // For now, we can just refresh the page to trigger a new anonymous session.
      router.refresh();
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex h-12 items-center gap-2 px-2">
            <Link href="/" className="flex items-center gap-2 font-semibold" prefetch={false}>
              <Mountain className="size-6 text-primary" />
            </Link>
            <h2 className="font-headline text-lg font-bold">Admin Panel</h2>
            <SidebarTrigger className="ml-auto" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <DashboardNav />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                <LogOut />
                <span>Logout / New Session</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="max-w-full">
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}


export default function CmiLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
        <CmiContent>{children}</CmiContent>
    </FirebaseClientProvider>
  );
}
