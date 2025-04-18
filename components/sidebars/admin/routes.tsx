import { LayoutDashboard, ReceiptEuro, School, UsersRound } from 'lucide-react';

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
      label: "Établissement",
      route: "#",
      icon: <School/>,
      children: [
        {
          label: "Gestion des classes",
          route: "/admin/manage/classes"
        },
        {
          label: "Salles de classes",
          route: "/admin/manage/classrooms"
        }
      ]
    },
    {
      label: "Frais scolaires",
      route: "#",
      icon: <ReceiptEuro/>,
      children: [
        {label: "Frais de scolarités", route: "/admin/manage/fees"},
        {label: "Types de frais", route: "/admin/manage/fees/types"},
      ]
    },
    {
      label: "Etudiants",
      route: "#",
      icon: <UsersRound/>,
      children: [
        {
          label: "Liste des etudiants",
          route: "/admin/manage/students"
        }
      ]
    }
  ]
}

