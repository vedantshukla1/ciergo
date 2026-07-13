import type { ServiceType, BookingType } from '../types/booking.types';

export const SERVICE_TYPES: { type: ServiceType; label: string; icon: string }[] = [
  { type: 'flight', label: 'Flight', icon: 'Plane' },
  { type: 'accommodation', label: 'Accommodation', icon: 'Building2' },
  { type: 'transportationLand', label: 'Transportation (Land)', icon: 'Bus' },
  { type: 'transportationSea', label: 'Transportation (Land)', icon: 'Ship' },
  { type: 'ticketAttraction', label: 'Ticket (Attraction)', icon: 'Ticket' },
  { type: 'activity', label: 'Activity', icon: 'PersonStanding' },
  { type: 'visa', label: 'Visa', icon: 'CreditCard' },
  { type: 'travelInsurance', label: 'Travel Insurance', icon: 'ShieldCheck' },
  { type: 'others', label: 'Others', icon: 'LayoutGrid' },
];

export const BOOKING_TYPES: { value: BookingType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'b2b', label: 'B2B' },
  { value: 'b2c', label: 'B2C' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'group', label: 'Group' },
  { value: 'individual', label: 'Individual' },
];

export const PAYMENT_STATUS_CONFIG = {
  paid: { label: 'Paid', className: 'bg-[#E8F8EE] text-[#22C55E]' },
  pending: { label: 'Pending', className: 'bg-[#FEF9C3] text-[#EAB308]' },
  partiallyPaid: { label: 'Partially Paid', className: 'bg-[#FEF3C7] text-[#D97706]' },
  refunded: { label: 'Refunded', className: 'bg-blue-100 text-blue-700' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-700' },
} as const;

export const BOOKING_STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-700 border-green-200' },
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700 border-red-200' },
  deleted: { label: 'Deleted', className: 'bg-gray-100 text-gray-600 border-gray-200' },
  waitingForApproval: { label: 'Waiting', className: 'bg-purple-100 text-purple-700 border-purple-200' },
} as const;

export const APPROVAL_STATUS_CONFIG = {
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  approved: { label: 'Approved', className: 'bg-green-100 text-green-700 border-green-200' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700 border-red-200' },
} as const;

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
export const DEFAULT_PAGE_SIZE = 10;
