import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { SubRouteItem } from "./routes";

interface SidebarDropdownProps {
  items: SubRouteItem[];
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({ items }) => {
  const pathname = usePathname();

  return (
    <ul className="mb-5.5 mt-5 flex flex-col gap-2.5 pl-6">
      {items.map((item) => {
        const isActive = pathname === item.route;
        return (
          <li key={item.route}>
            <Link
              href={item.route}
              className={cn(
                isActive && "text-foreground",
                "group relative flex items-center gap-2.5 rounded-sm px-4 font-medium duration-300 ease-in-out hover:text-white text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default React.memo(SidebarDropdown);
