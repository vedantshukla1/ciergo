import { useState } from 'react';
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

export const BookingsPage = () => {
  const {
    filteredBookings,
    activeTab,
    setActiveTab,
    approvalSubTab,
    setApprovalSubTab,
    filters,
    setFilters,
    resetFilters,
    counts,
  } = useBookings();

  const summaryData = {
    net: 4870,
    youGive: 70580,
    youGet: 75450,
  };

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
    breadcrumbs.push({ label: 'Booking Calendar' });
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
              totalBookings={filteredBookings.length}
            />

            {activeTab === 'bookings' && (
              <ActiveBookingsTable 
                isSelectMode={isSelectMode} 
                selectAllTrigger={selectAllTrigger} 
                clearSelectionTrigger={clearSelectionTrigger} 
                searchQuery={filters.search}
              />
            )}
            {activeTab === 'deleted' && (
              <DeletedBookingsTable 
                searchQuery={filters.search}
              />
            )}
            {activeTab === 'waitingForApproval' && (
              <ApprovalBookingsTable 
                isSelectMode={isSelectMode} 
                selectAllTrigger={selectAllTrigger} 
                clearSelectionTrigger={clearSelectionTrigger} 
                searchQuery={filters.search}
              />
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
