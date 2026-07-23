import { useState, useEffect } from 'react';
import { ChevronDown, ClipboardList, Plus, IndianRupee, ArrowRightLeft, ArrowUpDown, Eye, Plane, Building2, Bus, Ticket } from 'lucide-react';
import { AvatarStack } from './AvatarStack';
import { PaymentStatusBadge, ServiceStatusBadge } from './StatusBadge';
import { VoucherButton } from './VoucherButton';
import { RowActionsDropdown } from './RowActionsDropdown';
import { ServiceFilterDropdown } from './ServiceFilterDropdown';
import { TableHeaderDateDropdown } from './TableHeaderDateDropdown';
import { ConfirmationModal } from './ConfirmationModal';
import { RecordPaymentSidesheet } from '../payments/RecordPaymentSidesheet';
import { PaymentsListModal } from '../payments/PaymentsListModal';
import { useBookings } from '../../hooks/useBookings';
import { usePayments } from '../../hooks/usePayments';
import { EXACT_OWNERS } from '@/data/bookingTableMockData';

interface BookingTableProps {
  bookings?: any[];
  isSelectMode?: boolean;
  selectAllTrigger?: number;
  clearSelectionTrigger?: number;
  searchQuery?: string;
}

export const ActiveBookingsTable = ({ bookings: propBookings, isSelectMode, selectAllTrigger, clearSelectionTrigger, searchQuery: _searchQuery }: BookingTableProps) => {
  const { filteredBookings: hookBookings, isLoading: isBookingsLoading, error: bookingsError, deleteBooking, duplicateBooking } = useBookings();
  const { payments } = usePayments();
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sendApprovalModal, setSendApprovalModal] = useState<{ isOpen: boolean, bookingId: string } | null>(null);
  const [columnMode, setColumnMode] = useState<'billedTo' | 'leadPax'>('billedTo');
  const [statusColumnMode, setStatusColumnMode] = useState<'payment' | 'service'>('payment');

  // Modals state
  const [recordPaymentBooking, setRecordPaymentBooking] = useState<{ id: string, amount: number, partyName: string } | null>(null);
  const [viewPaymentsBookingId, setViewPaymentsBookingId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);

  const currentRows = propBookings || hookBookings;
  const totalPages = Math.max(1, Math.ceil(currentRows.length / pageSize));
  
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, currentRows.length);
  const displayedRows = currentRows.slice(startIndex, endIndex);

  const showingText = currentRows.length === 0
    ? 'Showing 0 Bookings'
    : `Showing ${startIndex + 1}-${endIndex} of ${currentRows.length} Bookings`;

  const paginationElement = (
    <div className="flex items-center gap-2 text-gray-500">
      <button 
        disabled={safeCurrentPage <= 1}
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold"
      >
        {'<'}
      </button>
      <div className="flex items-center gap-1 text-[13px]">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
              pageNum === safeCurrentPage
                ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
      <button 
        disabled={safeCurrentPage >= totalPages}
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold"
      >
        {'>'}
      </button>
    </div>
  );

  useEffect(() => {
    if (selectAllTrigger) {
      if (selectedIds.size === currentRows.length) {
        setSelectedIds(new Set());
      } else {
        setSelectedIds(new Set(currentRows.map(r => r.id)));
      }
    }
  }, [selectAllTrigger, currentRows]);

  useEffect(() => {
    if (clearSelectionTrigger) {
      setSelectedIds(new Set());
    }
  }, [clearSelectionTrigger]);

  const toggleRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const getCalculatedStatus = (row: any) => {
    const bookingId = row.bookingId;
    const totalAmountDue = Number(row.amount || row.totalAmount || 0);

    const bookingPayments = (payments || []).filter(
      (p) => p && (p.bookingId === bookingId || (p as any)?.BookingID === bookingId)
    );

    let totalPaid = 0;
    if (bookingPayments.length > 0) {
      totalPaid = bookingPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    } else if (row.customerPaid !== undefined && Number(row.customerPaid) > 0) {
      totalPaid = Number(row.customerPaid);
    } else if (row.paymentStatus) {
      const s = String(row.paymentStatus).toLowerCase();
      if (s === 'paid') totalPaid = totalAmountDue;
      else if (s.includes('partially')) totalPaid = Math.floor(totalAmountDue / 2);
    }

    let status: 'paid' | 'partiallyPaid' | 'pending' = 'pending';
    if (totalPaid >= totalAmountDue && totalAmountDue > 0) {
      status = 'paid';
    } else if (totalPaid > 0) {
      status = 'partiallyPaid';
    }

    return {
      status,
      customerAmount: totalPaid,
      vendorAmount: Math.max(0, totalAmountDue - totalPaid),
      totalAmountDue,
    };
  };

  if (isBookingsLoading) {
    return <div className="p-12 text-center text-gray-500 font-medium">Loading Bookings...</div>;
  }

  if (bookingsError) {
    return <div className="p-12 text-center text-red-500 font-medium">{bookingsError}</div>;
  }

  if (currentRows.length === 0) {
    return <div className="p-12 text-center text-gray-500 font-medium">No bookings found.</div>;
  }

  return (
    <>
    <div className="flex-1 flex flex-col p-4 bg-white">
      <div className="flex-1 flex flex-col overflow-visible rounded-xl border border-gray-100">
        <div className="overflow-visible flex-1">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1200px]">
            <thead className="bg-[#F3F4F6]">
              <tr>
                {isSelectMode && (
                  <th className="px-6 py-4 text-center w-[50px] rounded-tl-xl">
                    <div className="w-4 h-4"></div>
                  </th>
                )}
                <th className={`px-6 py-4 text-[12px] font-semibold text-gray-500 ${!isSelectMode ? 'rounded-tl-xl' : ''}`}>Booking ID</th>
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
              {displayedRows.map((row: any) => {
                const calculatedPaymentInfo = getCalculatedStatus(row);
                const outstandingAmount = calculatedPaymentInfo.vendorAmount;

                const travelDateDisplay = row.travelDateFrom 
                  ? `${row.travelDateFrom}${row.travelDateTo ? ` - ${row.travelDateTo}` : ''}`
                  : (row.travelDate || row.bookingDate || 'N/A');

                const serviceNameDisplay = Array.isArray(row.service) && row.service.length > 0 
                  ? row.service[0].name 
                  : (typeof row.service === 'string' ? row.service : row.serviceText || 'Flight');

                const getServiceIcon = (name: string) => {
                  const s = name.toLowerCase();
                  if (s.includes('hotel') || s.includes('accomodation') || s.includes('accommodation')) return Building2;
                  if (s.includes('bus') || s.includes('transport')) return Bus;
                  if (s.includes('ticket') || s.includes('attraction')) return Ticket;
                  return Plane;
                };

                const ServiceIconComp = row.ServiceIcon || getServiceIcon(serviceNameDisplay);
                const ownersDisplay = (row.owners && row.owners.length > 0) ? row.owners : [{ id: 'default', name: 'Unassigned', initials: 'UA', color: '#9CA3AF' }];
                const vouchersDisplay = (row.vouchers && row.vouchers.count > 0) ? row.vouchers : { count: 1, items: [{ name: 'Voucher.pdf', url: '#' }] };

                const amountDisplay = row.amount || row.totalAmount || 0;

                return (
                <tr key={row.id} className="border-b border-gray-50 bg-white even:bg-[#F9FAFB] hover:bg-gray-50/80 transition-colors">
                  {isSelectMode && (
                    <td className="px-6 py-4 text-center w-[50px]">
                      <div className="flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                          checked={selectedIds.has(row.id)}
                          onChange={() => toggleRow(row.id)}
                        />
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900 text-[13px]">{row.bookingId}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[13px] font-medium text-gray-800">{row.leadPax || row.customerName}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[13px] font-medium text-gray-800">{travelDateDisplay}</span>
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
                          {ServiceIconComp && <ServiceIconComp className="w-4 h-4 text-[#8B5CF6]" />}
                          <span className="text-[11px] font-semibold text-gray-900">{serviceNameDisplay}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {statusColumnMode === 'payment' ? (
                      <PaymentStatusBadge status={calculatedPaymentInfo.status as any} paymentInfo={calculatedPaymentInfo} />
                    ) : (
                      <ServiceStatusBadge 
                        status={calculatedPaymentInfo.status === 'paid' ? 'Confirmed' : calculatedPaymentInfo.status === 'partiallyPaid' ? 'Rescheduled' : 'Cancelled'} 
                        subText={calculatedPaymentInfo.status !== 'pending' ? 'Travelled' : undefined} 
                      />
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[13px] font-bold text-gray-900">₹ {typeof amountDisplay === 'number' ? amountDisplay.toLocaleString('en-IN') : amountDisplay}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <AvatarStack owners={ownersDisplay} max={4} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <VoucherButton vouchers={vouchersDisplay} bookingId={row.bookingId} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    {row.tasks?.total > 0 ? (
                      <div className="relative inline-block cursor-pointer">
                        <div className="flex items-center justify-center w-9 h-9 bg-white border border-gray-200 rounded-lg text-amber-600 shadow-sm hover:bg-gray-50">
                          <ClipboardList className="w-4 h-4" />
                        </div>
                        <span className="absolute -top-1.5 -right-1.5 w-[16px] h-[16px] bg-white border border-purple-200 rounded-full flex items-center justify-center text-[9px] font-[#6C2BD9] text-purple-600 shadow-sm z-10">{row.tasks.total}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-9 h-9 bg-white border border-gray-200 rounded-lg text-gray-300 shadow-sm hover:bg-gray-50 cursor-pointer">
                        <Plus className="w-4 h-4" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setViewPaymentsBookingId(row.bookingId)}
                          className="group relative flex items-center justify-center w-[30px] h-[30px] bg-white border border-gray-200 rounded-lg text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <div className="absolute bottom-full mb-2 right-0 px-3.5 py-1.5 bg-[#2A2B2E] text-white text-[12px] tracking-wide font-medium rounded-[8px] whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] shadow-md pointer-events-none">
                            View Payments
                          </div>
                        </button>
                        <button 
                          onClick={() => setRecordPaymentBooking({ id: row.bookingId, amount: outstandingAmount, partyName: row.leadPax })}
                          className="group relative flex items-center justify-center w-[30px] h-[30px] bg-white border border-gray-200 rounded-lg text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                          <IndianRupee className="w-3.5 h-3.5" />
                          <div className="absolute bottom-full mb-2 right-0 px-3.5 py-1.5 bg-[#2A2B2E] text-white text-[12px] tracking-wide font-medium rounded-[8px] whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] shadow-md pointer-events-none">
                            Record Payment
                          </div>
                        </button>
                      </div>
                      <RowActionsDropdown 
                        hideDelete={false} 
                        isEmptyState={false} 
                        onSendForApproval={() => setSendApprovalModal({ isOpen: true, bookingId: row.bookingId })}
                        onDelete={() => deleteBooking(row.id)}
                        onDuplicate={() => duplicateBooking(row.id)}
                      />
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 text-[13px] text-gray-500 bg-white">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <div className="relative inline-block">
              <button 
                onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
                className="flex items-center justify-between w-[52px] px-2 py-1 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-gray-300"
              >
                <span>{pageSize}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              {isPageSizeOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  {[10, 20, 50, 100].map((num) => (
                    <div 
                      key={num} 
                      onClick={() => { setPageSize(num); setCurrentPage(1); setIsPageSizeOpen(false); }}
                      className="px-2 py-1.5 hover:bg-gray-50 text-center text-gray-700 cursor-pointer text-xs"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>{showingText}</div>
          {paginationElement}
        </div>
      </div>
    </div>

      {sendApprovalModal && (
        <ConfirmationModal
          isOpen={sendApprovalModal.isOpen}
          onClose={() => setSendApprovalModal(null)}
          onConfirm={() => {
            console.log(`Sent booking ${sendApprovalModal.bookingId} for approval`);
          }}
          type="send_for_approval"
          title={
            <>
              Are you sure you want to send booking with ID <span className="font-bold text-gray-900">'{sendApprovalModal.bookingId}'</span><br/>
              for approval ?
            </>
          }
          confirmText="Yes, Send for Approval"
        />
      )}

      {recordPaymentBooking && (
        <RecordPaymentSidesheet
          isOpen={true}
          onClose={() => setRecordPaymentBooking(null)}
          bookingId={recordPaymentBooking.id}
          outstandingDue={recordPaymentBooking.amount}
          initialPartyName={recordPaymentBooking.partyName}
        />
      )}

      {viewPaymentsBookingId && (
        <PaymentsListModal
          isOpen={true}
          onClose={() => setViewPaymentsBookingId(null)}
          bookingId={viewPaymentsBookingId}
          payments={payments.filter(p => p.bookingId === viewPaymentsBookingId || (p as any).BookingID === viewPaymentsBookingId)}
        />
      )}
    </>
  );
};

