import { useState, useEffect } from 'react';
import { ChevronDown, ClipboardList, Plus, IndianRupee, ArrowRightLeft, ArrowUpDown, X, Check, Plane, Building2, Bus, Ticket } from 'lucide-react';
import { AvatarStack } from './AvatarStack';
import { PaymentStatusBadge, ServiceStatusBadge } from './StatusBadge';
import { VoucherButton } from './VoucherButton';
import { RowActionsDropdown } from './RowActionsDropdown';
import { ConfirmationModal } from './ConfirmationModal';
import { ServiceFilterDropdown } from './ServiceFilterDropdown';
import { TableHeaderDateDropdown } from './TableHeaderDateDropdown';
import { EXACT_OWNERS } from '@/data/bookingTableMockData';
import { useBookings } from '@/hooks/useBookings';

interface BookingTableProps {
  bookings?: any[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isSelectMode?: boolean;
  selectAllTrigger?: number;
  clearSelectionTrigger?: number;
  searchQuery?: string;
}

export const ApprovalBookingsTable = ({ bookings: propBookings, onApprove: propApprove, onReject: propReject, isSelectMode, selectAllTrigger, clearSelectionTrigger, searchQuery: _searchQuery }: BookingTableProps) => {
  const { filteredBookings: hookBookings, approveBooking: hookApprove, rejectBooking: hookReject, deleteBooking, duplicateBooking } = useBookings();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: 'approve' | 'reject'; bookingId: string } | null>(null);
  const [columnMode, setColumnMode] = useState<'billedTo' | 'leadPax'>('billedTo');
  const [statusColumnMode, setStatusColumnMode] = useState<'payment' | 'service'>('payment');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);

  const currentRows = propBookings || hookBookings;
  const approveBooking = propApprove || hookApprove;
  const rejectBooking = propReject || hookReject;

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


  return (
    <div className="flex-1 flex flex-col p-4 bg-white">
      <div className="flex-1 flex flex-col overflow-visible rounded-xl border border-gray-100">
        {/* Table */}
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
                const tasksTotal = typeof row.tasks === 'number' ? row.tasks : row.tasks?.total || 0;

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
                      <PaymentStatusBadge status={row.paymentStatus as any} paymentInfo={{ customerAmount: Number(amountDisplay), vendorAmount: Number(amountDisplay) }} />
                    ) : (
                      <ServiceStatusBadge 
                        status={row.paymentStatus === 'paid' ? 'Confirmed' : row.paymentStatus === 'partiallyPaid' ? 'Rescheduled' : 'Cancelled'} 
                        subText={row.paymentStatus !== 'pending' ? 'Travelled' : undefined} 
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
                    {tasksTotal > 0 ? (
                      <div className="relative inline-block cursor-pointer">
                        <div className="flex items-center justify-center w-9 h-9 bg-white border border-gray-200 rounded-lg text-amber-600 shadow-sm hover:bg-gray-50">
                          <ClipboardList className="w-4 h-4" />
                        </div>
                        <span className="absolute -top-1.5 -right-1.5 w-[16px] h-[16px] bg-white border border-purple-200 rounded-full flex items-center justify-center text-[9px] font-bold text-purple-600 shadow-sm z-10">{tasksTotal}</span>
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
                        <button 
                          onClick={() => setModalConfig({ isOpen: true, type: 'approve', bookingId: row.id })}
                          className="flex items-center justify-center w-[30px] h-[30px] bg-white border border-[#22C55E] rounded-lg text-[#22C55E] shadow-sm hover:bg-green-50 transition-colors"
                        >
                          <Check className="w-[18px] h-[18px] stroke-[2.5]" />
                        </button>
                        <button 
                          onClick={() => setModalConfig({ isOpen: true, type: 'reject', bookingId: row.id })}
                          className="flex items-center justify-center w-[30px] h-[30px] bg-white border border-[#EF4444] rounded-lg text-[#EF4444] shadow-sm hover:bg-red-50 transition-colors"
                        >
                          <X className="w-[18px] h-[18px] stroke-[2.5]" />
                        </button>
                      </div>
                      <RowActionsDropdown hideDelete={false} hideLink={true} onDelete={() => deleteBooking(row.id)} onDuplicate={() => duplicateBooking(row.id)} />
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
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
          
          <div>
            {showingText}
          </div>
          
          {paginationElement}
        </div>
      </div>
      
      {modalConfig && (
        <ConfirmationModal
          isOpen={modalConfig.isOpen}
          onClose={() => setModalConfig(null)}
          onConfirm={() => {
            if (modalConfig.type === 'approve') {
              approveBooking(modalConfig.bookingId);
            } else if (modalConfig.type === 'reject') {
              rejectBooking(modalConfig.bookingId);
            }
            setModalConfig(null);
          }}
          type={modalConfig.type}
          title={
            <>
              Are you sure you want to {modalConfig.type} this booking with<br/>
              ID <span className="font-bold text-gray-900">'{displayedRows.find((r: any) => r.id === modalConfig.bookingId)?.bookingId || modalConfig.bookingId}'</span> ?
            </>
          }
          confirmText={modalConfig.type === 'approve' ? 'Yes, Approve' : 'Yes, Reject'}
        />
      )}
    </div>
  );
};
