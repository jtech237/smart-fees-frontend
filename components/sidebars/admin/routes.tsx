import {LayoutDashboard, School} from "lucide-react"

export type Routes = typeof routes
export type RouteItem = typeof routes.menu[number] & {
  children?: SubRouteItem[]
}
export type SubRouteItem = Pick<RouteItem, "label" | "route">
export type RouteGroup = RouteItem[]

export const routes = {
  menu: [
    {
      label: "Dashboard",
      route: "/admin",
      icon: <LayoutDashboard/>
    },
    {
      label: "Gestion des classes",
      route: "/admin/manage/classes",
      icon: <School/>
    }
  ]
}

