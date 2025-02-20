"use client";

import ClickOutside from "@/components/ClickOutside";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/providers/SidebarProviders";
import Image from "next/image";
import Link from "next/link";
import { routes } from "./routes";
import SidebarMenuGroup from "./SidebarMenuGroup";
import { useLocalStorage } from "usehooks-ts";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const AdminSidebar = () => {
  const { closeSidebar, isOpen } = useSidebar();
  const [pageName, setPageName] = useLocalStorage("selected-menu", "dashboard");
  const pathname = usePathname();
  // Fonction utilitaire pour formater les labels
  const formatLabel = (label: string): string =>
    label.toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    const updatePageName = () => {
      // Itérer sur chaque groupe de routes
      for (const group of Object.keys(routes) as (keyof typeof routes)[]) {
        for (const item of routes[group]) {
          if (item.route === pathname) {
            setPageName(formatLabel(item.label));
            return;
          }
          if (item.children) {
            // Si on trouve une correspondance dans un enfant, on utilise le label du parent
            for (const child of item.children) {
              if (child.route === pathname) {
                setPageName(formatLabel(item.label));
                return;
              }
            }
          }
        }
      }
    };
    updatePageName();
  }, [pathname, setPageName]);

  return (
    <ClickOutside onClick={closeSidebar}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* SIDEBAR HEADER */}
        <div className="text-white flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link href="/admin">
            <Image
              src={"/assets/images/logos/full.webp"}
              alt="Logo"
              priority
              width={176}
              height={32}
            />
          </Link>
          <button
            aria-controls="sidebar"
            onClick={closeSidebar}
            className="block lg:hidden"
          >
            X
          </button>
        </div>
        {/* FIN SIDEBAR HEADER */}

        <div className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          {(Object.keys(routes) as (keyof typeof routes)[]).map((group) => (
            <SidebarMenuGroup
              key={group}
              name={group}
              items={routes[group]}
              page={pageName}
              setPage={setPageName}
            />
          ))}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default AdminSidebar;
