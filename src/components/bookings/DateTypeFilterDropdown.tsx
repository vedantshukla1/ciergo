import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Calendar as CalendarIcon, ArrowRight, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DateRange } from '@/types/filter.types';

const PRESETS = [
  'Today',
  'Yesterday',
  'This Week',
  'Last Week',
  'This Month',
  'Last Month',
  'Last 30 Days',
  'This Year'
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface DateTypeFilterDropdownProps {
  children?: ReactNode;
  hideTypeSelector?: boolean;
  value?: DateRange;
  onChange?: (range: DateRange) => void;
}

export const DateTypeFilterDropdown = ({
  children,
  value,
  onChange,
}: DateTypeFilterDropdownProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handlePresetSelect = (preset: string) => {
    if (selectedPreset === preset) {
      setSelectedPreset(null);
      onChange?.({ from: undefined, to: undefined });
      setIsOpen(false);
      return;
    }

    setSelectedPreset(preset);
    const now = new Date();
    let from: Date | undefined;
    let to: Date | undefined;

    if (preset === 'Today') {
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (preset === 'Yesterday') {
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    } else if (preset === 'This Week') {
      const day = now.getDay();
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - day));
    } else if (preset === 'Last Week') {
      const day = now.getDay();
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day - 7);
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day - 1);
    } else if (preset === 'This Month') {
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (preset === 'Last Month') {
      from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      to = new Date(now.getFullYear(), now.getMonth(), 0);
    } else if (preset === 'Last 30 Days') {
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      to = new Date();
    } else if (preset === 'This Year') {
      from = new Date(now.getFullYear(), 0, 1);
      to = new Date(now.getFullYear(), 11, 31);
    }

    onChange?.({ from, to });
    setIsOpen(false);
  };

  const renderCalendarMonth = (monthName: string, startDayOffset: number, daysInMonth: number, prevMonthDays: number) => {
    const days = [];
    
    // Leading prev month days
    for (let i = startDayOffset - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="w-8 h-8 flex items-center justify-center text-[13px] text-gray-300 font-normal">
          {(prevMonthDays - i).toString().padStart(2, '0')}
        </div>
      );
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = i.toString().padStart(2, '0');
      days.push(
        <div 
          key={`curr-${i}`} 
          className="w-8 h-8 flex items-center justify-center text-[13px] text-gray-800 font-semibold cursor-pointer hover:bg-purple-50 rounded-full transition-colors"
        >
          {dayStr}
        </div>
      );
    }

    // Trailing next month days to complete 6 rows (42 cells total)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push(
        <div key={`next-${i}`} className="w-8 h-8 flex items-center justify-center text-[13px] text-gray-300 font-normal">
          {i.toString().padStart(2, '0')}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((day) => (
            <div key={day} className="w-8 h-8 flex items-center justify-center text-[13px] font-bold text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 gap-y-2">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex items-center" ref={ref}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {children || (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-[14px] cursor-pointer hover:border-gray-300 transition-colors shadow-sm w-[230px]">
            <span className="text-[14px] text-gray-400">Start Date</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[14px] text-gray-400">End Date</span>
            <CalendarIcon className="w-4 h-4 text-gray-400 ml-auto" />
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden flex min-w-[720px] font-sans">
          
          {/* Left Sidebar Presets */}
          <div className="w-[170px] border-r border-gray-100 p-4 flex flex-col gap-2 shrink-0 bg-white">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => handlePresetSelect(preset)}
                className={cn(
                  "px-3 py-2 text-left text-[14px] rounded-lg transition-colors font-semibold",
                  selectedPreset === preset
                    ? "bg-purple-50 text-[#6C2BD9]"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Right Dual Calendars */}
          <div className="flex p-6 gap-8 flex-1 bg-white">
            
            {/* Left Calendar (March 2025) */}
            <div className="flex flex-col w-[240px]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-400">
                  <ChevronsLeft className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                  <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                </div>
                <span className="font-bold text-gray-900 text-[15px]">March 2025</span>
                <div className="w-8"></div>
              </div>
              {renderCalendarMonth('March 2025', 6, 31, 28)}
            </div>

            {/* Vertical Separator */}
            <div className="w-[1px] bg-gray-100 self-stretch"></div>

            {/* Right Calendar (April 2025) */}
            <div className="flex flex-col w-[240px]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <div className="w-8"></div>
                <span className="font-bold text-gray-900 text-[15px]">April 2025</span>
                <div className="flex items-center gap-2 text-gray-400">
                  <ChevronRight className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                  <ChevronsRight className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                </div>
              </div>
              {renderCalendarMonth('April 2025', 2, 30, 31)}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
