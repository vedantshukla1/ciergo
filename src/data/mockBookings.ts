import type { Booking, ServiceItem } from '../types/booking.types';
import { MOCK_OWNERS } from './mockOwners';

const services: ServiceItem[] = [
  { type: 'flight', name: 'Flight', icon: 'Plane' },
  { type: 'accommodation', name: 'Accommodation', icon: 'Building2' },
  { type: 'transportationLand', name: 'Transportation (Land)', icon: 'Bus' },
  { type: 'ticketAttraction', name: 'Ticket (Attraction)', icon: 'Ticket' },
  { type: 'activity', name: 'Activity', icon: 'Activity' },
  { type: 'visa', name: 'Visa', icon: 'CreditCard' },
  { type: 'travelInsurance', name: 'Travel Insurance', icon: 'Shield' },
  { type: 'others', name: 'Others', icon: 'LayoutGrid' },
];

const leadPaxNames = [
  'Rahul Gupta', 'Priya Sharma', 'Amit Patel', 'Sneha Roy', 'Vikram Singh',
  'Pooja Mehta', 'Arjun Kumar', 'Neha Joshi', 'Ravi Verma', 'Deepa Nair',
  'Sanjay Iyer', 'Anita Bose', 'Karthik Rao', 'Meera Pillai', 'Suresh Reddy',
  'Kavita Shah', 'Manoj Tiwari', 'Sunita Das', 'Rajesh Pandey', 'Lalita Mishra',
];

const getRandomItems = <T>(arr: T[], min: number, max: number): T[] => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const randomDate = (start: Date, end: Date): string => {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split('T')[0];
};

const randomAmount = (): number => Math.floor(Math.random() * 180000 + 5000);

const bookingStatuses: Booking['bookingStatus'][] = [
  'confirmed', 'pending', 'confirmed', 'confirmed', 'waitingForApproval', 'waitingForApproval', 'pending',
];
const paymentStatuses: Booking['paymentStatus'][] = [
  'paid', 'pending', 'partiallyPaid', 'paid', 'pending', 'partiallyPaid', 'refunded',
];
const approvalStatuses: Booking['approvalStatus'][] = ['pending', 'approved', 'rejected'];
const bookingTypes: Booking['bookingType'][] = ['b2b', 'b2c', 'corporate', 'group', 'individual'];

export const MOCK_BOOKINGS: Booking[] = Array.from({ length: 120 }, (_, i) => {
  const idx = i + 1;
  const bookingStatus = bookingStatuses[i % bookingStatuses.length];
  const isDeleted = i % 13 === 0;
  const isWaiting = bookingStatus === 'waitingForApproval' && !isDeleted;
  const paymentStatus = paymentStatuses[i % paymentStatuses.length];
  const amount = randomAmount();
  const owners = getRandomItems(MOCK_OWNERS, 1, 3);
  const primaryOwner = owners[0];
  const secondaryOwner = owners[1];
  const travelFrom = randomDate(new Date('2025-01-01'), new Date('2026-12-31'));
  const travelTo = randomDate(new Date(travelFrom), new Date('2027-03-31'));
  const bookingDate = randomDate(new Date('2024-06-01'), new Date('2026-07-01'));
  const serviceCount = Math.floor(Math.random() * 3) + 1;
  const selectedServices = getRandomItems(services, serviceCount, serviceCount);
  const voucherCount = Math.floor(Math.random() * 4);
  const taskTotal = Math.floor(Math.random() * 8);
  const taskCompleted = Math.floor(Math.random() * (taskTotal + 1));

  return {
    id: `booking-${idx}`,
    bookingId: `BK-${String(idx).padStart(5, '0')}`,
    leadPax: leadPaxNames[i % leadPaxNames.length],
    leadPaxEmail: `${leadPaxNames[i % leadPaxNames.length].toLowerCase().replace(' ', '.')}@email.com`,
    travelDateFrom: travelFrom,
    travelDateTo: travelTo,
    bookingDate,
    service: selectedServices,
    bookingStatus: isDeleted ? 'deleted' : bookingStatus,
    paymentStatus,
    approvalStatus: isWaiting ? approvalStatuses[i % approvalStatuses.length] : undefined,
    amount,
    currency: 'INR',
    owners,
    primaryOwner,
    secondaryOwner,
    vouchers: {
      count: voucherCount,
      items: Array.from({ length: voucherCount }, (_, j) => ({
        name: `Voucher ${j + 1}`,
        url: '#',
      })),
    },
    tasks: {
      total: taskTotal,
      pending: taskTotal - taskCompleted,
      completed: taskCompleted,
    },
    paymentInfo: {
      customerAmount: amount,
      vendorAmount: Math.floor(amount * 0.85),
      currency: 'INR',
    },
    bookingType: bookingTypes[i % bookingTypes.length],
    isDeleted,
    deletedAt: isDeleted ? randomDate(new Date('2025-01-01'), new Date('2026-01-01')) : undefined,
    notes: i % 4 === 0 ? 'Special dietary requirements noted.' : undefined,
  };
});

export const getSummaryData = (bookings: Booking[]) => {
  const active = (bookings || []).filter((b) => b && !b.isDeleted);
  const net = active.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const youGive = active.reduce((sum, b) => sum + (Number(b.paymentInfo?.vendorAmount) || Math.floor((Number(b.amount) || 0) * 0.85)), 0);
  const youGet = Math.max(0, net - youGive);
  return { net, youGive, youGet, currency: 'INR' };
};
