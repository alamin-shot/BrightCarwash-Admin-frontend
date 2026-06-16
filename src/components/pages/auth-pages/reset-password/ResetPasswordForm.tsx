"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/services/auth.api";
import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";
import { toast } from "react-toastify";

export function ResetPasswordForm() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetPassword, { isLoading: isSubmitting }] = useResetPasswordMutation();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetEmail");
    const storedOtp = sessionStorage.getItem("verifiedOtp");
    if (!storedEmail || !storedOtp) {
      router.push("/forgot-password");
      return;
    }
    setEmail(storedEmail);
    setOtp(storedOtp);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword({ email, otp, newPassword }).unwrap();
      toast.success("Password reset successfully");
      sessionStorage.removeItem("resetEmail");
      sessionStorage.removeItem("verifiedOtp");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Reset failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        id="newPassword"
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        minLength={8}
        placeholder="Min 8 characters"
      />
      <FormInput
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <Button type="submit" isLoading={isSubmitting} loadingText="Resetting...">
        Reset Password
      </Button>
    </form>
  );
}