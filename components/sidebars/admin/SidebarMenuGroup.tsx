"use client"
import React from "react";
import { RouteGroup } from "./routes";
import SidebarItem from "./SidebarItem";

interface SidebarMenuGroupProps {
  name: string;
  items: RouteGroup;
  page: string;
  setPage: (value: string) => void;
}

const SidebarMenuGroup: React.FC<SidebarMenuGroupProps> = ({ name, items, page, setPage }) => {
  return (
    <div>
      <h3 className="mb-4 ml-4 text-sm font-semibold text-muted-foreground">
        {name.toLocaleUpperCase()}
      </h3>
      <ul className="mb-6 flex flex-col gap-1.5">
        {items.map((item) => (
          <SidebarItem key={item.route} item={item} page={page} setPage={setPage} />
        ))}
      </ul>
    </div>
  );
};

export default React.memo(SidebarMenuGroup);
