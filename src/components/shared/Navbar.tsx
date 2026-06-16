"use client";

import { useState } from "react";
import { useAppSelector } from "@/lib/store";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import type { NavbarProps } from "@/types/navigation";

export function Navbar({ onMenuClick }: NavbarProps) {
  const user = useAppSelector((state) => state.auth.user);
  const [avatarError, setAvatarError] = useState(false);

  return (
    <header className="flex w-full h-[72px] px-6 py-5 justify-between items-center border-b border-[#DFE1E7] bg-white sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="icon"
          onClick={onMenuClick}
          className="flex p-2 items-center rounded-lg border border-[#E8E8E9] bg-white cursor-pointer lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Icon name="menu" width={24} height={24} />
        </Button>
        <h1 className="text-[#1B1B1B] font-inter text-2xl font-medium leading-[150%] tracking-[-0.36px] m-0">
          Welcome back, {user?.name || "User"}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="icon" className="flex p-2 items-center rounded-lg border border-[#E8E8E9] bg-white cursor-pointer" aria-label="Search">
          <Icon name="search" width={24} height={24} />
        </Button>

        <Button variant="icon" className="flex p-2 items-center rounded-lg border border-[#E8E8E9] bg-white cursor-pointer" aria-label="Notifications">
          <Icon name="bell" width={24} height={24} />
        </Button>

        <div className="flex py-[6px] px-[6px] items-center gap-4 rounded-lg border border-[#E8E8E9] bg-white">
          <div className="flex w-[117px] items-center gap-2 max-sm:w-auto">
            <div className="rounded-full overflow-hidden w-9 h-9">
              {!avatarError ? (
                <Image
                  src="/images/avatar-placeholder.png"
                  alt="User avatar"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#B23730] text-white flex items-center justify-center font-inter text-sm font-medium">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <span className="flex-1 text-[#1F274B] font-inter text-xs font-normal leading-[100%] max-sm:hidden">
              {user?.name || "User"}
            </span>
          </div>
          
        </div>
      </div>
    </header>
  );
}