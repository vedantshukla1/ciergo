import type { ServiceType, BookingType } from './booking.types';

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface OwnerFilter {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface AdvancedOwnerFilter {
  primaryOwners: OwnerFilter[];
  secondaryOwners: OwnerFilter[];
}

export interface ServiceFilter {
  otherServices: ServiceType[];
  limitless: boolean;
  selectAll: boolean;
}

export interface BookingFilters {
  bookingDate: DateRange;
  travelDate: DateRange;
  bookingOwners: OwnerFilter[];
  advancedOwner: AdvancedOwnerFilter;
  isAdvancedOwnerMode: boolean;
  bookingType: BookingType | 'all';
  bookingId: string;
  serviceFilter: ServiceFilter;
  search: string;
}

export type FilterKey = keyof BookingFilters;
