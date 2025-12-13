"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginClient() {
    const user = useUserStore((s) => s.user);
    const router = useRouter();

    useEffect(() => {
        // If user has accessToken or refreshToken, redirect to dashboard
        if (user?.accessToken || user?.refreshToken) {
            router.replace("/dashboard");
        }
    }, [user, router]);

    return <LoginForm />;
}
