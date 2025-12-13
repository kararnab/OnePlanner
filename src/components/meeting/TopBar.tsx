"use client";

import ProfileMenu from "@/components/ui/ProfileMenu";
import Logo from "@/../public/brand_logo.svg";
import Image from "next/image";
import {t} from "@/lib/i18n";

export default function TopBar() {
    return (
        <div
            className="flex items-center justify-between p-3 border-b"
            style={{
                background: "var(--color-background)",
                color: "var(--color-foreground)",
                borderColor: "var(--color-border)",
            }}
        >
            {/* SVG Logo */}
            <div className="flex items-center gap-2">
                <Image
                    src={Logo}
                    alt="Brand Logo"
                    width={70}
                    className="select-none"
                    unoptimized
                />

                {/* If you want app name beside logo, uncomment: */}
                 {/*<span className="text-xl font-semibold var(--color-foreground)">
                     {t("appName")}
                 </span>*/}
            </div>

            <ProfileMenu />
        </div>
    );
}
