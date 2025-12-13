"use client";

import { useUserStore } from "@/lib/store/userStore";
import { useRouter } from "next/navigation";
import {t} from "@/lib/i18n";

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
        <div
            className="flex items-center gap-4"
            style={{ color: "var(--color-foreground)" }}
        >
      <span className="text-sm opacity-70 truncate max-w-[180px]">
        {user.email}
      </span>

            <button
                onClick={onLogout}
                className="
          px-3 py-1 text-sm rounded-md transition-colors
          border
          hover:bg-black/5
        "
            >
                {t("logout")}
            </button>
        </div>
    );
}
