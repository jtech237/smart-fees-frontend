import ClickOutside from "@/components/ClickOutside";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/providers/SidebarProviders";
import Image from "next/image";
import Link from "next/link";
import { routes } from "./routes";
import SidebarMenuGroup from "./SidebarMenuGroup";
import { useLocalStorage } from "usehooks-ts";

const AdminSidebar = () => {
  const { closeSidebar, isOpen } = useSidebar();
  const [pageName, setPageName] = useLocalStorage("selected-menu", "dashboard");

  return (
    <ClickOutside onClick={closeSidebar}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* <!-- SIDEBAR HEADER --> */}
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
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          {(Object.keys(routes) as (keyof typeof routes)[]).map((group, index) => (
            <SidebarMenuGroup
              key={index}
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
