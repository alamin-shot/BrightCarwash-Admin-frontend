import { AuthLayout } from "@/components/layouts/AuthLayout";
import { ForgotPasswordForm } from "@/components/pages/auth-pages/forgot-password/ForgotPasswordForm";

export function ForgotPasswordLayout() {
  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email address and we'll send you a one-time password to reset your password."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}