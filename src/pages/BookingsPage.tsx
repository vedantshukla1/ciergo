import { useState, useMemo } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { ActiveBookingsTable } from '@/components/bookings/ActiveBookingsTable';
import { DeletedBookingsTable } from '@/components/bookings/DeletedBookingsTable';
import { ApprovalBookingsTable } from '@/components/bookings/ApprovalBookingsTable';
import { BookingTabs } from '@/components/bookings/BookingTabs';
import { BookingFiltersBar } from '@/components/filters/BookingFiltersBar';
import { SummaryCards } from '@/components/bookings/SummaryCards';
import { useBookings } from '@/hooks/useBookings';
import { Calendar } from 'lucide-react';
import { TopActionsDropdown } from '@/components/bookings/TopActionsDropdown';
import { BookingTimelineCalendar } from '@/components/bookings/BookingTimelineCalendar';
import { getSummaryData } from '@/data/mockBookings';

export const BookingsPage = () => {
  const {
    bookings,
    filteredBookings,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    approvalSubTab,
    setApprovalSubTab,
    filters,
    setFilters,
    resetFilters,
    counts,
    approveBooking,
    rejectBooking,
    restoreBooking,
  } = useBookings();

  const activeBookings = useMemo(() => (bookings || []).filter((b) => !b?.isDeleted), [bookings]);
  const summaryData = getSummaryData(activeBookings.length > 0 ? activeBookings : (filteredBookings || []));

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectAllTrigger, setSelectAllTrigger] = useState(0);
  const [clearSelectionTrigger, setClearSelectionTrigger] = useState(0);

  const [isCalendarView, setIsCalendarView] = useState(false);

  const breadcrumbs = [
    { label: 'Home', href: '/', isHome: true },
    { label: 'Finance', href: '/finance' },
    { label: 'Bookings', href: isCalendarView ? '/bookings' : undefined },
  ];

  if (isCalendarView) {
    breadcrumbs.push({ label: 'Booking Calendar', href: undefined });
  }

  return (
    <MainLayout customBreadcrumbs={breadcrumbs}>
      <div className="flex flex-col min-h-[calc(100vh-60px)] bg-[#F8F9FB] px-6 pb-6 pt-12 gap-6">
        <div className="flex justify-between items-center w-full">
          <SummaryCards data={summaryData} />
          
          <div className="flex items-center gap-3">
            {!isCalendarView && (
              <TopActionsDropdown 
                isSelectMode={isSelectMode} 
                setIsSelectMode={(val) => {
                  setIsSelectMode(val);
                  if (!val) setClearSelectionTrigger(Date.now());
                }} 
                onSelectAll={() => {
                  setSelectAllTrigger(Date.now());
                }}
                onDeselectAll={() => {
                  setClearSelectionTrigger(Date.now());
                }}
              />
            )}
            <button 
              onClick={() => setIsCalendarView(!isCalendarView)}
              className={`group relative flex items-center justify-center w-[40px] h-[40px] border rounded-[14px] shadow-sm transition-colors ${isCalendarView ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
            >
              <Calendar className="w-[18px] h-[18px]" />
              <div className="absolute bottom-full mb-2 right-0 px-3.5 py-1.5 bg-[#2A2B2E] text-white text-[12px] tracking-wide font-medium rounded-[8px] whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] shadow-md pointer-events-none">
                Booking Calendar
              </div>
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 w-full">
          <BookingFiltersBar
            filters={filters}
            onFiltersChange={setFilters}
            onReset={resetFilters}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4" />
            <p className="text-[14px] font-medium text-gray-500">Loading bookings from server...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm border border-red-100">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-[15px] font-semibold text-gray-900 mb-1">Failed to load bookings</p>
            <p className="text-[13px] text-gray-500 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-purple-600 text-white text-[13px] font-semibold rounded-lg hover:bg-purple-700 transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* Main Content — only shown when not loading and no error */}
        {!isLoading && !error && (
          <>
            {isCalendarView ? (
              <BookingTimelineCalendar />
            ) : (
              <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-100 overflow-visible flex-1 w-full">
                <BookingTabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  approvalSubTab={approvalSubTab}
                  onApprovalSubTabChange={setApprovalSubTab}
                  counts={counts}
                  totalBookings={(filteredBookings || []).length}
                />

                {/* Empty State */}
                {(filteredBookings || []).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <p className="text-[15px] font-semibold text-gray-700 mb-1">No bookings found</p>
                    <p className="text-[13px] text-gray-400">
                      {activeTab === 'deleted' ? 'No deleted bookings to display.' : activeTab === 'waitingForApproval' ? 'No bookings waiting for approval.' : 'Try adjusting your filters or create a new booking.'}
                    </p>
                  </div>
                ) : (
                  <>
                    {activeTab === 'bookings' && (
                      <ActiveBookingsTable 
                        bookings={filteredBookings}
                        isSelectMode={isSelectMode} 
                        selectAllTrigger={selectAllTrigger} 
                        clearSelectionTrigger={clearSelectionTrigger} 
                        searchQuery={filters.search}
                      />
                    )}
                    {activeTab === 'deleted' && (
                      <DeletedBookingsTable 
                        bookings={filteredBookings}
                        onRestore={restoreBooking}
                        searchQuery={filters.search}
                      />
                    )}
                    {activeTab === 'waitingForApproval' && (
                      <ApprovalBookingsTable 
                        bookings={filteredBookings}
                        onApprove={approveBooking}
                        onReject={rejectBooking}
                        isSelectMode={isSelectMode} 
                        selectAllTrigger={selectAllTrigger} 
                        clearSelectionTrigger={clearSelectionTrigger} 
                        searchQuery={filters.search}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};
