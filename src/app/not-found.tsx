"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, House } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import { FButton, ThemeToggle } from "@/components/flows/Primitives";

export default function NotFound() {
    const router = useRouter();
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "var(--background)",
                color: "var(--fg-1)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <header
                style={{
                    padding: "14px 24px",
                    borderBottom: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Link href="/" style={{ display: "inline-flex" }}>
                    <BrandLogo width={70} priority />
                </Link>
                <ThemeToggle />
            </header>

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 24px",
                }}
            >
                <div style={{ maxWidth: 480, textAlign: "center" }}>
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 88,
                            height: 88,
                            borderRadius: 9999,
                            background: "var(--surface-2)",
                            border: "1px solid var(--color-border)",
                            marginBottom: 22,
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                fontFamily:
                                    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                fontSize: 28,
                                fontWeight: 600,
                                color: "var(--fg-2)",
                                letterSpacing: "-0.04em",
                            }}
                        >
                            404
                        </p>
                    </div>
                    <h1
                        style={{
                            margin: "0 0 12px",
                            fontSize: 28,
                            fontWeight: 600,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        This page could not be found.
                    </h1>
                    <p style={{ margin: 0, color: "var(--fg-2)", fontSize: 14.5, lineHeight: 1.55 }}>
                        The meeting link may be broken, expired, or you may not have permission to view this page.
                    </p>
                    <div
                        style={{
                            marginTop: 26,
                            display: "flex",
                            justifyContent: "center",
                            gap: 10,
                            flexWrap: "wrap",
                        }}
                    >
                        <FButton variant="secondary" leadingIcon={ArrowLeft} onClick={() => router.back()}>
                            Try again
                        </FButton>
                        <Link href="/" style={{ textDecoration: "none" }}>
                            <FButton leadingIcon={House}>Go to dashboard</FButton>
                        </Link>
                    </div>
                    <p style={{ marginTop: 26, fontSize: 12, color: "var(--fg-3)" }}>
                        Still stuck? Email{" "}
                        <a href="mailto:help@oneplanner.app" style={{ color: "var(--color-primary)" }}>
                            help@oneplanner.app
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
