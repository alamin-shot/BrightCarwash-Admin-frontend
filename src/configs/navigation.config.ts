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
        ]
      },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { id: "teams", label: "Teams", icon: "staffs", href: "/teams" },
      { id: "website-cms", label: "Website CMS", icon: "website-cms", href: "/website-cms" },
      { id: "reports", label: "Reports", icon: "reports", href: "/reports" },
      { id: "activity-log", label: "Activity Log", icon: "activity-log", href: "/activity-log" },
      { id: "settings", label: "Settings", icon: "settings", href: "/settings" },
    ],
  },
];