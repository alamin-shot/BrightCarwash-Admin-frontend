"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, password });
    } catch {
      // Toast already handled in useAuth
    } finally {
      setIsSubmitting(false);
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
      <FormInput
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="Password123!"
      />
      <Button type="submit" isLoading={isSubmitting} loadingText="Logging in...">
        Login
      </Button>
    </form>
  );
}