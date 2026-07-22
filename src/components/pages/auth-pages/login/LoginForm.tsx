"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();
    e.stopPropagation();


    setError(null);


    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await login({ email, password });

      if (!success) {
        setPassword("");
        setError("Invalid email or password");
      }
    } catch (err) {

      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 sm:gap-6 w-full"
      noValidate
    >
      {/* ✅ Show error message if any */}
      {error && (
        <div className="w-full p-3 bg-[#FF4345]/20 border border-[#FF4345] rounded-lg text-[#FF4345] font-inter text-sm text-center">
          {error}
        </div>
      )}

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
          disabled={isSubmitting}
          className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/[0.12] border border-white/20 rounded-lg text-white placeholder-[#777980] font-inter text-sm outline-none focus:border-[#0098E8] focus:ring-1 focus:ring-[#0098E8] transition-all disabled:opacity-50"
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
          disabled={isSubmitting}
          className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/[0.12] border border-white/20 rounded-lg text-white placeholder-[#777980] font-inter text-sm outline-none focus:border-[#0098E8] focus:ring-1 focus:ring-[#0098E8] transition-all disabled:opacity-50"
        />
      </div>

      {/* Remember me + Forgot password */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isSubmitting}
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-white/30 bg-white/10 accent-[#0098E8] cursor-pointer disabled:opacity-50"
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
        disabled={isSubmitting}
        className="w-full py-3 sm:py-4 px-4 sm:px-5 justify-center items-center gap-2 rounded-xl bg-[#0098E8] text-white font-inter text-sm sm:text-base font-medium hover:bg-[#0088D8] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Login
      </Button>
    </form>
  );
}