import { Suspense } from "react";
import { SetPasswordLayout } from "@/components/layouts/SetPasswordLayout";

export default function SetPasswordPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center text-white">Loading...</div>}>
            <SetPasswordLayout />
        </Suspense>
    );
}