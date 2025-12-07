
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
import { FirebaseClientProvider, useUser, useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";

function CmiContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/cmi/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/cmi/login');
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

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
                <span>Logout</span>
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
