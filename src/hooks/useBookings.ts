import { useMemo, useState } from 'react';
import type { Booking } from '../types/booking.types';
import type { BookingFilters } from '../types/filter.types';
import { MOCK_BOOKINGS } from '../data/mockBookings';
import { isDateInRange } from '../utils/dateUtils';

export type ActiveTab = 'bookings' | 'deleted' | 'waitingForApproval';
export type ApprovalSubTab = 'all' | 'pending' | 'approved' | 'rejected';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
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

  const deleteBooking = (id: string) => {
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
    let result = bookings;

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
        b.bookingId.toLowerCase().includes(filters.bookingId.toLowerCase())
      );
    }

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (b) =>
          b.bookingId.toLowerCase().includes(s) ||
          b.leadPax.toLowerCase().includes(s) ||
          b.owners.some((o) => o.name.toLowerCase().includes(s))
      );
    }

    if (filters.bookingType !== 'all') {
      result = result.filter((b) => b.bookingType === filters.bookingType);
    }

    if (filters.bookingDate.from || filters.bookingDate.to) {
      result = result.filter((b) => isDateInRange(b.bookingDate, filters.bookingDate));
    }

    if (filters.travelDate.from || filters.travelDate.to) {
      result = result.filter((b) => isDateInRange(b.travelDateFrom, filters.travelDate));
    }

    if (filters.bookingOwners.length > 0) {
      const ownerIds = filters.bookingOwners.map((o) => o.id);
      result = result.filter((b) => b.owners.some((o) => ownerIds.includes(o.id)));
    }

    if (filters.isAdvancedOwnerMode) {
      const { primaryOwners, secondaryOwners } = filters.advancedOwner;
      if (primaryOwners.length > 0) {
        const ids = primaryOwners.map((o) => o.id);
        result = result.filter((b) => b.primaryOwner && ids.includes(b.primaryOwner.id));
      }
      if (secondaryOwners.length > 0) {
        const ids = secondaryOwners.map((o) => o.id);
        result = result.filter((b) => b.secondaryOwner && ids.includes(b.secondaryOwner.id));
      }
    }

    if (filters.serviceFilter.otherServices.length > 0) {
      result = result.filter((b) =>
        b.service.some((s) => filters.serviceFilter.otherServices.includes(s.type))
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
    activeTab,
    setActiveTab,
    approvalSubTab,
    setApprovalSubTab,
    filters,
    setFilters,
    resetFilters,
    approveBooking,
    rejectBooking,
    deleteBooking,
    restoreBooking,
    duplicateBooking,
    sendForApproval,
    counts,
  };
};
