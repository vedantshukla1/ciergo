import { useMemo, useState, useEffect, useCallback } from 'react';
import type { Booking } from '../types/booking.types';
import type { BookingFilters } from '../types/filter.types';
import { isDateInRange } from '../utils/dateUtils';
import { fetchBookings, createBooking as apiCreateBooking, deleteBooking as apiDeleteBooking } from '../api/bookings';

export type ActiveTab = 'bookings' | 'deleted' | 'waitingForApproval';
export type ApprovalSubTab = 'all' | 'pending' | 'approved' | 'rejected';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('bookings');
  const [approvalSubTab, setApprovalSubTab] = useState<ApprovalSubTab>('all');
  const [filters, setFilters] = useState<BookingFilters>({
    bookingDate: { from: undefined, to: undefined },
    travelDate: { from: undefined, to: undefined },
    bookingOwners: [],
    advancedOwner: { primaryOwners: [], secondaryOwners: [] },
    isAdvancedOwnerMode: false,
    bookingType: 'all',
    bookingId: '',
    serviceFilter: { otherServices: [], limitless: false, selectAll: false },
    search: '',
  });

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res: any = await fetchBookings();
      const rawList = Array.isArray(res) ? res : (res?.Bookings || []);
      
      if (rawList.length > 0) {
        const normalizedList = rawList.map((item: any, idx: number) => {
          const ownersList = item.bookingOwner
            ? String(item.bookingOwner).split(',').map((name: string, i: number) => {
                const trimmed = name.trim();
                const initials = trimmed.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'OW';
                const colors = ['#EF4444', '#8B5CF6', '#3B82F6', '#0EA5E9', '#10B981'];
                return {
                  id: `owner-${i}-${trimmed}`,
                  name: trimmed,
                  initials,
                  color: colors[i % colors.length]
                };
              })
            : [];

          const serviceName = item.service || 'Flight';
          const amountVal = Number(item.totalAmount || item.amount || 0);
          const isDeleted = Boolean(item.isDeleted);
          const serviceStatus = (item.serviceStatus || '').toLowerCase();
          
          let bookingStatus: Booking['bookingStatus'] = 'confirmed';
          if (isDeleted) {
            bookingStatus = 'deleted';
          } else if (serviceStatus.includes('pending') || item.needsApproval) {
            bookingStatus = 'waitingForApproval';
          }

          let paymentStatus: Booking['paymentStatus'] = 'pending';
          const ps = (item.paymentStatus || '').toLowerCase();
          if (ps.includes('paid') && !ps.includes('partially')) paymentStatus = 'paid';
          else if (ps.includes('partially')) paymentStatus = 'partiallyPaid';
          else if (ps.includes('refund')) paymentStatus = 'refunded';

          const leadName = item.leadPax || item.customerName || 'Admin';
          const defaultOwner = {
            id: `owner-default-${idx}`,
            name: leadName,
            initials: leadName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'AD',
            color: ['#EF4444', '#8B5CF6', '#3B82F6', '#0EA5E9', '#10B981'][idx % 5],
          };

          return {
            id: String(item.id || item.ID || `api-${idx}`),
            bookingId: item.bookingId || `BK-${idx}`,
            leadPax: leadName,
            leadPaxEmail: `${leadName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
            travelDateFrom: item.travelDate || item.travelDateFrom || item.bookingDate || '',
            travelDateTo: item.travelDateTo || item.travelDate || '',
            bookingDate: item.bookingDate || item.createdAt || '',
            service: Array.isArray(item.service) ? item.service : [{ type: (serviceName.toLowerCase().includes('flight') ? 'flight' : serviceName.toLowerCase().includes('hotel') || serviceName.toLowerCase().includes('accommodation') ? 'accommodation' : 'transportationLand'), name: serviceName, icon: 'Plane' }],
            bookingStatus,
            paymentStatus,
            approvalStatus: bookingStatus === 'waitingForApproval' ? 'pending' : undefined,
            amount: amountVal,
            currency: item.currency || 'INR',
            owners: ownersList.length > 0 ? ownersList : [defaultOwner],
            primaryOwner: ownersList[0] || defaultOwner,
            secondaryOwner: ownersList[1] || undefined,
            vouchers: {
              count: 1,
              items: [{ name: 'Voucher.pdf', url: '#' }]
            },
            tasks: {
              total: item.tasks?.total ?? (item.isIncomplete ? 1 : 0),
              pending: item.isIncomplete ? 1 : 0,
              completed: 0
            },
            paymentInfo: {
              customerAmount: Number(item.customerPaid || amountVal),
              vendorAmount: Number(item.vendorDue || item.vendorPaid || Math.floor(amountVal * 0.85)),
              currency: item.currency || 'INR'
            },
            bookingType: (item.bookingType || 'b2c').toLowerCase().includes('limitless') ? 'b2c' : 'b2b',
            isDeleted,
            deletedAt: item.modifiedAt || item.createdAt
          };
        });
        setBookings(normalizedList);
      } else {
        setBookings([]);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch bookings from server');
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // For new bookings
  const createBooking = async (data: Partial<Booking>) => {
    try {
      const newBooking = await apiCreateBooking(data);
      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create booking');
    }
  };

  const approveBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, approvalStatus: 'approved', bookingStatus: 'confirmed' } : b
      )
    );
  };

  const rejectBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, approvalStatus: 'rejected' } : b))
    );
  };

  const deleteBooking = async (id: string) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    // Check if it's a seeded mock record (usually no proper id or generated randomly in mock). 
    // We try to call API anyway, if it fails, we just do local optimistic update for UI sake.
    try {
      await apiDeleteBooking(id);
    } catch (err) {
      console.warn('API delete failed, performing local delete anyway:', err);
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, isDeleted: true, bookingStatus: 'deleted', deletedAt: new Date().toISOString().split('T')[0] }
          : b
      )
    );
  };

  const restoreBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, isDeleted: false, bookingStatus: 'confirmed', deletedAt: undefined }
          : b
      )
    );
  };

  const duplicateBooking = (id: string) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;
    const newBooking: Booking = {
      ...booking,
      id: `booking-dup-${Date.now()}`,
      bookingId: `BK-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`,
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  const sendForApproval = (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, bookingStatus: 'waitingForApproval', approvalStatus: 'pending' }
          : b
      )
    );
  };

  const filteredBookings = useMemo(() => {
    let result = bookings || [];

    if (activeTab === 'deleted') {
      result = result.filter((b) => b.isDeleted);
    } else if (activeTab === 'waitingForApproval') {
      result = result.filter((b) => b.bookingStatus === 'waitingForApproval' && !b.isDeleted);
      if (approvalSubTab !== 'all') {
        result = result.filter((b) => b.approvalStatus === approvalSubTab);
      }
    } else {
      result = result.filter((b) => !b.isDeleted && b.bookingStatus !== 'waitingForApproval');
    }

    if (filters.bookingId) {
      result = result.filter((b) =>
        b?.bookingId?.toLowerCase().includes(filters.bookingId.toLowerCase())
      );
    }

    if (filters.search) {
      const s = filters.search.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b?.bookingId?.toLowerCase().includes(s) ||
          b?.leadPax?.toLowerCase().includes(s) ||
          String(b?.amount || '').includes(s) ||
          b?.owners?.some((o) => o.name.toLowerCase().includes(s) || o.initials.toLowerCase().includes(s))
      );
    }

    if (filters.bookingType && filters.bookingType !== 'all') {
      const targetType = String(filters.bookingType).toLowerCase();
      if (targetType === 'limitless') {
        result = result.filter((b) => {
          const bt = String(b.bookingType || '').toLowerCase();
          return bt.includes('limitless') || bt === 'b2c';
        });
      } else if (targetType === 'other') {
        result = result.filter((b) => {
          const bt = String(b.bookingType || '').toLowerCase();
          return !bt.includes('limitless') && bt !== 'b2c';
        });
      }
    }

    if (filters.bookingDate?.from || filters.bookingDate?.to) {
      result = result.filter((b) => isDateInRange(b.bookingDate, filters.bookingDate));
    }

    if (filters.travelDate?.from || filters.travelDate?.to) {
      result = result.filter((b) => isDateInRange(b.travelDateFrom, filters.travelDate));
    }

    if (filters.bookingOwners && filters.bookingOwners.length > 0) {
      const selectedNames = filters.bookingOwners.map((o) => o.name.toLowerCase());
      const selectedIds = filters.bookingOwners.map((o) => o.id);
      result = result.filter((b) =>
        b.owners &&
        b.owners.some((o) => selectedIds.includes(o.id) || selectedNames.includes(o.name.toLowerCase()))
      );
    }

    if (filters.isAdvancedOwnerMode && filters.advancedOwner) {
      const { primaryOwners, secondaryOwners } = filters.advancedOwner;
      if (primaryOwners && primaryOwners.length > 0) {
        const pNames = primaryOwners.map((o) => o.name.toLowerCase());
        const pIds = primaryOwners.map((o) => o.id);
        result = result.filter(
          (b) =>
            b.primaryOwner &&
            (pIds.includes(b.primaryOwner.id) || pNames.includes(b.primaryOwner.name.toLowerCase()))
        );
      }
      if (secondaryOwners && secondaryOwners.length > 0) {
        const sNames = secondaryOwners.map((o) => o.name.toLowerCase());
        const sIds = secondaryOwners.map((o) => o.id);
        result = result.filter(
          (b) =>
            b.secondaryOwner &&
            (sIds.includes(b.secondaryOwner.id) || sNames.includes(b.secondaryOwner.name.toLowerCase()))
        );
      }
    }

    if (filters.serviceFilter?.otherServices && filters.serviceFilter.otherServices.length > 0) {
      result = result.filter((b) =>
        b.service && b.service.some((s) => filters.serviceFilter.otherServices.includes(s.type))
      );
    }

    return result;
  }, [bookings, activeTab, approvalSubTab, filters]);

  const counts = useMemo(() => {
    const deleted = bookings.filter((b) => b.isDeleted).length;
    const waiting = bookings.filter(
      (b) => b.bookingStatus === 'waitingForApproval' && !b.isDeleted
    ).length;
    const waitingPending = bookings.filter(
      (b) => b.bookingStatus === 'waitingForApproval' && b.approvalStatus === 'pending' && !b.isDeleted
    ).length;
    const waitingApproved = bookings.filter(
      (b) => b.bookingStatus === 'waitingForApproval' && b.approvalStatus === 'approved' && !b.isDeleted
    ).length;
    const waitingRejected = bookings.filter(
      (b) => b.bookingStatus === 'waitingForApproval' && b.approvalStatus === 'rejected' && !b.isDeleted
    ).length;
    return { deleted, waiting, waitingPending, waitingApproved, waitingRejected };
  }, [bookings]);

  const resetFilters = () => {
    setFilters({
      bookingDate: { from: undefined, to: undefined },
      travelDate: { from: undefined, to: undefined },
      bookingOwners: [],
      advancedOwner: { primaryOwners: [], secondaryOwners: [] },
      isAdvancedOwnerMode: false,
      bookingType: 'all',
      bookingId: '',
      serviceFilter: { otherServices: [], limitless: false, selectAll: false },
      search: '',
    });
  };

  return {
    bookings,
    filteredBookings,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    approvalSubTab,
    setApprovalSubTab,
    filters,
    setFilters,
    resetFilters,
    loadBookings,
    createBooking,
    approveBooking,
    rejectBooking,
    deleteBooking,
    restoreBooking,
    duplicateBooking,
    sendForApproval,
    counts,
  };
};

