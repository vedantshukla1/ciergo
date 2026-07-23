import { fetchApi } from './client';
import type { Booking } from '../types/booking.types';

export const fetchBookings = (): Promise<Booking[]> => {
  return fetchApi<Booking[]>('/Bookings');
};

export const createBooking = (data: Partial<Booking>): Promise<Booking> => {
  return fetchApi<Booking>('/Bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateBooking = (id: string, data: Partial<Booking>): Promise<Booking> => {
  return fetchApi<Booking>(`/Bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteBooking = (id: string): Promise<void> => {
  return fetchApi<void>(`/Bookings/${id}`, {
    method: 'DELETE',
  });
};
