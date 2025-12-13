"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {User, useUserStore} from "../store/userStore";
import api from "../api/api";
import {isApiError, RefreshResponse} from "@/lib/api/api.types";

export function useAuthRestore() {
    const user = useUserStore((s) => s.user);
    const setUser = useUserStore((s) => s.setUser);
    const logout = useUserStore((s) => s.logout);
    const router = useRouter();

    const refreshing = useRef(false);

    useEffect(() => {
        if (!user) return;

        const now = Date.now();

        // If no expiry or not expired → do nothing
        if (!user.accessTokenExpiresAt || user.accessTokenExpiresAt > now) {
            return;
        }

        if (refreshing.current) return;
        refreshing.current = true;

        async function runRefresh(user: User) {
            try {
                const res = await api.post<RefreshResponse>("/auth/refresh", {
                    refreshToken: user.refreshToken!, // OK because user is not null above
                });

                const data = res.data;

                setUser({
                    accessToken: data.accessToken,
                    accessTokenExpiresAt: Date.now() + data.accessTokenExpiresIn,
                });
            } catch (err: unknown) {
                if (isApiError(err)) {
                    if (err.status === 401) {
                        logout();
                        router.replace("/login");
                    } else {
                        // setErrorMsg(err.message);
                    }
                }
            } finally {
                refreshing.current = false;
            }
        }

        runRefresh(user);
    }, [user, setUser, logout, router]);
}
