"use client";

import ProfileMenu from "@/components/ui/ProfileMenu";
import { ThemeToggle } from "@/components/flows/Primitives";
import BrandLogo from "@/components/ui/BrandLogo";

export default function TopBar() {
    return (
        <div
            className="flex items-center justify-between p-3 border-b"
            style={{
                background: "var(--surface)",
                color: "var(--fg-1)",
                borderColor: "var(--color-border)",
            }}
        >
            <BrandLogo width={70} priority />

            <div className="flex items-center gap-3">
                <ThemeToggle />
                <ProfileMenu />
            </div>
        </div>
    );
}
