import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "@/types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "menu",
    items: [
      { href: "/dashboard", icon: "dashboard", title: "dashboard" },
      { href: "/dashboard/billing", icon: "billing", title: "billing" },
    ],
  },
  {
    title: "options",
    items: [
      { href: "/dashboard/settings", icon: "settings", title: "settings" },
      { href: "/", icon: "home", title: "homepage" },
      {
        href: "mailto:support@headshots.fun",
        icon: "mail",
        title: "mail_support",
        target: "_blank",
        authorizeOnly: UserRole.USER,
      },
    ],
  },
  {
    title: "admin",
    authorizeOnly: UserRole.ADMIN,
    items: [
      {
        href: "/admin",
        icon: "laptop",
        title: "admin_panel",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/users",
        icon: "user",
        title: "users",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/studios",
        icon: "sliders",
        title: "studios",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/predictions",
        icon: "image",
        title: "predictions",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/orders",
        icon: "package",
        title: "orders",
        authorizeOnly: UserRole.ADMIN,
      },
    ],
  },
];
