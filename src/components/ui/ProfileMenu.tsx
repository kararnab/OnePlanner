"use client";

import { useUserStore } from "@/lib/store/userStore";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";

export default function ProfileMenu() {
    const user = useUserStore((s) => s.user);
    const logout = useUserStore((s) => s.logout);
    const router = useRouter();

    const onLogout = () => {
        logout();
        router.replace("/login");
    };

    if (!user) return null;

    return (
        <div className="flex items-center gap-3">
            <span
                className="text-sm truncate max-w-[180px] hidden sm:inline"
                style={{ color: "var(--fg-3)" }}
            >
                {user.email}
            </span>

            <button
                onClick={onLogout}
                style={{
                    padding: "6px 14px",
                    fontSize: 13,
                    borderRadius: 8,
                    border: "1px solid var(--color-border-strong)",
                    background: "var(--surface)",
                    color: "var(--fg-1)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 500,
                    transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
            >
                {t("logout")}
            </button>
        </div>
    );
}
