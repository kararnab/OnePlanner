import {DashboardResponse, LoginResponse} from "@/lib/api/api.types";

export async function mockLogin(): Promise<LoginResponse> {
    return {
        user: {
            name: "Test User",
            email: "test@example.com",
        },
        accessToken: "mock_access_" + Math.random().toString(36).slice(2),
        refreshToken: "mock_refresh_" + Math.random().toString(36).slice(2),
        accessTokenExpiresIn: 15 * 60 * 1000, // 15 minutes
    };
}

export async function mockRefresh(body: { refreshToken: string }) {
    if (!body.refreshToken.startsWith("mock_refresh_")) {
        return {
            success: false,
            error: "Invalid refresh token",
        };
    }

    return {
        success: true,
        accessToken: "mock_access_" + Math.random().toString(36).slice(2),
        accessTokenExpiresIn: 15 * 60 * 1000, // 15 minutes
    };
}

export async function mockDashboard(): Promise<DashboardResponse>{
    return {
        agenda: {
            date: '9th Dec 2025',
            data: [
                {
                    id: "a1",
                    title: "Morning stand-up",
                    time: "09:00 - 09:15",
                },
                {
                    id: "a2",
                    title: "Managers catch-up",
                    time: "10:00 - 10:30",
                },
                {
                    id: "a3",
                    title: "Ben 1:1",
                    time: "13:00 - 14:45",
                },
                {
                    id: "a4",
                    title: "KPI clarification",
                    time: "15:00 - 15:30",
                },
                {
                    id: "a5",
                    title: "KPI clarification",
                    time: "16:00 - 16:30",
                },
                {
                    id: "a6",
                    title: "KPI clarification",
                    time: "17:00 - 17:45",
                },
                {
                    id: "a7",
                    title: "KPI clarification",
                    time: "20:00 - 21:30",
                },
            ]
        },
        invitation: {
            date: '9th Dec 2025',
            data: [
                { id: 1, name: "Samson", avatar: "/globe.svg", title: "Q4 planning" },
                { id: 2, name: "Lena", avatar: "/avatar-placeholder.png", title: "Breakfast" },
                { id: 3, name: "Dominic", avatar: "/avatar-placeholder.png", title: "Brainstorming" },
                ...Array.from({ length: 20 }).map((_, i) => ({
                    id: i + 10,
                    name: `Person ${i + 1}`,
                    avatar: "https://www.shutterstock.com/image-vector/writing-letter-line-icon-paper-260nw-687045280.jpg",
                    title: `Meeting ${i + 1}`,
                })),
            ]
        }
    };
}
