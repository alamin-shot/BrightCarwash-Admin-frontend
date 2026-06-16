"use client";

import { useState } from "react";
import { useChangePasswordMutation } from "@/services/auth.api";
import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";
import { toast } from "react-toastify";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePassword, { isLoading: isSubmitting }] = useChangePasswordMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await changePassword({ currentPassword, newPassword }).unwrap();
      toast.success(response.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Change password failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        id="currentPassword"
        label="Current Password"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
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
        label="Confirm New Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <Button type="submit" isLoading={isSubmitting} loadingText="Changing...">
        Change Password
      </Button>
    </form>
  );
}