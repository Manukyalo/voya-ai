"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { bookingsApi } from "@/lib/api/client";
import type { Booking, BookingPayload, BookingStatus } from "@/lib/api/types";

const initialForm: BookingPayload = {
  room_id: "",
  guest_id: "",
  check_in: "",
  check_out: "",
  total_amount: 0,
  status: "pending",
};

export default function BookingsPage() {
  const { getToken } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BookingPayload>(initialForm);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) throw new Error("Missing auth token");
      const data = await bookingsApi.list(token, {
        status: statusFilter === "all" ? undefined : statusFilter,
        search: search || undefined,
      });
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBookings();
  }, [statusFilter]);

  const grouped = useMemo(() => {
    return {
      pending: bookings.filter((b) => b.status === "pending"),
      confirmed: bookings.filter((b) => b.status === "confirmed"),
      cancelled: bookings.filter((b) => b.status === "cancelled"),
    };
  }, [bookings]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const token = await getToken();
      if (!token) throw new Error("Missing auth token");
      if (editingId) {
        await bookingsApi.update(token, editingId, form);
      } else {
        await bookingsApi.create(token, form);
      }
      setForm(initialForm);
      setEditingId(null);
      await loadBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save booking");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) throw new Error("Missing auth token");
      await bookingsApi.remove(token, id);
      await loadBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete booking");
    }
  };

  const updateStatus = async (id: string, status: BookingStatus) => {
    try {
      const token = await getToken();
      if (!token) throw new Error("Missing auth token");
      await bookingsApi.updateStatus(token, id, status);
      await loadBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const beginEdit = (booking: Booking) => {
    setEditingId(booking.id);
    setForm({
      room_id: booking.room_id,
      guest_id: booking.guest_id,
      check_in: booking.check_in,
      check_out: booking.check_out,
      total_amount: Number(booking.total_amount),
      status: booking.status,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold text-earth-forest">Bookings</h2>
        <p className="mt-1 text-sm text-earth-muted">Create, filter, and progress reservations from pending to confirmed.</p>
      </div>

      {error ? <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={submit} className="space-y-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-earth-muted/20">
          <h3 className="text-lg font-semibold text-earth-forest">{editingId ? "Edit booking" : "New booking"}</h3>
          <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Room ID" value={form.room_id} onChange={(e) => setForm({ ...form, room_id: e.target.value })} required />
          <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Guest ID" value={form.guest_id} onChange={(e) => setForm({ ...form, guest_id: e.target.value })} required />
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded-lg border px-3 py-2 text-sm" type="date" value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })} required />
            <input className="rounded-lg border px-3 py-2 text-sm" type="date" value={form.check_out} onChange={(e) => setForm({ ...form, check_out: e.target.value })} required />
          </div>
          <input className="w-full rounded-lg border px-3 py-2 text-sm" type="number" min={0} placeholder="Total Amount" value={form.total_amount} onChange={(e) => setForm({ ...form, total_amount: Number(e.target.value) })} required />
          <select className="w-full rounded-lg border px-3 py-2 text-sm" value={form.status ?? "pending"} onChange={(e) => setForm({ ...form, status: e.target.value as BookingStatus })}>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="flex gap-2">
            <button disabled={saving} className="rounded-lg bg-earth-forest px-4 py-2 text-sm font-semibold text-earth-sand">
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
            {editingId ? (
              <button type="button" className="rounded-lg border px-4 py-2 text-sm" onClick={() => { setEditingId(null); setForm(initialForm); }}>
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-earth-muted/20">
            <input className="min-w-[220px] flex-1 rounded-lg border px-3 py-2 text-sm" placeholder="Search by guest name..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="rounded-lg border px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as BookingStatus | "all")}>
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="rounded-lg border px-4 py-2 text-sm" onClick={() => void loadBookings()}>Apply</button>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-earth-muted/20">
            <table className="min-w-full text-sm">
              <thead className="bg-earth-sand/40 text-left">
                <tr>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Room</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-earth-muted">Loading bookings...</td></tr>
                ) : bookings.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-earth-muted">No bookings found.</td></tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="border-t">
                      <td className="px-4 py-3">{booking.guests?.full_name ?? booking.guest_id}</td>
                      <td className="px-4 py-3">{booking.room_id}</td>
                      <td className="px-4 py-3">{booking.check_in} - {booking.check_out}</td>
                      <td className="px-4 py-3 capitalize">{booking.status}</td>
                      <td className="px-4 py-3">Ksh {Number(booking.total_amount).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button className="rounded border px-2 py-1" onClick={() => beginEdit(booking)}>Edit</button>
                        <button className="rounded border px-2 py-1" onClick={() => void updateStatus(booking.id, "confirmed")}>Confirm</button>
                        <button className="rounded border px-2 py-1" onClick={() => void updateStatus(booking.id, "cancelled")}>Cancel</button>
                        <button className="rounded border border-red-300 px-2 py-1 text-red-700" onClick={() => void remove(booking.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {(["pending", "confirmed", "cancelled"] as BookingStatus[]).map((status) => (
          <div key={status} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-earth-muted/20">
            <h4 className="mb-3 font-semibold capitalize text-earth-forest">{status}</h4>
            <div className="space-y-2">
              {grouped[status].slice(0, 5).map((booking) => (
                <div key={booking.id} className="rounded-lg border p-2 text-xs">
                  <div className="font-medium">{booking.guests?.full_name ?? booking.guest_id}</div>
                  <div className="text-earth-muted">{booking.check_in} to {booking.check_out}</div>
                </div>
              ))}
              {grouped[status].length === 0 ? <div className="text-xs text-earth-muted">No bookings</div> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
