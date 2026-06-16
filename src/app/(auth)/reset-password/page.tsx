import { AuthFormWrapper } from "@/components/ui/AuthFormWrapper";
import { ResetPasswordForm } from "@/components/pages/auth-pages/reset-password/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthFormWrapper
      title="Reset Password"
      footer={<a href="/login" className="text-blue-600 hover:underline">Back to login</a>}
    >
      <ResetPasswordForm />
    </AuthFormWrapper>
  );
}