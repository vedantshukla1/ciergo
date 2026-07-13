import { cn } from '@/lib/utils';
import {
  PAYMENT_STATUS_CONFIG,
  BOOKING_STATUS_CONFIG,
  APPROVAL_STATUS_CONFIG,
} from '@/constants/bookingConstants';
import type {
  PaymentStatus,
  BookingStatus,
  ApprovalStatus,
} from '@/types/booking.types';

interface PaymentInfo {
  customerAmount: number;
  vendorAmount: number;
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
  paymentInfo?: PaymentInfo;
}

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

interface ApprovalStatusBadgeProps {
  status: ApprovalStatus;
  className?: string;
}

const BaseBadge = ({
  label,
  className,
}: {
  label: string;
  className: string;
}) => (
  <span
    className={cn(
      'inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap status-badge border-none',
      className
    )}
  >
    {label}
  </span>
);

export const PaymentStatusBadge = ({ status, className, paymentInfo }: PaymentStatusBadgeProps) => {
  const config = PAYMENT_STATUS_CONFIG[status];
  
  if (status === 'pending' && paymentInfo) {
    return (
      <div className="relative group inline-block cursor-pointer">
        <BaseBadge label={config.label} className={cn(config.className, className)} />
        
        {/* Pending Amount Tooltip */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-5 py-4 bg-[#2A2B2E] text-white text-[13px] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] whitespace-nowrap min-w-[220px] flex flex-col gap-3">
          <div className="text-center font-semibold tracking-wider text-gray-100 uppercase underline underline-offset-4 decoration-gray-400 pb-1">
            PENDING AMOUNT
          </div>
          <div className="flex justify-between items-center font-medium mt-1">
            <span className="text-gray-200 tracking-wide uppercase">CUSTOMER :</span>
            <span>₹{paymentInfo.customerAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center font-medium">
            <span className="text-gray-200 tracking-wide uppercase">VENDOR :</span>
            <span>₹{paymentInfo.vendorAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    );
  }

  return <BaseBadge label={config.label} className={cn(config.className, className)} />;
};

export const BookingStatusBadge = ({ status, className }: BookingStatusBadgeProps) => {
  const config = BOOKING_STATUS_CONFIG[status];
  return <BaseBadge label={config.label} className={cn(config.className, className)} />;
};

export const ApprovalStatusBadge = ({ status, className }: ApprovalStatusBadgeProps) => {
  const config = APPROVAL_STATUS_CONFIG[status];
  return <BaseBadge label={config.label} className={cn(config.className, className)} />;
};

interface CombinedStatusBadgeProps {
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  approvalStatus?: ApprovalStatus;
}

export const CombinedStatusBadge = ({
  bookingStatus,
  paymentStatus,
  approvalStatus,
}: CombinedStatusBadgeProps) => (
  <div className="flex flex-col gap-1">
    <BookingStatusBadge status={bookingStatus} />
    <PaymentStatusBadge status={paymentStatus} />
    {approvalStatus && <ApprovalStatusBadge status={approvalStatus} />}
  </div>
);

export const ServiceStatusBadge = ({ status, subText }: { status: 'Confirmed' | 'Rescheduled' | 'Cancelled', subText?: string }) => {
  const styles = {
    Confirmed: 'bg-[#E8F8EE] text-[#16A34A]',
    Rescheduled: 'bg-[#FEF3C7] text-[#92400E]',
    Cancelled: 'bg-[#FEE2E2] text-[#991B1B]',
  };
  
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className={cn('inline-flex items-center px-3 py-1 rounded-[16px] text-[11px] font-bold whitespace-nowrap', styles[status])}>
        {status}
      </span>
      {subText && (
        <span className="text-[12px] font-medium text-gray-500">
          {subText}
        </span>
      )}
    </div>
  );
};
