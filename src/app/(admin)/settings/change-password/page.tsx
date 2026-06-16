import { AuthFormWrapper } from "@/components/ui/AuthFormWrapper";
import { ChangePasswordForm } from "@/components/pages/auth-pages/change-password/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <AuthFormWrapper title="Change Password">
      <ChangePasswordForm />
    </AuthFormWrapper>
  );
}