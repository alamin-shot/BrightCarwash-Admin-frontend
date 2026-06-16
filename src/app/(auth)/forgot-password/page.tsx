import { AuthFormWrapper } from "@/components/ui/AuthFormWrapper";
import { ForgotPasswordForm } from "@/components/pages/auth-pages/forgot-password/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthFormWrapper
      title="Forgot Password"
      footer={<a href="/login" className="text-blue-600 hover:underline">Back to login</a>}
    >
      <ForgotPasswordForm />
    </AuthFormWrapper>
  );
}