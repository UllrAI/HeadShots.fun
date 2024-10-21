import { User } from "@prisma/client";
import type { Icon } from "lucide-react";

import { Icons } from "@/components/shared/icons";

export interface SiteConfig {
  title: string;
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mailSupport: string;
  keywords: string[];
  authors: {
    name: string;
  }[];
  twitterCreator: string;
  manifest: string;
  icons: string;
  creator: string;
  structuredData: {
    "@context": string;
    "@type": string;
    name: string;
    url: string;
    description: string;
    potentialAction: {
      "@type": string;
      target: string;
      "query-input": string;
    };
  };
  links: {
    twitter: string;
    github: string;
  };
};

export type NavItem = {
  title: string;
  href: string;
  badge?: number;
  disabled?: boolean;
  external?: boolean;
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
  target?: "_blank" | "_self";
};

export type MainNavItem = NavItem;

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

export type SidebarNavItem = {
  title: string;
  items: NavItem[];
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};