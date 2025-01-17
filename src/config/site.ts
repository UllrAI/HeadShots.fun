import { SidebarNavItem, SiteConfig } from "@/types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  title: "Fun & Pro AI Headshots Generator | HeadShots.fun",
  name: "HeadShots.fun",
  description:
    "Create stunning fun and professional headshots with AI at HeadShots.fun. Fast, affordable, and personalized AI-powered headshot generator. Perfect for LinkedIn, resumes, and social media.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://twitter.com/ullr_ai",
    github: "https://github.com/ullrai/HeadShots.fun",
  },
  mailSupport: "support@headshots.fun",
  structuredData: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "HeadShots.fun",
    "url": site_url,
    "description": "Create stunning fun and professional headshots with AI at HeadShots.fun. Fast, affordable, and personalized AI-powered headshot generator. Perfect for LinkedIn, resumes, and social media.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${site_url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  },
  keywords: [
      "Headshots"
  ],
  authors: [
    {
      name: "UllrAI",
    },
  ],
  creator: "UllrAI",
  twitterCreator: "@UllrAI",
  icons: "/favicon.ico",
  manifest: `${site_url}/site.webmanifest`,
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "/about" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Ullr AI Products",
    items: [
      { title: "PixMiller", href: "https://pixmiller.com" },
      { title: "HeadShots fun", href: "https://headshot.cv" },
      { title: "Ullr AI Lab", href: "https://ullrai.com" },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Pricing", href: "/pricing" },
      { title: "Styles", href: "/generator-styles" },
      { title: "Blog", href: "/blog" },
    ],
  },
];
