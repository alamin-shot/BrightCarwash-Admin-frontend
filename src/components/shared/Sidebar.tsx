"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { NAVIGATION_CONFIG } from "@/configs/navigation.config";
import { useAuth } from "@/hooks/useAuth";
import type { SidebarProps } from "@/types/navigation";

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [logoError, setLogoError] = useState(false);

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden adm-sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-[250px] h-screen fixed top-0 left-0 flex flex-col py-4 sm:py-6 pl-4 sm:pl-6 pr-3 sm:pr-4 border-r border-[#ECEFF3] bg-[#0B1220] z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col justify-between items-start flex-1 overflow-y-auto">
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
                    {section.items.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={onClose}
                        className={`flex py-2.5 sm:py-[14px] px-3 sm:px-4 items-center gap-2 sm:gap-3 self-stretch rounded-lg font-inter text-sm sm:text-base font-normal leading-[124%] tracking-[0.08px] no-underline transition-colors duration-200 cursor-pointer ${
                          isActive(item.href)
                            ? "bg-[#B23730] text-white"
                            : "text-white/80 hover:bg-white/5"
                        }`}
                      >
                        <Icon
                          name={item.icon}
                          width={18}
                          height={18}
                          className={`sm:w-5 sm:h-5 ${isActive(item.href) ? "opacity-100" : "opacity-80"}`}
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    ))}
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