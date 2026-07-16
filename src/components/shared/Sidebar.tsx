"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { ChevronDown } from "lucide-react";
import { NAVIGATION_CONFIG } from "@/configs/navigation.config";
import { useAuth } from "@/hooks/useAuth";
import type { SidebarProps, NavItem } from "@/types/navigation";

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [logoError, setLogoError] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    const activeIds = new Set<string>();
    NAVIGATION_CONFIG.forEach((section) => {
      section.items.forEach((item) => {
        if (item.subItems?.some((sub) => pathname.startsWith(sub.href))) {
          activeIds.add(item.id);
        }
      });
    });
    return activeIds;
  });

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  function isSubItemActive(subItems: NavItem[] | undefined): boolean {
    if (!subItems) return false;
    return subItems.some((item) => pathname.startsWith(item.href));
  }

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden adm-sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-[250px] h-screen fixed top-0 left-0 flex flex-col py-4 sm:py-6 pl-4 sm:pl-6 pr-3 sm:pr-4 border-r border-[#ECEFF3] bg-[#0B1220] z-50 transition-transform duration-300 overflow-y-auto adm-sidebar-scroll ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="flex h-full flex-col justify-between items-start flex-1">
          <div className="flex flex-col items-start gap-6 sm:gap-8 w-full">
            {!logoError ? (
              <div className="flex justify-center items-center w-full">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={64}
                  height={72}
                  priority
                  className="object-contain w-12 h-14 sm:w-16 sm:h-[72px]"
                  onError={() => setLogoError(true)}
                />
              </div>
            ) : (
              <div className="flex justify-center items-center w-full text-white font-inter text-base sm:text-lg font-bold tracking-[2px] py-2">
                CW
              </div>
            )}

            <nav className="flex flex-col items-start gap-4 sm:gap-5 self-stretch">
              {NAVIGATION_CONFIG.map((section) => (
                <div key={section.title} className="flex flex-col items-start gap-2 sm:gap-3 self-stretch">
                  <span className="text-[#777980] font-geist text-[10px] sm:text-xs font-medium leading-[140%] tracking-[0.06px] uppercase px-1">
                    {section.title}
                  </span>
                  <div className="flex flex-col items-start gap-0.5 sm:gap-1 self-stretch">
                    {section.items.map((item) => {
                      const hasSubItems = item.subItems && item.subItems.length > 0;
                      const isParentActive = isActive(item.href) || (hasSubItems && isSubItemActive(item.subItems));
                      const isExpanded = expandedItems.has(item.id);

                      return (
                        <div key={item.id} className="flex flex-col items-start gap-0.5 sm:gap-1 self-stretch">
                          {/* Parent Item */}
                          <div className="flex items-center gap-0 w-full">
                            <Link
                              href={item.href}
                              onClick={onClose}
                              className={`flex-1 flex py-2.5 sm:py-[14px] px-3 sm:px-4 items-center gap-2 sm:gap-3 rounded-lg font-inter text-sm sm:text-base font-normal leading-[124%] tracking-[0.08px] no-underline transition-colors duration-200 cursor-pointer ${isParentActive
                                ? "bg-[#B23730] text-white"
                                : "text-white/80 hover:bg-white/5"
                                }`}
                            >
                              <Icon
                                name={item.icon}
                                width={18}
                                height={18}
                                className={`sm:w-5 sm:h-5 ${isParentActive ? "opacity-100" : "opacity-80"}`}
                              />
                              <span className="truncate">{item.label}</span>
                            </Link>
                            {hasSubItems && (
                              <button
                                onClick={() => toggleExpand(item.id)}
                                className={`flex items-center justify-center w-8 h-8 rounded-lg text-white/60 hover:text-white transition-transform ${isExpanded ? "rotate-180" : ""
                                  }`}
                              >
                                <ChevronDown size={16} />
                              </button>
                            )}
                          </div>

                          {/* Sub-items with L-shaped branch lines and icons */}
                          {hasSubItems && isExpanded && (
                            <div className="flex flex-col items-start gap-0 self-stretch pl-6 sm:pl-8">
                              {item.subItems?.map((subItem, index) => {
                                const isSubActive = pathname.startsWith(subItem.href);
                                const isLast = index === (item.subItems?.length || 0) - 1;
                                const isFirst = index === 0;

                                // Determine which L-shape icon to use
                                let iconName = "l-shape-middle";
                                let iconClass = "flex-shrink-0";

                                if (isFirst) {
                                  iconName = "l-shape-first";
                                  iconClass = "flex-shrink-0 mt-2";
                                } else if (isLast) {
                                  iconName = "l-shape-last";
                                  iconClass = "flex-shrink-0";
                                }

                                return (
                                  <div key={subItem.id} className="flex flex-col items-start self-stretch">
                                    <Link
                                      href={subItem.href}
                                      onClick={onClose}
                                      className={`flex py-2.5 px-3 items-center gap-3 self-stretch rounded-lg font-inter text-sm font-normal leading-[124%] tracking-[0.08px] no-underline transition-colors duration-200 cursor-pointer ${isSubActive
                                        ? "bg-[#B23730] text-white"
                                        : "text-white/80 hover:bg-white/5"
                                        }`}
                                    >
                                      {/* L-shaped branch line */}
                                      <Icon
                                        name={iconName}
                                        width={24}
                                        height={32}
                                        className={iconClass}
                                        color="white"

                                      />
                                      {/* Sub-item icon */}
                                      <Icon
                                        name={subItem.icon}
                                        width={18}
                                        height={18}
                                        className="flex-shrink-0"
                                        color="white"

                                      />
                                      <span className="truncate">{subItem.label}</span>
                                    </Link>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          <Button
            variant="sidebar"
            onClick={logout}
            className="flex py-2.5 sm:py-[14px] px-3 sm:px-4 items-center gap-2 sm:gap-3 self-stretch rounded-lg bg-[#FFE6E6] border-none text-[#FF4345] font-inter text-sm sm:text-base font-normal leading-[124%] tracking-[0.08px] cursor-pointer mt-4 shrink-0"
          >
            <Icon name="logout" width={18} height={18} className="sm:w-5 sm:h-5" />
            <span>Log out</span>
          </Button>
        </div>
      </aside>
    </>
  );
}