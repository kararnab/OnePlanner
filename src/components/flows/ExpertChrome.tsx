"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";
import { useUserStore } from "@/lib/store/userStore";
import { FButton, ThemeToggle } from "./Primitives";
import {
    Home,
    Calendar,
    Video,
    Users,
    Layers,
    Settings,
    LogOut,
    type LucideIcon,
} from "lucide-react";
import { t } from "@/lib/i18n";

export type SidebarKey = "Home" | "Calendar" | "Recording" | "Contacts" | "Whiteboards" | "Settings";

const ITEMS: { key: SidebarKey; icon: LucideIcon; href: string }[] = [
    { key: "Home", icon: Home, href: "/dashboard" },
    { key: "Calendar", icon: Calendar, href: "/dashboard" },
    { key: "Recording", icon: Video, href: "/dashboard" },
    { key: "Contacts", icon: Users, href: "/clients" },
    { key: "Whiteboards", icon: Layers, href: "/whiteboard" },
    { key: "Settings", icon: Settings, href: "/settings" },
];

export function ExpertTopBar({ rightSlot }: { rightSlot?: React.ReactNode }) {
    const user = useUserStore((s) => s.user);
    const logout = useUserStore((s) => s.logout);
    const router = useRouter();

    const onLogout = () => {
        logout();
        router.replace("/login");
    };

    return (
        <header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 20px",
                borderBottom: "1px solid var(--color-border)",
                background: "var(--surface)",
                color: "var(--fg-1)",
            }}
        >
            <Link href="/dashboard" className="flex items-center gap-2">
                <BrandLogo width={70} priority />
            </Link>
            <div className="flex items-center gap-3">
                {user?.email && (
                    <span style={{ fontSize: 13, color: "var(--fg-3)" }} className="hidden sm:inline">
                        {user.email}
                    </span>
                )}
                <ThemeToggle />
                {rightSlot ?? (
                    <FButton variant="secondary" compact onClick={onLogout}>
                        {t("logout")}
                    </FButton>
                )}
            </div>
        </header>
    );
}

export function ExpertSidebar({ active }: { active: SidebarKey }) {
    const logout = useUserStore((s) => s.logout);
    const router = useRouter();

    const onLogout = () => {
        logout();
        router.replace("/login");
    };

    return (
        <aside
            className="hidden md:flex"
            style={{
                width: 240,
                padding: 20,
                flexDirection: "column",
                justifyContent: "space-between",
                background: "var(--surface)",
                borderRight: "1px solid var(--color-border)",
            }}
        >
            <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {ITEMS.map((it) => (
                    <SidebarItem
                        key={it.key}
                        icon={it.icon}
                        label={it.key}
                        href={it.href}
                        active={it.key === active}
                    />
                ))}
            </nav>
            <SidebarItem icon={LogOut} label={t("logout")} onClick={onLogout} danger />
        </aside>
    );
}

function SidebarItem({
    icon: Icon,
    label,
    href,
    active,
    danger,
    onClick,
}: {
    icon: LucideIcon;
    label: string;
    href?: string;
    active?: boolean;
    danger?: boolean;
    onClick?: () => void;
}) {
    const [hover, setHover] = useState(false);
    const baseColor = danger ? "var(--color-danger)" : active ? "var(--color-primary)" : "var(--fg-1)";
    let bg = "transparent";
    if (active) bg = "var(--color-primary-soft)";
    else if (hover && danger) bg = "var(--color-danger-soft)";
    else if (hover) bg = "var(--surface-2)";

    const body = (
        <div
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 12px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
                color: baseColor,
                background: bg,
                transition: "all 0.2s",
            }}
        >
            <Icon size={18} />
            <span>{label}</span>
        </div>
    );

    return href ? <Link href={href}>{body}</Link> : body;
}
