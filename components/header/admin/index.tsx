"use client";

import { ThemeSwitch } from "@/components/theme-swith";
import { useSidebar } from "@/providers/SidebarProviders";
import { Turn as Hamburger } from "hamburger-react";
import { Search } from "lucide-react";
import Link from "next/link";

const AdminHeader: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:shadow-none dark:bg-boxdark">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={toggleSidebar}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-stroke-dark dark:bg-boxdark lg:hidden"
          >
            <Hamburger toggled={isOpen} />
          </button>
          <Link href="/admin">SMART-FEES</Link>
        </div>
        <div className="hidden sm:block">
          <form action="https://formbold.com/s/unique_form_id" method="POST">
            <div className="relative">
              <button className="absolute left-0 top-1/2 -translate-y-1/2">
                <Search className="fill-transparent  hover:fill-transparent hover:border-primary" />
              </button>

              <input
                className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
                placeholder="Type to search..."
                type="text"
              />
            </div>
          </form>
        </div>
        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <li>
              <ThemeSwitch />
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
