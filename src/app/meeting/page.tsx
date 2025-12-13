"use client";

import { useUserStore } from "@/lib/store/userStore";
import { useRouter, useSearchParams } from "next/navigation";
import {Suspense, useEffect} from "react";
import MeetingClient from "./MeetingClient";

export default function MeetingPage() {
    const user = useUserStore((s) => s.user);
    const router = useRouter();
    const params = useSearchParams();
    const roomId = params.get("roomId") ?? "unknown";

    useEffect(() => {
        if (!user) {
            router.replace("/login");
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <Suspense fallback={<div className="w-screen h-screen bg-gray-50" />}>
            <MeetingClient roomId={roomId} />
        </Suspense>
    );
}