

import Image from "next/image";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { LoginFooter } from "@/components/pages/auth-pages/login/LoginFooter";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1220]">
      {/* Left panel */}
      <div className="flex w-full lg:max-w-[650px] flex-col items-start self-stretch overflow-y-auto">
        {/* Header */}
        <div className="flex px-4 sm:px-6 lg:px-8 py-3 sm:py-4 justify-between items-center self-stretch">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={40}
            height={48}
            className="object-contain sm:w-[50px] sm:h-[57px] lg:w-[57px] lg:h-[64px]"
          />
          <LanguageSelector />
        </div>

        {/* Main content */}
        <div className="flex px-5 sm:px-8 lg:px-10 py-10 sm:py-14 lg:py-20 flex-col justify-center items-center gap-6 sm:gap-8 flex-1 self-stretch">
          <div className="flex flex-col gap-2 self-stretch">
            <h1 className="text-white font-inter text-2xl sm:text-[28px] lg:text-[32px] font-semibold leading-[130%]">
              {title}
            </h1>
            <p className="text-[#E9E9EA] font-inter text-xs sm:text-sm font-normal leading-[160%]">
              {subtitle}
            </p>
          </div>
          {children}
        </div>

        {/* Footer */}
        <LoginFooter />
      </div>

      {/* Right panel */}
      <div className="flex-1 relative hidden lg:block bg-white border-t-[50px] border-l-[50px] border-white">
        <div className="relative w-full h-full overflow-hidden rounded-tl-[20px] ">
          <Image
            src="/images/dashboard.png"
            alt="Dashboard preview"
            fill
            priority
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#e3e4e6]/90 via-[#0B1220]/40 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#0B1220]/30 to-transparent" />
        </div>
      </div>
    </div>
  );
}