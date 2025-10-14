import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import AppSidebar from "./_components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="bg-background sticky top-0 z-10 border-b p-2 sm:p-3">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
