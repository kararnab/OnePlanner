"use client";

import Image from "next/image";
import type { User } from "@/lib/store/userStore";
import { t } from "@/lib/i18n";
import ErrorStateUI from "@/components/ui/ErrorStateUI";

export type AgendaItemData = {
    id: string;
    title: string;
    time: string;
};

type AgendaCardProps = {
    user: User;
    agenda?: AgendaItemData[]; // injected data
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
        <div
            className="rounded-2xl shadow-sm p-6 w-full flex flex-col border"
            style={{
                background: "var(--color-background)",
                color: "var(--color-foreground)",
                borderColor: "var(--color-border)",
            }}
        >
            {/* ✅ Header + Refresh */}
            <div className="flex flex-col items-center mb-4 shrink-0">
                <h2 className="text-lg font-semibold text-center">
                    {t("greeting", {
                        name: user.name || t("userFallback"),
                    })}
                </h2>

                <Image
                    src={
                        user.avatar ??
                        "https://www.iibsonline.com/public/testimonial/testimonial_image_full/183.png"
                    }
                    alt={`${user.name ?? "User"} avatar`}
                    width={60}
                    height={60}
                    priority
                    className="rounded-full mt-3 object-cover"
                    unoptimized
                />
            </div>

            <h3 className="font-medium mb-3 shrink-0 text-sm opacity-90">
                Agenda
            </h3>

            {/* ✅ Scroll Area */}
            <div className="space-y-3 overflow-y-auto max-h-80 pr-2 scrollbar-thin">
                {/* ✅ Loading */}
                {isLoading && <AgendaSkeleton />}

                {/* ✅ Error */}
                {!isLoading && error && (
                    <ErrorStateUI message={error} onRefresh={onRefresh} />
                )}

                {/* ✅ Empty */}
                {!isLoading && !error && agenda.length === 0 && <EmptyAgendaState />}

                {/* ✅ Data */}
                {!isLoading &&
                    !error &&
                    agenda.map((item) => (
                        <AgendaItem
                            key={item.id}
                            title={item.title}
                            time={item.time}
                        />
                    ))}
            </div>
        </div>
    );
}

function AgendaItem({ title, time }: { title: string; time: string }) {
    return (
        <div className="flex justify-between items-center gap-3">
            <div className="min-w-0">
                <p className="font-medium truncate">{title}</p>
                <p className="text-sm opacity-70">{time}</p>
            </div>

            <div className="flex gap-2 shrink-0">
                <button
                    className="border text-xs px-3 py-1 rounded-md transition"
                    style={{
                        borderColor: "var(--color-primary)",
                        color: "var(--color-primary)",
                        background: "var(--color-primary-soft)",
                    }}
                >
                    Reschedule
                </button>

                <button
                    type="button"
                    className="border text-xs px-3 py-1 rounded-md transition
          border-gray-300 dark:border-gray-700 opacity-90
          hover:bg-gray-100 dark:hover:bg-gray-800
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-gray-400/40"
                >
                    Change attendance
                </button>
            </div>
        </div>
    );
}

function EmptyAgendaState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center opacity-75">
            <p className="text-sm font-medium">No agenda for today 🎉</p>
            <p className="text-xs mt-1">Enjoy your free time or create a new event.</p>
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
                        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>

                    <div className="flex gap-2">
                        <div className="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                </div>
            ))}
        </>
    );
}
