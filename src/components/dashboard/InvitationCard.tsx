"use client";

import Image from "next/image";

export type InvitationItem = {
    id: number;
    name: string;
    avatar: string;
    title: string;
}

type InvitationCardProps = {
    invitations?: InvitationItem[];
    isLoading?: boolean;
};

export default function InvitationCard({
                                           invitations = [],
                                           isLoading = false,
                                       }: InvitationCardProps) {
    return (
        <div
            className="rounded-2xl shadow-sm p-6 flex flex-col border"
            style={{
                background: "var(--color-background)",
                color: "var(--color-foreground)",
                borderColor: "var(--color-border)",
            }}
        >
            <h3 className="font-semibold mb-4 shrink-0">Invitations</h3>

            {/* Scroll area */}
            <div className="space-y-4 overflow-y-auto max-h-72 pr-2 scrollbar-thin">
                {/* Loading */}
                {isLoading && <InvitationSkeleton />}

                {/* Empty */}
                {!isLoading && invitations.length === 0 && (
                    <EmptyInvitationState />
                )}

                {/* Data */}
                {!isLoading &&
                    invitations.map((item) => (
                        <InvitationRow key={item.id} item={item} />
                    ))}
            </div>
        </div>
    );
}

function InvitationRow({ item }: { item: InvitationItem }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
                <Image
                    src={item.avatar}
                    alt={item.name}
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                    unoptimized
                />

                <div className="min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm opacity-70 truncate">
                        invited you to <strong>{item.title}</strong>
                    </p>
                </div>
            </div>

            <button
                type="button"
                aria-label={`RSVP to ${item.title}`}
                className="
          px-4 py-1.5 text-sm rounded-md shrink-0
          bg-blue-600 text-white
          hover:bg-blue-700 transition
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-blue-400/40
        "
            >
                RSVP
            </button>
        </div>
    );
}


function EmptyInvitationState() {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center opacity-75">
            <p className="text-sm font-medium">No new invitations</p>
            <p className="text-xs mt-1">You&#39;re all caught up 🎉</p>
        </div>
    );
}

function InvitationSkeleton() {
    return (
        <>
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between gap-3 animate-pulse"
                >
                    <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />

                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
                            <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                        </div>
                    </div>

                    <div className="h-8 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
            ))}
        </>
    );
}

