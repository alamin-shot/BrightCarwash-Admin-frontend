"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, password });
    } catch {
      // Toast handled in useAuth
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6 w-full">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-[#E9E9EA] mb-1.5 sm:mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
          className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/[0.12] border border-white/20 rounded-lg text-white placeholder-[#777980] font-inter text-sm outline-none focus:border-[#0098E8] focus:ring-1 focus:ring-[#0098E8] transition-all"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-[#E9E9EA] mb-1.5 sm:mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
          className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/[0.12] border border-white/20 rounded-lg text-white placeholder-[#777980] font-inter text-sm outline-none focus:border-[#0098E8] focus:ring-1 focus:ring-[#0098E8] transition-all"
        />
      </div>

      {/* Remember me + Forgot password */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-white/30 bg-white/10 accent-[#0098E8] cursor-pointer"
          />
          <span className="text-[#E9E9EA] font-inter text-xs sm:text-sm">Remember me</span>
        </label>
        <Link
          href="/forgot-password"
          className="text-[#B23730] font-inter text-xs sm:text-sm font-medium underline underline-offset-[4px] decoration-[1.68px] hover:text-[#D14540] transition-colors"
        >
          Forget password?
        </Link>
      </div>

      {/* Login button */}
      <Button
        type="submit"
        isLoading={isSubmitting}
        loadingText="Logging in..."
        className="w-full py-3 sm:py-4 px-4 sm:px-5 justify-center items-center gap-2 rounded-xl bg-[#0098E8] text-white font-inter text-sm sm:text-base font-medium hover:bg-[#0088D8] transition-all"
      >
        Login
      </Button>
    </form>
  );
}