"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardClient from "./DashboardClient";
import {
    Home,
    Calendar,
    Video,
    Users,
    Layers,
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
                    background: "var(--color-background)",
                    color: "var(--color-foreground)",
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
                        background: "var(--color-background)",
                        color: "var(--color-foreground)",
                        borderColor: "var(--color-border)",
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
                            <SidebarItem icon={<Calendar size={18} />} label="Calendar" />
                            <SidebarItem icon={<Video size={18} />} label="Recording" />
                            <SidebarItem icon={<Users size={18} />} label="Contacts" />
                            <SidebarItem icon={<Layers size={18} />} label="Whiteboards" />
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
                    <div className="md:hidden p-3 border-b flex items-center gap-2">
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
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    danger?: boolean;
    onClick?: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className={`
        flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer 
        transition-all text-sm
        ${active ? "bg-blue-500/10 text-blue-600" : "opacity-90"}
        ${danger ? "text-red-500 hover:bg-red-500/10" : "hover:bg-black/5"}
      `}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </div>
    );
}
