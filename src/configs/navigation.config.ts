import type { NavSection } from "@/types/navigation";

export const NAVIGATION_CONFIG: NavSection[] = [
  {
    title: "MENU",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "/dashboard" },
      { id: "leads", label: "Leads", icon: "leads", href: "/leads" },
      { id: "payments", label: "Payments", icon: "payments", href: "/payments" },
      {
        id: "marketing",
        label: "Marketing",
        icon: "campaigns",
        href: "/marketing/campaigns",
        subItems: [
          { id: "marketing-campaigns", label: "Campaigns", icon: "campaigns", href: "/marketing/campaigns" },
          { id: "marketing-email-list", label: "Email List", icon: "list", href: "/marketing/email-list" },
          { id: "marketing-lead-groups", label: "Lead Groups", icon: "staffs", href: "/marketing/lead-groups" },
          { id: "marketing-queries", label: "Queries", icon: "staffs", href: "/marketing/queries" },
        ]
      },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { id: "teams", label: "Teams", icon: "staffs", href: "/teams" },
      {
        id: "website-cms",
        label: "Website CMS",
        icon: "website-cms",
        href: "",
        subItems: [
          { id: "cms-hero-section", label: "Hero Section", icon: "hero", href: "/website-cms/hero-section" },
          { id: "cms-testimonials", label: "Testimonials", icon: "testimonials", href: "/website-cms/testimonials" },
          { id: "cms-news-blog", label: "News & Blog", icon: "news", href: "/website-cms/news-blog" },
          { id: "cms-gallery", label: "Gallery", icon: "gallery", href: "/website-cms/gallery" },
          { id: "cms-faq", label: "FAQ", icon: "faq", href: "/website-cms/faq" },
        ]
      },
      { id: "reports", label: "Reports", icon: "reports", href: "/reports" },
      { id: "activity-log", label: "Activity Log", icon: "activity-log", href: "/activity-log" },
      { id: "ai-chatbox", label: "AI Chatbox", icon: "bot", href: "/ai-chatbox" },
      { id: "settings", label: "Settings", icon: "settings", href: "/settings" },
    ],
  },
];