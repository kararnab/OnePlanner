"use client";

import Avatar from "@/components/ui/Avatar";

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
        <div className="op-card p-6 flex flex-col">
            <h3 className="op-card-title" style={{ marginBottom: 16 }}>
                Invitations
            </h3>

            <div className="space-y-4 overflow-y-auto max-h-72 pr-2 scrollbar-thin">
                {isLoading && <InvitationSkeleton />}
                {!isLoading && invitations.length === 0 && <EmptyInvitationState />}
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
                <Avatar name={item.name} size={32} />

                <div className="min-w-0">
                    <p
                        className="truncate"
                        style={{ fontWeight: 500, margin: 0, fontSize: 14, color: "var(--fg-1)" }}
                    >
                        {item.name}
                    </p>
                    <p
                        className="truncate op-fg-2"
                        style={{ fontSize: 13, margin: "2px 0 0" }}
                    >
                        invited you to{" "}
                        <strong style={{ color: "var(--fg-1)", fontWeight: 600 }}>
                            {item.title}
                        </strong>
                    </p>
                </div>
            </div>

            <button
                type="button"
                aria-label={`RSVP to ${item.title}`}
                className="op-cta"
                style={{ width: "auto", padding: "6px 14px", fontSize: 12.5, borderRadius: 6, flexShrink: 0 }}
            >
                RSVP
            </button>
        </div>
    );
}

function EmptyInvitationState() {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="op-fg-2" style={{ fontSize: 14, fontWeight: 500 }}>
                No new invitations
            </p>
            <p className="op-muted" style={{ fontSize: 12, marginTop: 4 }}>
                You&#39;re all caught up 🎉
            </p>
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
                        <div className="h-10 w-10 rounded-full" style={{ background: "var(--surface-2)" }} />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-2/3 rounded" style={{ background: "var(--surface-2)" }} />
                            <div className="h-3 w-1/2 rounded" style={{ background: "var(--surface-2)" }} />
                        </div>
                    </div>
                    <div className="h-8 w-16 rounded" style={{ background: "var(--surface-2)" }} />
                </div>
            ))}
        </>
    );
}
