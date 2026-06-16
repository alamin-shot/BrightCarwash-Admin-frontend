"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/services/auth.api";
import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";
import { toast } from "react-toastify";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading: isSubmitting }] = useForgotPasswordMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await forgotPassword({ email }).unwrap();
      toast.success(response.message);
      sessionStorage.setItem("resetEmail", email);
      router.push("/verify-otp");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="admin@example.com"
      />
      <Button type="submit" isLoading={isSubmitting} loadingText="Sending...">
        Send OTP
      </Button>
    </form>
  );
}