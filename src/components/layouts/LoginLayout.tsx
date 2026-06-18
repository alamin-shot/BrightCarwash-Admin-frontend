import { AuthLayout } from "@/components/layouts/AuthLayout";
import { LoginForm } from "@/components/pages/auth-pages/login/LoginForm";

export function LoginLayout() {
  return (
    <AuthLayout
      title="Hi, welcome back again!"
      subtitle="Login with your email and password that you have been created before, or you can create account if you don't have Asanah account."
    >
      <LoginForm />
    </AuthLayout>
  );
}