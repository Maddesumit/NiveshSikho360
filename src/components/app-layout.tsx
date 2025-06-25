
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PieChart,
  Store,
  BookOpen,
  HelpCircle,
  Loader,
  Github,
  ListOrdered,
} from "lucide-react";
import { NiveshSikho360Icon } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { UserNav } from "./user-nav";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import TutorialGuide from "./tutorial-guide";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [open, setOpen] = React.useState(false);

  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/future-plans';

  useEffect(() => {
    if (loading) return;

    if (user && (pathname === '/login' || pathname === '/signup' || pathname === '/')) {
      router.push('/dashboard');
    }

    if (!user && !isPublicPage) {
      router.push('/login');
    }
  }, [user, loading, router, pathname, isPublicPage]);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/markets", label: "Markets", icon: Store },
    { href: "/portfolio", label: "Portfolio", icon: PieChart },
    { href: "/orders", label: "Orders", icon: ListOrdered },
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

  const NavContent = ({isMobile = false}: {isMobile?: boolean}) => (
    <nav className={cn(
        "flex items-center text-sm font-medium",
        isMobile ? "flex-col space-y-4 items-start" : "space-x-6"
    )}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => isMobile && setOpen(false)}
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname.startsWith(item.href) ? "text-foreground" : "text-foreground/60",
            isMobile && "text-lg"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
     <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <NiveshSikho360Icon className="h-6 w-6" />
          <span className="sr-only">NiveshSikho360</span>
        </Link>
        
        <div className="hidden md:flex md:flex-1 md:items-center md:gap-5 lg:gap-6">
            <div className="flex-1">
                <NavContent />
            </div>
        </div>

        <div className="flex w-full items-center gap-4 md:ml-auto md:flex-1 md:justify-end">
             <a href="https://github.com/FirebaseExtended/ai-apps-collection-node" target="_blank" rel="noopener noreferrer" className="hidden md:block">
                <Button variant="ghost" size="icon">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                </Button>
            </a>
           <UserNav />
           <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-6 pt-6">
                    <NavContent isMobile={true} />
                </div>
              </SheetContent>
            </Sheet>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
      <TutorialGuide />
    </div>
  );
}
