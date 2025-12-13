"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import DashboardCard from "@/components/dashboard/DashboardCard";
import JoinMeetingForm from "@/components/dashboard/JoinMeetingForm";
import ScheduleMeetingCard from "@/components/dashboard/ScheduleMeetingCard";
import CalendarCard from "@/components/dashboard/CalendarCard";
import InvitationCard from "@/components/dashboard/InvitationCard";
import InsightsCard from "@/components/dashboard/InsightsCard";
import AgendaCard from "@/components/dashboard/AgendaCard";

import { v4 as uuidv4 } from "uuid";
import { useEffect, useState, useCallback } from "react";
import { DashboardResponse, isApiError } from "@/lib/api/api.types";
import api from "@/lib/api/api";

export default function DashboardClient() {
    const user = useUserStore((s) => s.user);
    const router = useRouter();

    const [data, setData] = useState<DashboardResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    // ✅ Centralized Fetch Function (Reusable by Cards)
    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        setErrorMsg("");

        try {
            const res = await api.get<DashboardResponse>("/dashboard");
            setData(res.data);

        } catch (err: unknown) {
            if (isApiError(err)) {
                if (err.status === 401) {
                    setErrorMsg("Session expired. Please login again.");
                } else {
                    setErrorMsg(err.message);
                }
            } else {
                setErrorMsg("Unexpected error");
            }
        } finally {
            setLoading(false);
            //setErrorMsg("ok, testing")
        }
    }, []);

    // ✅ Initial Fetch
    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    // ✅ While checking session → don't render Dashboard
    if (!user) return null;

    function joinOrCreateMeeting(roomId?: string) {
        const id = roomId || uuidv4();
        if (roomId) {
            router.push(`/meeting?roomId=${id}`);
        } else {
            router.replace(`/meeting?roomId=${id}`);
        }
    }

    return (
        <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            style={{
                background: "transparent",
                color: "var(--color-foreground)",
            }}
        >
            {/* ✅ Agenda spans 2 columns */}
            <div className="lg:col-span-2 order-1">
                <AgendaCard
                    user={user}
                    isLoading={loading}
                    agenda={data?.agenda.data}
                    error={errorMsg}
                    onRefresh={fetchDashboard}     // ✅ refresh hook
                />
            </div>

            {/* ✅ Action Cards */}
            <div className="flex flex-col gap-4 order-2">
                <DashboardCard
                    onStartMeeting={joinOrCreateMeeting}
                    //onRefresh={fetchDashboard}     // ✅ refresh hook
                />

                <JoinMeetingForm
                    onJoinMeeting={joinOrCreateMeeting}
                    //onRefresh={fetchDashboard}     // ✅ optional
                />

                <ScheduleMeetingCard
                    //onRefresh={fetchDashboard}     // ✅ optional
                />
            </div>

            {/* ✅ Bottom Row */}
            <div className="order-3">
                <CalendarCard />
            </div>

            <div className="order-4">
                <InvitationCard
                    invitations={data?.invitation.data}
                    isLoading={loading}
                    // onRefresh={fetchDashboard}     // ✅ refresh hook
                />
            </div>

            <div className="order-5">
                <InsightsCard
                    //isLoading={loading}
                    //onRefresh={fetchDashboard}
                />
            </div>
        </div>
    );
}
