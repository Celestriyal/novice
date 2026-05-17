'use client';

import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider, useAuth } from "@/components/providers/AuthProvider";
import { SyncProvider } from "@/components/providers/SyncProvider";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SyncProvider>
        <ThemeProvider>
          <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.02),transparent_50%)] pointer-events-none" />
          <SidebarWrapper />
          <ContentWrapper>
            {children}
          </ContentWrapper>
          <BottomNavWrapper />
        </ThemeProvider>
      </SyncProvider>
    </AuthProvider>
  );
}

function SidebarWrapper() {
  const { user } = useAuth();
  const pathname = usePathname();
  if (!user || pathname === '/login') return null;
  return <Sidebar />;
}

function BottomNavWrapper() {
  const { user } = useAuth();
  const pathname = usePathname();
  if (!user || pathname === '/login') return null;
  return <BottomNav />;
}

function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  
  return (
    <main className={cn(
      "flex-1 relative z-10",
      !isLoginPage && user ? "md:ml-64 p-4 md:p-8 pb-32 md:pb-8" : "p-0"
    )}>
      <div className={cn("mx-auto", !isLoginPage ? "max-w-6xl" : "")}>
        {children}
      </div>
    </main>
  );
}
