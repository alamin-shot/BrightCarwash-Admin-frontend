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
          className="hidden max-lg:block fixed inset-0 bg-black/50 z-40 adm-sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-[250px] min-w-[250px] h-screen sticky top-0 flex flex-col py-6 pl-6 pr-4 border-r border-[#ECEFF3] bg-[#0B1220] z-50 transition-transform duration-300 max-lg:fixed max-lg:left-0 max-lg:top-0 ${
          isOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col justify-between items-start flex-1">
          <div className="flex flex-col items-start gap-8 w-full">
            {!logoError ? (
  <div className="flex justify-center items-center w-full">
    <Image
      src="/images/logo.png"
      alt="Logo"
      width={64}
      height={72}
      priority
      className="object-contain"
      onError={() => setLogoError(true)}
    />
  </div>
) : (
  <div className="flex justify-center items-center w-16 h-[72px] mx-auto text-white font-inter text-lg font-bold tracking-[2px]">
    CW
  </div>
)}

            <nav className="flex flex-col items-start gap-5 self-stretch">
              {NAVIGATION_CONFIG.map((section) => (
                <div key={section.title} className="flex flex-col items-start gap-3 self-stretch">
                  <span className="text-[#777980] font-geist text-xs font-medium leading-[140%] tracking-[0.06px] uppercase">
                    {section.title}
                  </span>
                  <div className="flex flex-col items-start gap-1 self-stretch">
                    {section.items.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={onClose}
                        className={`flex py-[14px] px-4 items-center gap-3 self-stretch rounded-lg font-inter text-base font-normal leading-[124%] tracking-[0.08px] no-underline transition-colors duration-200 cursor-pointer ${
                          isActive(item.href)
                            ? "bg-[#B23730] text-white"
                            : "text-white/80 hover:bg-white/5"
                        }`}
                      >
                        <Icon
                          name={item.icon}
                          width={20}
                          height={20}
                          className={isActive(item.href) ? "opacity-100" : "opacity-80"}
                        />
                        <span>{item.label}</span>
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
            className="flex py-[14px] px-4 items-center gap-3 self-stretch rounded-lg bg-[#FFE6E6] border-none text-[#FF4345] font-inter text-base font-normal leading-[124%] tracking-[0.08px] cursor-pointer mt-auto"
          >
            <Icon name="logout" width={20} height={20} />
            <span>Log out</span>
          </Button>
        </div>
      </aside>
    </>
  );
}