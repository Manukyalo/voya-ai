export interface Guest {
    id: string;
    lodge_id: string;
    full_name: string;
    email?: string;
    phone?: string;
    nationality?: string;
    total_stays: number;
    total_spent: number;
    created_at: string;
}

export interface Rate {
    id: string;
    lodge_id: string;
    room_id: string;
    season: 'peak' | 'offpeak' | 'standard';
    price_per_night: number;
    currency: string;
    valid_from?: string;
    valid_to?: string;
    created_at: string;
}

export interface Booking {
    id: string;
    lodge_id: string;
    room_id: string;
    guest_id: string;
    check_in: string;
    check_out: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    total_amount: number;
    payment_status: 'unpaid' | 'paid' | 'failed';
    created_at: string;
}

export interface Upsell {
    id: string;
    lodge_id: string;
    booking_id: string;
    type: 'upgrade' | 'addon' | 'activity';
    description: string;
    price: number;
    status: 'offered' | 'accepted' | 'declined';
    created_at: string;
}

export interface MpesaEvent {
    id: string;
    merchant_request_id: string;
    checkout_request_id: string;
    result_code: number;
    result_desc: string;
    amount: number;
    mpesa_receipt_number: string;
    phone_number: string;
    raw_payload: any;
    created_at: string;
}
