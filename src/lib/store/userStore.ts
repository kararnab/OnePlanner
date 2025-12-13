"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
    name: string | null;
    email: string | null;
    avatar: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    accessTokenExpiresAt: number | null; // timestamp in ms
};

type UserStore = {
    user: User | null;
    setUser: (u: Partial<User> | null) => void;
    logout: () => void;
};

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,

            setUser: (u) =>
                set((state) => ({
                    user:
                        u === null
                            ? null
                            : {
                                ...(state.user ?? {
                                    name: null,
                                    email: null,
                                    avatar: null,
                                    accessToken: null,
                                    refreshToken: null,
                                    accessTokenExpiresAt: null,
                                }),
                                ...u,
                            },
                })),

            logout: () =>
                set({
                    user: null,
                }),
        }),
        {
            name: "meet-user-v1",
            skipHydration: false,
        }
    )
);
