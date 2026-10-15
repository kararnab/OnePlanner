"use client";

import Link from "next/link";
import { AlertTriangle, Bug, RefreshCw } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import { Card, FButton, ThemeToggle } from "@/components/flows/Primitives";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const message = error.message || "We couldn't load this page.";
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
                <Card padding={36} style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
                    <div
                        style={{
                            display: "inline-flex",
                            width: 56,
                            height: 56,
                            borderRadius: 9999,
                            background: "var(--color-danger-soft)",
                            color: "var(--color-danger)",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 18,
                        }}
                    >
                        <AlertTriangle size={24} />
                    </div>
                    <h1
                        style={{
                            margin: "0 0 8px",
                            fontSize: 22,
                            fontWeight: 600,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        Something went wrong
                    </h1>
                    <p style={{ margin: 0, color: "var(--fg-3)", fontSize: 14, lineHeight: 1.55 }}>
                        We couldn&apos;t load this page. Your local edits are safe.
                    </p>
                    <pre
                        style={{
                            margin: "20px 0 0",
                            padding: 12,
                            background: "var(--surface-2)",
                            border: "1px solid var(--color-border)",
                            borderRadius: 10,
                            fontFamily:
                                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                            fontSize: 11.5,
                            color: "var(--fg-3)",
                            textAlign: "left",
                            overflowX: "auto",
                            whiteSpace: "pre-wrap",
                        }}
                    >
                        {message}
                        {error.digest && `\n(digest: ${error.digest})`}
                    </pre>
                    <div style={{ marginTop: 18, display: "flex", justifyContent: "center", gap: 10 }}>
                        <FButton variant="secondary" leadingIcon={Bug}>
                            Report
                        </FButton>
                        <FButton onClick={reset} leadingIcon={RefreshCw}>
                            Try again
                        </FButton>
                    </div>
                </Card>
            </div>
        </div>
    );
}
