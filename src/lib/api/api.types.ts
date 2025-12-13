import {AgendaItemData} from "@/components/dashboard/AgendaCard";
import {InvitationItem} from "@/components/dashboard/InvitationCard";

export type HttpResponse<T> = {
    data: T;
    status: number;
    headers?: Record<string, string>;
};

export type ApiError = {
    status: number;
    message: string;
    code?: string;
};

export function isApiError(err: unknown): err is ApiError {
    return (
        typeof err === "object" &&
        err !== null &&
        "status" in err &&
        "message" in err
    );
}

export type LoginResponse = {
    user: {
        name: string;
        email: string;
    };
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
};

export type RefreshResponse = {
    accessToken: string;
    accessTokenExpiresIn: number;
};

export type DashboardResponse = {
    agenda: {
        date: string,
        data: AgendaItemData[]
    },
    invitation: {
        date: string,
        data: InvitationItem[]
    },
}