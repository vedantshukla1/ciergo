import { useState, useEffect } from 'react';
import { ChevronDown, ClipboardList, Plus, IndianRupee, ArrowRightLeft, ArrowUpDown, Plane, Building2, Bus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AvatarStack } from './AvatarStack';
import { PaymentStatusBadge, ServiceStatusBadge } from './StatusBadge';
import { VoucherButton } from './VoucherButton';
import { RowActionsDropdown } from './RowActionsDropdown';
import { DateTypeFilterDropdown } from './DateTypeFilterDropdown';
import { ServiceFilterDropdown } from './ServiceFilterDropdown';
import { TableHeaderDateDropdown } from './TableHeaderDateDropdown';
import { EXACT_OWNERS, DELETED_ROWS } from '@/data/bookingTableMockData';


interface BookingTableProps {
  isSelectMode?: boolean;
  selectAllTrigger?: number;
  clearSelectionTrigger?: number;
  searchQuery?: string;
}

export const DeletedBookingsTable = ({ isSelectMode, selectAllTrigger, clearSelectionTrigger, searchQuery }: BookingTableProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [columnMode, setColumnMode] = useState<'billedTo' | 'leadPax'>('billedTo');
  const [statusColumnMode, setStatusColumnMode] = useState<'payment' | 'service'>('payment');
  
  let currentRows = [...(DELETED_ROWS as unknown as any[])];

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    currentRows = currentRows.filter(r => 
      r.bookingId?.toLowerCase().includes(q) || 
      r.leadPax?.toLowerCase().includes(q) || 
      r.amount?.toLowerCase().includes(q)
    );
  }

  let showingText = `Showing 1-${Math.min(5, currentRows.length)} of ${currentRows.length} Bookings`;
  let paginationElement = (
      <div className="flex items-center gap-4 text-gray-400">
        <button className="hover:text-gray-700">{'<'}</button>
        <div className="flex items-center gap-3 text-[13px]">
          <button className="font-bold bg-gray-100 px-3 py-1 rounded-lg text-gray-900">1</button>
        </div>
        <button className="hover:text-gray-700">{'>'}</button>
      </div>
  );

  return (
    <div className="flex-1 flex flex-col p-4 bg-white">
      <div className="flex-1 flex flex-col overflow-visible rounded-xl border border-gray-100">
        {/* Table */}
        <div className="overflow-visible flex-1">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1200px]">
            <thead className="bg-[#F3F4F6]">
              <tr>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 rounded-tl-xl">Booking ID</th>
                <th className="px-4 py-4 text-[12px] font-semibold text-gray-500">
                  <button onClick={() => setColumnMode(columnMode === 'billedTo' ? 'leadPax' : 'billedTo')} className="flex items-center gap-1.5 hover:text-gray-800 transition-colors">
                    {columnMode === 'billedTo' ? 'Billed to' : 'Lead Pax'} 
                    <ArrowRightLeft className="w-3 h-3 text-gray-400" />
                  </button>
                </th>
                <th className="px-4 py-4 text-[12px] font-semibold text-gray-500">
                  <TableHeaderDateDropdown />
                </th>
                <th className="px-4 py-4 text-[12px] font-semibold text-gray-500">
                  <div className="flex items-center gap-1.5">
                    Service 
                    <ServiceFilterDropdown />
                  </div>
                </th>
                <th className="px-4 py-4 text-[12px] font-semibold text-gray-500 text-center">
                  <button onClick={() => setStatusColumnMode(statusColumnMode === 'payment' ? 'service' : 'payment')} className="flex items-center justify-center gap-1.5 w-full hover:text-gray-800 transition-colors">
                    {statusColumnMode === 'payment' ? 'Payment Status' : 'Service Status'} 
                    <ArrowRightLeft className="w-3 h-3 text-gray-400" />
                  </button>
                </th>
                <th className="px-4 py-4 text-[12px] font-semibold text-gray-500">
                  <div className="flex items-center gap-1.5">Amount <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                </th>
                <th className="px-4 py-4 text-[12px] font-semibold text-gray-500 text-center">Owner</th>
                <th className="px-4 py-4 text-[12px] font-semibold text-gray-500 text-center">Voucher</th>
                <th className="px-4 py-4 text-[12px] font-semibold text-gray-500 text-center">Tasks</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 text-center rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 bg-white even:bg-[#F9FAFB] hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900 text-[13px]">{row.bookingId}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[13px] font-medium text-gray-800">{row.leadPax}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[13px] font-medium text-gray-800">{row.travelDate}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col items-center justify-center gap-1">
                      {row.isUae ? (
                        <>
                          <span className="text-[11px] font-semibold text-gray-900">UAE</span>
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-lg border border-purple-100">Explore UAE</span>
                        </>
                      ) : (
                        <>
                          {row.ServiceIcon && <row.ServiceIcon className="w-4 h-4 text-[#8B5CF6]" />}
                          <span className="text-[11px] font-semibold text-gray-900">{row.serviceText}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {statusColumnMode === 'payment' ? (
                      <PaymentStatusBadge status={row.paymentStatus as any} paymentInfo={{ customerAmount: 4580, vendorAmount: 4580 }} />
                    ) : (
                      <ServiceStatusBadge 
                        status={row.paymentStatus === 'paid' ? 'Confirmed' : row.paymentStatus === 'partiallyPaid' ? 'Rescheduled' : 'Cancelled'} 
                        subText={row.paymentStatus !== 'pending' ? 'Travelled' : undefined} 
                      />
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[13px] font-bold text-gray-900">₹ {row.amount}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <AvatarStack owners={EXACT_OWNERS} max={4} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    {row.emptyState ? (
                      <div className="flex justify-center">
                        <span className="text-gray-400 font-semibold tracking-widest text-[14px]">--</span>
                      </div>
                    ) : (
                      <VoucherButton vouchers={{ count: 1, items: [] }} bookingId={row.bookingId} />
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {row.emptyState ? (
                      <div className="flex justify-center">
                        <span className="text-gray-400 font-semibold tracking-widest text-[14px]">--</span>
                      </div>
                    ) : row.tasks > 0 ? (
                      <div className="relative inline-block cursor-pointer">
                        <div className="flex items-center justify-center w-9 h-9 bg-white border border-gray-200 rounded-lg text-amber-600 shadow-sm hover:bg-gray-50">
                          <ClipboardList className="w-4 h-4" />
                        </div>
                        <span className="absolute -top-1.5 -right-1.5 w-[16px] h-[16px] bg-white border border-purple-200 rounded-lg flex items-center justify-center text-[9px] font-bold text-purple-600 shadow-sm z-10">{row.tasks}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-9 h-9 bg-white border border-gray-200 rounded-lg text-gray-300 shadow-sm hover:bg-gray-50 cursor-pointer">
                        <Plus className="w-4 h-4" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center justify-center gap-2 w-[72px]">
                        {row.emptyState ? null : (
                          <button className="group relative flex items-center justify-center w-[30px] h-[30px] bg-white border border-gray-200 rounded-lg text-gray-700 shadow-sm hover:bg-gray-50">
                            <IndianRupee className="w-3.5 h-3.5" />
                            <div className="absolute bottom-full mb-2 right-0 px-3.5 py-1.5 bg-[#2A2B2E] text-white text-[12px] tracking-wide font-medium rounded-[8px] whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] shadow-md pointer-events-none">
                              Record Payment
                            </div>
                          </button>
                        )}
                      </div>
                      <RowActionsDropdown isDeleted={true} isEmptyState={row.emptyState} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 text-[13px] text-gray-500 bg-white">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <div className="relative group cursor-pointer inline-block">
              <div className="flex items-center justify-between w-[52px] px-2 py-1 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-gray-300">
                <span>6</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                {[6, 12, 24, 50].map((num) => (
                  <div key={num} className="px-2 py-1.5 hover:bg-gray-50 text-center text-gray-700 cursor-pointer">
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            {showingText}
          </div>
          
          {paginationElement}
        </div>
      </div>
    </div>
  );
};
