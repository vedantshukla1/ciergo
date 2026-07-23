export interface PaymentEntry {
  id?: string;
  amount: number;
  reference?: string;
}

export interface PaymentRecord {
  id: string; // server ID
  paymentId: string; // PI-XXXXX or PO-XXXXX
  bookingId: string; // associated booking
  type: 'Customer' | 'Vendor';
  partyName: string; // Customer Name or Vendor Name
  date: string; // ISO date string
  amount: number;
  currency: string;
  mode: 'Cash' | 'Bank Transfer' | 'UPI' | 'Cheque' | 'Card';
  reference: string;
  notes: string;
  isAdvance: boolean;
  deposit?: PaymentEntry;
  cashback?: PaymentEntry;
  bankCharges?: PaymentEntry;
  documentName?: string; // We'll just store the name
}

import { fetchApi } from './client';

export const fetchPayments = (): Promise<PaymentRecord[]> => {
  return fetchApi<PaymentRecord[]>('/Payments');
};

export const createPayment = (data: Omit<PaymentRecord, 'id'>): Promise<PaymentRecord> => {
  return fetchApi<PaymentRecord>('/Payments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updatePayment = (id: string, data: Partial<PaymentRecord>): Promise<PaymentRecord> => {
  return fetchApi<PaymentRecord>(`/Payments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// No DELETE /Payments explicitly required but good to have if needed, skipping for now as per prompt.
