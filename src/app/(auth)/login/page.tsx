import { AuthFormWrapper } from "@/components/ui/AuthFormWrapper";
import { LoginForm } from "@/components/pages/auth-pages/login/LoginForm";

export default function LoginPage() {
  return (
    <AuthFormWrapper
      title="Login"
      footer={<a href="/forgot-password" className="text-blue-600 hover:underline">Forgot password?</a>}
    >
      <LoginForm />
    </AuthFormWrapper>
  );
}