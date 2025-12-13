"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/ui/Input";
import api from "@/lib/api/api";
import { useUserStore } from "@/lib/store/userStore";
import { t } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { isApiError, LoginResponse } from "@/lib/api/api.types";

const DEMO_EMAIL = "test@example.com";
const DEMO_PASSWORD = "123456";

export default function LoginForm() {
    const router = useRouter();
    const setUser = useUserStore((s) => s.setUser);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const res = await api.post<LoginResponse>("/auth/login", {
                email,
                password,
            });

            const data = res.data;
            const expiresAt = Date.now() + data.accessTokenExpiresIn;

            setUser({
                name: data.user.name,
                email: data.user.email,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                accessTokenExpiresAt: expiresAt,
            });

            router.push("/dashboard");
        } catch (err: unknown) {
            if (isApiError(err)) {
                setErrorMsg(err.status === 401 ? t("invalidCredentials") : err.message);
            } else {
                setErrorMsg("Unexpected error");
            }
        } finally {
            setLoading(false);
        }
    }

    const fillDemo = () => {
        setEmail(DEMO_EMAIL);
        setPassword(DEMO_PASSWORD);
        setErrorMsg("");
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onSubmit={handleLogin}
            className="space-y-5"
            style={{ color: "var(--color-foreground)" }}
        >
            <Input
                label={t("email")}
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
            />

            <Input
                label={t("password")}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                trailing={
                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                        className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                }
            />

            <div className="flex items-center justify-between text-sm">
                <button
                    type="button"
                    onClick={fillDemo}
                    className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                    <Sparkles size={14} />
                    {t("useDemoAccount")}
                </button>

                <button
                    type="button"
                    className="opacity-70 hover:opacity-100 hover:underline transition"
                    onClick={(e) => e.preventDefault()}
                >
                    {t("forgotPassword")}
                </button>
            </div>

            <AnimatePresence>
                {errorMsg && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, height: 0, y: -6 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <p
                            role="alert"
                            className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2"
                        >
                            {errorMsg}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
                {loading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>{t("signingIn")}</span>
                    </>
                ) : (
                    t("login")
                )}
            </button>
        </motion.form>
    );
}
