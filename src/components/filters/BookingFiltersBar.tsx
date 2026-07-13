import { ChevronDown, Calendar as CalendarIcon, ArrowRight, Search, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import type { BookingFilters, OwnerFilter, AdvancedOwnerFilter } from '@/types/filter.types';
import { DateTypeFilterDropdown } from '@/components/bookings/DateTypeFilterDropdown';
import { BookingTypeDropdown } from './BookingTypeDropdown';
import { BookingOwnerSelect } from './BookingOwnerSelect';

interface BookingFiltersBarProps {
  filters: BookingFilters;
  onFiltersChange: (filters: BookingFilters) => void;
  onReset: () => void;
}

export const BookingFiltersBar = ({
  filters,
  onFiltersChange,
  onReset,
}: BookingFiltersBarProps) => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [advancedOwners, setAdvancedOwners] = useState<AdvancedOwnerFilter>({ primaryOwners: [], secondaryOwners: [] });

  return (
    <div className="px-6 py-5">
      <div className="flex items-end justify-between min-w-max gap-8 w-full">
        
        {/* Left side: Filters */}
        <div className="flex items-end gap-4">
          {/* Booking Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-gray-700">Booking Date</label>
            <DateTypeFilterDropdown hideTypeSelector>
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-[14px] cursor-pointer hover:border-gray-300 transition-colors">
                <span className="text-[13px] text-gray-400">Start Date</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[13px] text-gray-400">End Date</span>
                <CalendarIcon className="w-4 h-4 text-gray-400 ml-2" />
              </div>
            </DateTypeFilterDropdown>
          </div>

          {/* Travel Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-gray-700">Travel Date</label>
            <DateTypeFilterDropdown hideTypeSelector>
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-[14px] cursor-pointer hover:border-gray-300 transition-colors">
                <span className="text-[13px] text-gray-400">Start Date</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[13px] text-gray-400">End Date</span>
                <CalendarIcon className="w-4 h-4 text-gray-400 ml-2" />
              </div>
            </DateTypeFilterDropdown>
          </div>

          {/* Booking Owner */}
          <div className="flex flex-col gap-1.5">
            <BookingOwnerSelect 
              selected={filters.bookingOwners || []}
              advanced={advancedOwners}
              isAdvancedMode={isAdvancedMode}
              onChangeSelected={(bookingOwners) => onFiltersChange({ ...filters, bookingOwners })}
              onChangeAdvanced={setAdvancedOwners}
              onToggleAdvanced={setIsAdvancedMode}
              onApply={() => {}}
              onReset={() => {
                onFiltersChange({ ...filters, bookingOwners: [] });
                setAdvancedOwners({ primaryOwners: [], secondaryOwners: [] });
              }}
            />
          </div>

          {/* Booking Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-gray-700">Booking Type</label>
            <BookingTypeDropdown />
          </div>
        </div>

        {/* Right side: Search & Refresh */}
        <div className="flex items-center gap-3">
          <div className="relative w-[340px]">
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              placeholder="Search by ID / Lead Pax / Amount"
              className="w-full pl-5 pr-12 py-2.5 bg-white border border-gray-200 rounded-[14px] text-[14px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#6C2BD9] placeholder:text-gray-400"
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
          </div>
          <button className="flex items-center justify-center w-[42px] h-[42px] bg-white border border-gray-200 rounded-[14px] text-gray-500 hover:bg-gray-50 shadow-sm shrink-0">
            <RefreshCw className="w-[18px] h-[18px]" />
          </button>
        </div>

      </div>
    </div>
  );
};
