"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";

export default function Home() {
    const router = useRouter();
    const store = useUserStore();
    const user = store.user;

    useEffect(() => {
        // Only run this AFTER hydration (i.e., in useEffect)
        if (user) router.replace("/dashboard");
        else router.replace("/login");
    }, [user, router]);

    return null;
}