import { usePathname } from "next/navigation";
import { RouteItem, SubRouteItem } from "./routes";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SidebarDropdown from "./SidebarDropdown";

interface Props {
  item: RouteItem;
  page: string;
  setPage: (value: string) => void;
}

const SidebarItem: React.FC<Props> = ({ item, page, setPage }) => {
  const handleClick = () => {
    const updatedPage =
      page !== item.label.toLowerCase().replace(/\s+/g, "-")
        ? item.label.toLowerCase().replace(/\s+/g, "-")
        : "";
    return setPage(updatedPage);
  };

  const pathname = usePathname();

  function isActive(
    item: Pick<RouteItem, "label" | "route" | "children">
  ): boolean {
    if (item.route === pathname) return true;
    if (item.children) {
      return item.children.some((child: SubRouteItem) => isActive(child));
    }
    return false;
  }

  const isItemActive = isActive(item);

  return (
    <>
      <li>
        <Link
          href={item.route ?? "#"}
          onClick={handleClick}
          className={cn(
            isItemActive && "bg-muted",
            "group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-muted"
          )}
        >
          {item.icon}
          {item.label}
          {item.children && (
            <svg
              className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                page === item.label.toLowerCase() && "rotate-180"
              }`}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                fill=""
              />
            </svg>
          )}
        </Link>

        {item.children && (
          <div
            className={`translate transform overflow-hidden ${
              page !== item.label.toLowerCase() && "hidden"
            }`}
          >
            <SidebarDropdown items={item.children} />
          </div>
        )}
      </li>
    </>
  );
};

export default SidebarItem;
