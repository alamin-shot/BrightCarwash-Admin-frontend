import { AuthFormWrapper } from "@/components/ui/AuthFormWrapper";
import { VerifyOtpForm } from "@/components/pages/auth-pages/verify-otp/VerifyOtpForm";

export default function VerifyOtpPage() {
  return (
    <AuthFormWrapper
      title="Verify OTP"
      subtitle="Enter the 6-digit code sent to your email"
      footer={<a href="/login" className="text-blue-600 hover:underline">Back to login</a>}
    >
      <VerifyOtpForm />
    </AuthFormWrapper>
  );
}