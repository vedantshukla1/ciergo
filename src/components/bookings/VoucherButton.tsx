import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VoucherInfo } from '@/types/booking.types';

interface VoucherButtonProps {
  vouchers: VoucherInfo;
  bookingId: string;
}

export const VoucherButton = ({ vouchers }: VoucherButtonProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (vouchers.count === 0) {
    return (
      <span className="text-[11px] text-gray-400">—</span>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="inline-flex items-center border border-gray-200 rounded-lg bg-white hover:bg-gray-50 cursor-pointer shadow-sm transition-colors"
      >
        <div className="px-2.5 py-1.5 border-r border-gray-200 flex items-center justify-center">
          <Receipt className="w-[18px] h-[18px] text-[#8B5CF6]" />
        </div>
        <div className="px-1.5 py-1.5 flex items-center justify-center">
          <ChevronDown className={cn("w-3.5 h-3.5 text-gray-400 transition-transform", open && "rotate-180")} />
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden py-1">
          <button className="w-full px-4 py-3 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-3">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span className="font-semibold text-gray-600">Booking Voucher(s)</span>
          </button>
          <div className="w-full h-[1px] bg-gray-100"></div>
          <button className="w-full px-4 py-3 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-3">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span className="font-semibold text-gray-600">Customer Invoice(s)</span>
          </button>
          <div className="w-full h-[1px] bg-gray-100"></div>
          <button className="w-full px-4 py-3 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-3">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span className="font-semibold text-gray-600">Vendor Voucher(s)</span>
          </button>
          <div className="w-full h-[1px] bg-gray-100"></div>
          <button className="w-full px-4 py-3 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-3">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span className="font-semibold text-gray-600">Vendor Invoice(s)</span>
          </button>
        </div>
      )}
    </div>
  );
};
