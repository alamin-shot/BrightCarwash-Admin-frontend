"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVerifyOtpMutation } from "@/services/auth.api";
import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";
import { toast } from "react-toastify";

export function VerifyOtpForm() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [verifyOtp, { isLoading: isSubmitting }] = useVerifyOtpMutation();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (!storedEmail) {
      router.push("/forgot-password");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    try {
      await verifyOtp({ email, otp }).unwrap();
      toast.success("OTP verified");
      sessionStorage.setItem("verifiedOtp", otp);
      router.push("/reset-password");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid OTP");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        id="otp"
        label="OTP Code"
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        required
        maxLength={6}
        className="text-center text-2xl tracking-widest"
        placeholder="123456"
      />
      <Button type="submit" isLoading={isSubmitting} loadingText="Verifying..." disabled={otp.length !== 6}>
        Verify OTP
      </Button>
    </form>
  );
}