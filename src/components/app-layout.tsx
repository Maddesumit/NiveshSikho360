
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  PieChart,
  Wallet,
  Github,
  Newspaper,
  BookOpen,
  HelpCircle,
  Rocket,
  Loader,
  Store,
} from "lucide-react";
import { NiveshSikho360Icon } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { UserNav } from "./user-nav";
import { Skeleton } from "./ui/skeleton";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/future-plans';

  useEffect(() => {
    if (loading) return;

    // If user is logged in and tries to access a public page, redirect to dashboard
    if (user && (pathname === '/login' || pathname === '/signup' || pathname === '/')) {
      router.push('/dashboard');
    }

    // If user is not logged in and tries to access a protected page, redirect to login
    if (!user && !isPublicPage) {
      router.push('/login');
    }
  }, [user, loading, router, pathname, isPublicPage]);

  const navItems = [
    { href: "/dashboard", label: "Watchlist", icon: LayoutDashboard },
    { href: "/markets", label: "Markets", icon: Store },
    { href: "/portfolio", label: "Portfolio", icon: PieChart },
    { href: "/academy", label: "Academy", icon: BookOpen },
    { href: "/glossary", label: "Glossary", icon: HelpCircle },
  ];

  if (isPublicPage) {
    return <>{children}</>;
  }
  
  if (loading || (!user && !isPublicPage)) {
     return (
        <div className="flex h-screen items-center justify-center bg-background">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
     );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <NiveshSikho360Icon className="w-8 h-8 text-primary" />
            <span className="font-headline font-semibold text-xl text-primary">
              NiveshSikho360
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <a href="https://github.com/FirebaseExtended/ai-apps-collection-node" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" className="w-full justify-start gap-2">
                <Github />
                View on Github
            </Button>
           </a>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b bg-card">
          <SidebarTrigger />
          <UserNav />
        </header>
        <main className="flex-1 bg-background">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
