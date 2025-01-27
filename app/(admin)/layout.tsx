"use client"
import AdminHeader from "@/components/header/admin";
import AdminSidebar from "@/components/sidebars/admin";
import { SidebarProvider } from "@/providers/SidebarProviders";


export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <title>Admin</title>
      <SidebarProvider>
        <div className="h-screen">
          <div className="flex">
            <AdminSidebar/>
            <div className="relative flex flex-1 flex-col lg:ml-72.5 overflow-y-auto overflow-x-hidden">
              <AdminHeader/>
              <main className="mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                {children}
              </main>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
