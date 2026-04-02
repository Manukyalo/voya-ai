import type { Booking, BookingPayload, BookingStatus } from "@/lib/api/types";

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
}

async function request<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}

export const bookingsApi = {
  list: (token: string, params?: { status?: BookingStatus; search?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.search) qs.set("search", params.search);
    return request<Booking[]>(`/api/v1/bookings?${qs.toString()}`, token);
  },
  create: (token: string, payload: BookingPayload) =>
    request<Booking>("/api/v1/bookings", token, { method: "POST", body: JSON.stringify(payload) }),
  update: (token: string, id: string, payload: BookingPayload) =>
    request<Booking>(`/api/v1/bookings/${id}`, token, { method: "PUT", body: JSON.stringify(payload) }),
  updateStatus: (token: string, id: string, status: BookingStatus) =>
    request<Booking>(`/api/v1/bookings/${id}/status`, token, { method: "PUT", body: JSON.stringify({ status }) }),
  remove: (token: string, id: string) => request<void>(`/api/v1/bookings/${id}`, token, { method: "DELETE" }),
};
