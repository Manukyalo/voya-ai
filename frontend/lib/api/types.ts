export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Guest {
  id: string;
  full_name: string;
  email?: string;
}

export interface Booking {
  id: string;
  room_id: string;
  guest_id: string;
  check_in: string;
  check_out: string;
  status: BookingStatus;
  total_amount: number;
  payment_status?: "unpaid" | "paid" | "failed";
  created_at: string;
  guests?: Guest;
}

export interface BookingPayload {
  room_id: string;
  guest_id: string;
  check_in: string;
  check_out: string;
  status?: BookingStatus;
  total_amount: number;
}
