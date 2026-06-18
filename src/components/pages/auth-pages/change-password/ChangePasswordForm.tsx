"use client";

import { useState } from "react";
import { changePassword } from "@/services/auth.service";
import { Button } from "@/components/ui/Button";
import { toast } from "react-toastify";

export function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await changePassword({ old_password: oldPassword, new_password: newPassword });
      toast.success(response.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Change password failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md">
      <div>
        <label htmlFor="oldPassword" className="block text-sm font-medium text-[#1B1B1B] mb-2">
          Current Password
        </label>
        <input
          id="oldPassword"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          placeholder="Enter current password"
          className="w-full px-4 py-4 border border-[#DFE1E7] rounded-lg text-[#1B1B1B] placeholder-[#777980] font-inter text-sm outline-none focus:border-[#0098E8] focus:ring-1 focus:ring-[#0098E8] transition-all"
        />
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-[#1B1B1B] mb-2">
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          placeholder="Min 8 characters"
          className="w-full px-4 py-4 border border-[#DFE1E7] rounded-lg text-[#1B1B1B] placeholder-[#777980] font-inter text-sm outline-none focus:border-[#0098E8] focus:ring-1 focus:ring-[#0098E8] transition-all"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1B1B1B] mb-2">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Re-enter new password"
          className="w-full px-4 py-4 border border-[#DFE1E7] rounded-lg text-[#1B1B1B] placeholder-[#777980] font-inter text-sm outline-none focus:border-[#0098E8] focus:ring-1 focus:ring-[#0098E8] transition-all"
        />
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        loadingText="Changing..."
        className="w-full py-4 px-5 justify-center items-center gap-2 rounded-xl bg-[#0098E8] text-white font-inter text-base font-medium hover:bg-[#0088D8] transition-all"
      >
        Change Password
      </Button>
    </form>
  );
}