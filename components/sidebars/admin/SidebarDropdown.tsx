import { usePathname } from "next/navigation";
import { SubRouteItem } from "./routes";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props{
  items: SubRouteItem[]
}

const SidebarDropdown: React.FC<Props> = ({items}) => {
  const pathname = usePathname()

  return (
    <ul className="mb-5.5 mt-5 flex flex-col gap-2.5 pl-6">
      {items.map((item, index: number) => (
        <li key={index}>
          <Link
            href={item.route}
            className={cn(
              pathname === item.route && "text-foreground",
              "group relative flex items-center gap-2.5 rounded-sm px-4 font-medium duration-300 ease-in-out hover:text-white text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default SidebarDropdown

