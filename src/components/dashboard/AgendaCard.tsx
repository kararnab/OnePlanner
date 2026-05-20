"use client";

import type { User } from "@/lib/store/userStore";
import { t } from "@/lib/i18n";
import ErrorStateUI from "@/components/ui/ErrorStateUI";
import Avatar from "@/components/ui/Avatar";

export type AgendaItemData = {
    id: string;
    title: string;
    time: string;
};

type AgendaCardProps = {
    user: User;
    agenda?: AgendaItemData[];
    isLoading?: boolean;
    error?: string;
    onRefresh?: () => void;
};

export default function AgendaCard({
                                       user,
                                       agenda = [],
                                       isLoading = false,
                                       error,
                                       onRefresh,
                                   }: AgendaCardProps) {
    return (
        <div className="op-card p-6 w-full flex flex-col">
            <div className="flex flex-col items-center mb-4 shrink-0">
                <h2
                    className="text-center op-card-title"
                    style={{ fontSize: 18, letterSpacing: "-0.01em" }}
                >
                    {t("greeting", { name: user.name || t("userFallback") })}
                </h2>
                <div className="mt-3">
                    {/* Pass name/avatar through as-is: Avatar handles the
                        gradient-initials fallback and only reaches for the
                        remote placeholder when there's literally no name. */}
                    <Avatar name={user.name ?? ""} size={60} src={user.avatar ?? undefined} />
                </div>
            </div>

            <h3
                className="op-fg-2"
                style={{ fontSize: 13, fontWeight: 500, margin: "0 0 14px" }}
            >
                Agenda
            </h3>

            <div className="space-y-3 overflow-y-auto max-h-80 pr-2 scrollbar-thin">
                {isLoading && <AgendaSkeleton />}

                {!isLoading && error && (
                    <ErrorStateUI message={error} onRefresh={onRefresh} />
                )}

                {!isLoading && !error && agenda.length === 0 && <EmptyAgendaState />}

                {!isLoading &&
                    !error &&
                    agenda.map((item) => (
                        <AgendaItem key={item.id} title={item.title} time={item.time} />
                    ))}
            </div>
        </div>
    );
}

function AgendaItem({ title, time }: { title: string; time: string }) {
    return (
        <div className="flex justify-between items-center gap-3">
            <div className="min-w-0">
                <p
                    className="truncate"
                    style={{ fontWeight: 500, margin: 0, fontSize: 15, color: "var(--fg-1)", lineHeight: 1.3 }}
                >
                    {title}
                </p>
                <p
                    className="op-muted numeric"
                    style={{ fontSize: 13, margin: "2px 0 0" }}
                >
                    {time}
                </p>
            </div>

            <div className="flex gap-2 shrink-0">
                <button
                    style={{
                        border: "1px solid var(--color-primary)",
                        color: "var(--color-primary)",
                        background: "var(--color-primary-soft)",
                        fontSize: 12,
                        padding: "4px 12px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontWeight: 500,
                    }}
                >
                    Reschedule
                </button>

                <button
                    type="button"
                    style={{
                        border: "1px solid var(--color-border-strong)",
                        color: "var(--fg-2)",
                        background: "var(--surface)",
                        fontSize: 12,
                        padding: "4px 12px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontWeight: 500,
                    }}
                >
                    Change attendance
                </button>
            </div>
        </div>
    );
}

function EmptyAgendaState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="op-fg-2" style={{ fontSize: 14, fontWeight: 500 }}>
                No agenda for today 🎉
            </p>
            <p className="op-muted" style={{ fontSize: 12, marginTop: 4 }}>
                Enjoy your free time or create a new event.
            </p>
        </div>
    );
}

function AgendaSkeleton() {
    return (
        <>
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="flex justify-between items-center gap-3 animate-pulse"
                >
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 rounded" style={{ background: "var(--surface-2)" }} />
                        <div className="h-3 w-1/2 rounded" style={{ background: "var(--surface-2)" }} />
                    </div>
                    <div className="flex gap-2">
                        <div className="h-6 w-16 rounded" style={{ background: "var(--surface-2)" }} />
                        <div className="h-6 w-20 rounded" style={{ background: "var(--surface-2)" }} />
                    </div>
                </div>
            ))}
        </>
    );
}
