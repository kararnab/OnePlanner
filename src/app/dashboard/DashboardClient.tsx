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
import { DashboardResponse } from "@/lib/api/api.types";
import { useApiGet } from "@/lib/hooks/useApiGet";

export default function DashboardClient() {
    const user = useUserStore((s) => s.user);
    const router = useRouter();

    const { data, loading, error, errorStatus, retry } = useApiGet<DashboardResponse>("/dashboard");

    // While checking session → don't render Dashboard
    if (!user) return null;

    function joinOrCreateMeeting(roomId?: string) {
        const id = roomId || uuidv4();
        // Route through the pre-join preview screen instead of the call directly.
        router.push(`/meeting/preview?roomId=${id}`);
    }

    const displayError = errorStatus === 401 ? "Session expired. Please login again." : error;

    return (
        <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            style={{
                background: "transparent",
                color: "var(--color-foreground)",
            }}
        >
            {/* Agenda spans 2 columns */}
            <div className="lg:col-span-2 order-1">
                <AgendaCard
                    user={user}
                    isLoading={loading}
                    agenda={data?.agenda.data}
                    error={displayError}
                    onRefresh={retry}
                />
            </div>

            {/* Action Cards */}
            <div className="flex flex-col gap-4 order-2">
                <DashboardCard onStartMeeting={joinOrCreateMeeting} />
                <JoinMeetingForm onJoinMeeting={joinOrCreateMeeting} />
                <ScheduleMeetingCard />
            </div>

            {/* Bottom Row */}
            <div className="order-3">
                <CalendarCard />
            </div>

            <div className="order-4">
                <InvitationCard invitations={data?.invitation.data} isLoading={loading} />
            </div>

            <div className="order-5">
                <InsightsCard />
            </div>
        </div>
    );
}
