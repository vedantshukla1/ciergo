import { Plane, Building2, Bus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const EXACT_OWNERS = [
  { id: '1', initials: 'AS', color: '#EF4444', name: 'Aman Sharma' },
  { id: '2', initials: 'AK', color: '#8B5CF6', name: 'Arjun Kumar' },
  { id: '3', initials: 'SR', color: '#3B82F6', name: 'Sneha Roy' },
  { id: '4', initials: 'VG', color: '#0EA5E9', name: 'Varun Gupta' },
];

export type BookingRow = {
  id: string;
  bookingId: string;
  leadPax: string;
  travelDate: string;
  serviceText: string;
  ServiceIcon: LucideIcon | null;
  isUae: boolean;
  paymentStatus: 'paid' | 'partiallyPaid' | 'pending';
  amount: string;
  tasks: number;
  needsApproval?: boolean;
};

export const BOOKINGS_ROWS: BookingRow[] = [
  { id: 'row-1', bookingId: 'OS-ABC12', leadPax: 'Anand Mishra', travelDate: "05 Mar '26", serviceText: 'Flight', ServiceIcon: Plane, isUae: false, paymentStatus: 'paid', amount: '24,580', tasks: 1 },
  { id: 'row-2', bookingId: 'OS-ABC13', leadPax: 'Sumit Jha', travelDate: "05 Mar '26", serviceText: 'Accomodation', ServiceIcon: Building2, isUae: false, paymentStatus: 'partiallyPaid', amount: '24,580', tasks: 1 },
  { id: 'row-3', bookingId: 'LI-ABC12', leadPax: 'Anand Mishra', travelDate: "05 Mar '26", serviceText: 'Explore UAE', ServiceIcon: null, isUae: true, paymentStatus: 'pending', amount: '24,580', tasks: 1 },
  { id: 'row-4', bookingId: 'OS-ABC14', leadPax: 'Zaheer', travelDate: "05 Mar '26", serviceText: 'Transportation', ServiceIcon: Bus, isUae: false, paymentStatus: 'pending', amount: '24,580', tasks: 1 },
  { id: 'row-5', bookingId: 'OS-ABC15', leadPax: 'Gaurav Kapoor', travelDate: "05 Mar '26", serviceText: 'Flight', ServiceIcon: Plane, isUae: false, paymentStatus: 'paid', amount: '24,580', tasks: 0 },
  { id: 'row-6', bookingId: 'OS-ABC16', leadPax: 'Shirish Pandey', travelDate: "05 Mar '26", serviceText: 'Flight', ServiceIcon: Plane, isUae: false, paymentStatus: 'pending', amount: '24,580', tasks: 1 }
];

export const DELETED_ROWS: BookingRow[] = [
  { id: 'del-1', bookingId: 'OS-ABC22', leadPax: 'Ravi Sharma', travelDate: "05 Mar '26", serviceText: 'Flight', ServiceIcon: Plane, isUae: false, paymentStatus: 'paid', amount: '24,580', tasks: 1 },
  { id: 'del-2', bookingId: 'OS-ABC23', leadPax: 'Arjun Verma', travelDate: "05 Mar '26", serviceText: 'Accomodation', ServiceIcon: Building2, isUae: false, paymentStatus: 'partiallyPaid', amount: '24,580', tasks: 1 },
  { id: 'del-3', bookingId: 'LI-ABC32', leadPax: 'Karan Singh', travelDate: "05 Mar '26", serviceText: 'Explore UAE', ServiceIcon: null, isUae: true, paymentStatus: 'pending', amount: '24,580', tasks: 1 },
  { id: 'del-4', bookingId: 'OS-ABC34', leadPax: 'Irfan Khan', travelDate: "05 Mar '26", serviceText: 'Flight', ServiceIcon: Plane, isUae: false, paymentStatus: 'pending', amount: '24,580', tasks: 1 },
  { id: 'del-5', bookingId: 'OS-ABC45', leadPax: 'Vikram Mehta', travelDate: "05 Mar '26", serviceText: 'Flight', ServiceIcon: Plane, isUae: false, paymentStatus: 'paid', amount: '24,580', tasks: 1 }
];

export const WAITING_ROWS: BookingRow[] = [
  { id: 'wait-1', bookingId: 'OS-ABC12', leadPax: 'Anand Mishra', travelDate: "05 Mar '26", serviceText: 'Flight', ServiceIcon: Plane, isUae: false, paymentStatus: 'paid', amount: '24,580', tasks: 1 },
  { id: 'wait-2', bookingId: 'OS-ABC13', leadPax: 'Sumit Jha', travelDate: "05 Mar '26", serviceText: 'Accomodation', ServiceIcon: Building2, isUae: false, paymentStatus: 'partiallyPaid', amount: '24,580', tasks: 1 },
  { id: 'wait-3', bookingId: 'LI-ABC12', leadPax: 'Anand Mishra', travelDate: "05 Mar '26", serviceText: 'Explore UAE', ServiceIcon: null, isUae: true, paymentStatus: 'pending', amount: '24,580', tasks: 1, needsApproval: true },
  { id: 'wait-4', bookingId: 'OS-ABC14', leadPax: 'Zaheer', travelDate: "05 Mar '26", serviceText: 'Transportation', ServiceIcon: Bus, isUae: false, paymentStatus: 'pending', amount: '24,580', tasks: 1 },
  { id: 'wait-5', bookingId: 'OS-ABC15', leadPax: 'Gaurav Kapoor', travelDate: "05 Mar '26", serviceText: 'Flight', ServiceIcon: Plane, isUae: false, paymentStatus: 'paid', amount: '24,580', tasks: 0, needsApproval: true },
  { id: 'wait-6', bookingId: 'OS-ABC16', leadPax: 'Shirish Pandey', travelDate: "05 Mar '26", serviceText: 'Flight', ServiceIcon: Plane, isUae: false, paymentStatus: 'pending', amount: '24,580', tasks: 1 }
];
