import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "@/types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      { href: "/dashboard/billing", icon: "billing", title: "Billing" },
      // {
      //   href: "/dashboard/charts",
      //   icon: "lineChart",
      //   title: "Charts",
      //   disabled: true,
      // },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      { href: "/dashboard/settings", icon: "settings", title: "Settings" },
      { href: "/", icon: "home", title: "Homepage" },
      {
        href: "mailto:support@headshots.fun",
        icon: "mail",
        title: "Mail Support",
        target: "_blank",
        authorizeOnly: UserRole.USER,
      },
    ],
  },
  {
    title: "ADMIN",
    authorizeOnly: UserRole.ADMIN,
    items: [
      {
        authorizeOnly: UserRole.ADMIN,
        href: "/admin",
        icon: "laptop",
        title: "Admin Panel",
      },
      {
        authorizeOnly: UserRole.ADMIN,
        href: "/admin/users",
        icon: "user",
        title: "Users",
      },
      {
        authorizeOnly: UserRole.ADMIN,
        href: "/admin/studios",
        icon: "sliders",
        title: "Studios",
      },
      {
        authorizeOnly: UserRole.ADMIN,
        href: "/admin/predictions",
        icon: "image",
        title: "Predictions",
      },
      {
        authorizeOnly: UserRole.ADMIN,
        href: "/admin/orders",
        icon: "package",
        title: "Orders",
      },
    ],
  },
];
