import { useState, useEffect, useCallback } from 'react';
import type { PaymentRecord } from '../api/payments';
import { fetchPayments, createPayment, updatePayment } from '../api/payments';

export const usePayments = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data: any = await fetchPayments();
      const rawList = Array.isArray(data) ? data : (data?.Payments || []);
      if (rawList.length > 0) {
        const normalized = rawList.map((p: any, idx: number) => {
          const rawId = String(p.paymentId || p.PaymentID || p.id || p.ID || idx + 1);
          const formattedId = (rawId.startsWith('PI-') || rawId.startsWith('PO-'))
            ? rawId
            : `PI-${rawId.padStart(5, '0')}`;

          const rawDate = p.date || p.paymentDate || (p.createdAt && String(p.createdAt).includes('T') ? String(p.createdAt).split('T')[0] : String(p.createdAt || ''));
          const validDate = rawDate && rawDate !== 'undefined' && rawDate.length >= 8 ? rawDate : '2026-07-23';

          const rawMode = p.mode || p.paymentMode;
          const validMode = rawMode && rawMode !== 'undefined' ? rawMode : 'Cash';

          const rawType = String(p.type || p.CustomerORVendor || p.Type || p.party || 'Customer');
          const validType = rawType.toLowerCase().includes('vendor') ? 'Vendor' : 'Customer';

          return {
            id: String(p.id || p.ID || `pay-${idx}`),
            paymentId: formattedId,
            bookingId: p.bookingId || p.BookingID || '',
            type: validType,
            partyName: p.partyName || p.entityName || p.party || 'N/A',
            date: validDate,
            amount: Number(p.amount || 0),
            currency: p.currency || 'INR',
            mode: validMode,
            reference: p.reference || p.transactionRef || '',
            notes: p.notes || '',
            isAdvance: Boolean(p.isAdvance),
            documentName: p.documentName || ''
          };
        });
        setPayments(normalized);
      }
    } catch {
      // Retain existing local state if network fetch fails
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleCreatePayment = async (data: Omit<PaymentRecord, 'id'>) => {
    const localId = `payment-${Date.now()}`;
    const newPayment: PaymentRecord = { 
      ...data, 
      id: localId,
      paymentId: data.paymentId || `PI-${String(Math.floor(Math.random() * 90000) + 10000)}`,
      date: data.date || new Date().toISOString().split('T')[0],
      currency: data.currency || 'INR',
      mode: data.mode || 'Cash',
      type: data.type || 'Customer'
    };
    try {
      const serverPayment: any = await createPayment(data);
      const normalizedServerPayment: PaymentRecord = {
        id: String(serverPayment.id || serverPayment.ID || localId),
        paymentId: serverPayment.paymentId || serverPayment.PaymentID || newPayment.paymentId,
        bookingId: serverPayment.bookingId || serverPayment.BookingID || newPayment.bookingId,
        type: serverPayment.type || serverPayment.CustomerORVendor || newPayment.type,
        partyName: serverPayment.partyName || serverPayment.entityName || newPayment.partyName,
        date: serverPayment.date || serverPayment.paymentDate || newPayment.date,
        amount: Number(serverPayment.amount || newPayment.amount),
        currency: serverPayment.currency || newPayment.currency,
        mode: serverPayment.mode || serverPayment.paymentMode || newPayment.mode,
        reference: serverPayment.reference || serverPayment.transactionRef || newPayment.reference,
        notes: serverPayment.notes || newPayment.notes,
        isAdvance: Boolean(serverPayment.isAdvance),
        documentName: serverPayment.documentName || newPayment.documentName
      };
      setPayments((prev) => [...prev, normalizedServerPayment]);
      return normalizedServerPayment;
    } catch {
      setPayments((prev) => [...prev, newPayment]);
      return newPayment;
    }
  };

  const handleUpdatePayment = async (id: string, data: Partial<PaymentRecord>) => {
    try {
      const serverUpdated: any = await updatePayment(id, data);
      const normalizedUpdated: PaymentRecord = {
        id: String(serverUpdated.id || serverUpdated.ID || id),
        paymentId: serverUpdated.paymentId || serverUpdated.PaymentID || data.paymentId || '',
        bookingId: serverUpdated.bookingId || serverUpdated.BookingID || data.bookingId || '',
        type: (serverUpdated.type || serverUpdated.CustomerORVendor || data.type || 'Customer').toLowerCase().includes('vendor') ? 'Vendor' : 'Customer',
        partyName: serverUpdated.partyName || serverUpdated.entityName || data.partyName || '',
        date: serverUpdated.date || serverUpdated.paymentDate || data.date || '',
        amount: Number(serverUpdated.amount ?? data.amount ?? 0),
        currency: serverUpdated.currency || data.currency || 'INR',
        mode: serverUpdated.mode || serverUpdated.paymentMode || data.mode || 'Cash',
        reference: serverUpdated.reference || serverUpdated.transactionRef || data.reference || '',
        notes: serverUpdated.notes || data.notes || '',
        isAdvance: Boolean(serverUpdated.isAdvance ?? data.isAdvance),
        documentName: serverUpdated.documentName || data.documentName || ''
      };
      setPayments((prev) => prev.map((p) => (p.id === id ? normalizedUpdated : p)));
      return normalizedUpdated;
    } catch {
      setPayments((prev) => prev.map((p) => (p.id === id ? ({ ...p, ...data } as PaymentRecord) : p)));
    }
  };

  return {
    payments,
    isLoading,
    error,
    createPayment: handleCreatePayment,
    updatePayment: handleUpdatePayment,
    refreshPayments: loadPayments,
  };
};
