import type { NavSection } from "@/types/navigation";

export const NAVIGATION_CONFIG: NavSection[] = [
  {
    title: "MENU",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "/dashboard" },
      { id: "leads", label: "Leads", icon: "leads", href: "/leads" },
      { id: "payments", label: "Payments", icon: "payments", href: "/payments" },
      { id: "campaigns", label: "Campaigns", icon: "campaigns", href: "/campaigns" },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { id: "staffs", label: "Staffs", icon: "staffs", href: "/staffs" },
      { id: "website-cms", label: "Website CMS", icon: "website-cms", href: "/website-cms" },
      { id: "reports", label: "Reports", icon: "reports", href: "/reports" },
      { id: "activity-log", label: "Activity Log", icon: "activity-log", href: "/activity-log" },
      { id: "settings", label: "Settings", icon: "settings", href: "/settings" },
    ],
  },
];