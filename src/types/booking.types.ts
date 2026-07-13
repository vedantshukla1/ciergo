export type BookingStatus =
  | 'confirmed'
  | 'pending'
  | 'cancelled'
  | 'deleted'
  | 'waitingForApproval';

export type PaymentStatus =
  | 'paid'
  | 'pending'
  | 'partiallyPaid'
  | 'refunded'
  | 'failed';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type BookingType =
  | 'b2b'
  | 'b2c'
  | 'corporate'
  | 'group'
  | 'individual';

export type ServiceType =
  | 'flight'
  | 'accommodation'
  | 'transportationLand'
  | 'transportationSea'
  | 'ticketAttraction'
  | 'activity'
  | 'visa'
  | 'travelInsurance'
  | 'others'
  | 'limitless';

export interface Owner {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  color: string;
}

export interface ServiceItem {
  type: ServiceType;
  name: string;
  icon: string;
}

export interface VoucherInfo {
  count: number;
  items: { name: string; url: string }[];
}

export interface TaskInfo {
  total: number;
  pending: number;
  completed: number;
}

export interface PaymentInfo {
  customerAmount: number;
  vendorAmount: number;
  currency: string;
}

export interface Booking {
  id: string;
  bookingId: string;
  leadPax: string;
  leadPaxEmail: string;
  travelDateFrom: string;
  travelDateTo: string;
  bookingDate: string;
  service: ServiceItem[];
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  approvalStatus?: ApprovalStatus;
  amount: number;
  currency: string;
  owners: Owner[];
  primaryOwner?: Owner;
  secondaryOwner?: Owner;
  vouchers: VoucherInfo;
  tasks: TaskInfo;
  paymentInfo: PaymentInfo;
  bookingType: BookingType;
  isDeleted: boolean;
  deletedAt?: string;
  notes?: string;
}

export interface BookingTab {
  id: 'bookings' | 'deleted' | 'waitingForApproval';
  label: string;
  count?: number;
}

export interface ApprovalSubTab {
  id: 'all' | 'pending' | 'approved' | 'rejected';
  label: string;
  count?: number;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: string;
  direction: SortDirection;
}

export interface SummaryData {
  net: number;
  youGive: number;
  youGet: number;
  currency: string;
}
