"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardClient from "./DashboardClient";
import {
    Home,
    Calendar,
    Video,
    Users,
    Layers,
    Settings,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import TopBar from "@/components/meeting/TopBar";
import {t} from "@/lib/i18n";
import { useUserStore } from "@/lib/store/userStore";

export default function DashboardPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const logout = useUserStore((s) => s.logout);

    const handleLogout = () => {
        logout();
        router.replace("/login");
    };

    return (
        <>
            <TopBar />

            <div
                className="flex min-h-screen relative"
                style={{
                    background: "var(--background)",
                    color: "var(--fg-1)",
                }}
            >
                {/* MOBILE OVERLAY */}
                {sidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    />
                )}

                {/* SIDEBAR */}
                <aside
                    className={`
                        fixed md:static z-50
                        w-60 p-5 flex flex-col
                        h-screen md:h-auto
                        transition-transform duration-300
                        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                        md:translate-x-0
                      `}
                    style={{
                        background: "var(--surface)",
                        color: "var(--fg-1)",
                        borderRight: "1px solid var(--color-border)",
                    }}
                >
                    <div>
                        {/* MOBILE CLOSE BUTTON */}
                        <div className="flex justify-between items-center mb-6 md:hidden">
                            <span className="font-semibold">Menu</span>
                            <X className="cursor-pointer" onClick={() => setSidebarOpen(false)} />
                        </div>

                        <nav className="space-y-3">
                            <SidebarItem icon={<Home size={18} />} label="Home" active />
                            <SidebarItem icon={<Calendar size={18} />} label="Calendar" href="/schedule" />
                            <SidebarItem icon={<Video size={18} />} label="Recording" />
                            <SidebarItem icon={<Users size={18} />} label="Contacts" href="/clients" />
                            <SidebarItem icon={<Layers size={18} />} label="Whiteboards" href="/whiteboard" />
                            <SidebarItem icon={<Settings size={18} />} label="Settings" href="/settings" />
                        </nav>

                        <div className="mt-auto">
                            <SidebarItem
                                icon={<LogOut size={18} />}
                                label={t("logout")}
                                onClick={handleLogout}
                                danger />
                        </div>
                    </div>

                </aside>

                {/* MAIN CONTENT */}
                <div className="flex-1 flex flex-col w-full">
                    {/* MOBILE MENU BUTTON */}
                    <div
                        className="md:hidden p-3 border-b flex items-center gap-2"
                        style={{
                            borderColor: "var(--color-border)",
                            background: "var(--surface)",
                            color: "var(--fg-1)",
                        }}
                    >
                        <Menu className="cursor-pointer" onClick={() => setSidebarOpen(true)} />
                        <span className="font-medium text-sm">Dashboard</span>
                    </div>

                    <main className="p-4 sm:p-6">
                        <DashboardClient />
                    </main>
                </div>
            </div>
        </>
    );
}

function SidebarItem({
    icon,
    label,
    active,
    danger,
    href,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    danger?: boolean;
    href?: string;
    onClick?: () => void;
}) {
    const baseColor = danger
        ? "var(--color-danger)"
        : active
            ? "var(--color-primary)"
            : "var(--fg-1)";
    const bg = active ? "var(--color-primary-soft)" : "transparent";
    const hoverBg = danger ? "var(--color-danger-soft)" : "var(--surface-2)";
    const body = (
        <div
            onClick={onClick}
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
                transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = hoverBg;
            }}
            onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
            }}
        >
            {icon}
            <span>{label}</span>
        </div>
    );
    return href ? <Link href={href}>{body}</Link> : body;
}
