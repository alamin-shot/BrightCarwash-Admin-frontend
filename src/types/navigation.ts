import type { ComponentType } from "react";

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  subItems?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];

}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface NavbarProps {
  onMenuClick: () => void;
}



export interface ReadAllNotificationInterface {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  count: number
}