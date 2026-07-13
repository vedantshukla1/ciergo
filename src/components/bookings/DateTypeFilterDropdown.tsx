import { useState, useRef, useEffect, ReactNode } from 'react';
import { Filter, RotateCcw, Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBookings } from '@/hooks/useBookings';

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
}

export const DateTypeFilterDropdown = ({ children, hideTypeSelector }: DateTypeFilterDropdownProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(hideTypeSelector || false);
  const [selectedType, setSelectedType] = useState<'travel' | 'booking'>('travel');
  const [selectedPreset, setSelectedPreset] = useState('This Month');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        if (!hideTypeSelector) setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const renderCalendar = (monthName: string, startDayOffset: number, daysInMonth: number) => {
    const days = [];
    for (let i = 0; i < startDayOffset; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected = i >= 12 && i <= 18 && monthName === 'March 2025';
      const isEndpoint = i === 12 || i === 18;
      days.push(
        <div 
          key={i} 
          className={cn(
            "w-8 h-8 flex items-center justify-center text-[13px] rounded-full cursor-pointer hover:bg-gray-100",
            isSelected && !isEndpoint && "bg-purple-50 text-purple-700 rounded-none",
            isEndpoint && monthName === 'March 2025' && "bg-[#6C2BD9] text-white font-semibold shadow-sm hover:bg-purple-700",
            !isSelected && "text-gray-700"
          )}
        >
          {i.toString().padStart(2, '0')}
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(day => (
            <div key={day} className="w-8 h-8 flex items-center justify-center text-[13px] font-semibold text-gray-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-2 gap-x-1">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex items-center" ref={ref}>
      <div 
        onClick={() => {
          setIsOpen(!isOpen);
          if (!hideTypeSelector) setShowCalendar(false);
        }}
        className="cursor-pointer"
      >
        {children || (
          <button 
            className={cn(
              "flex items-center justify-center p-1 rounded hover:bg-gray-100 transition-colors",
              isOpen && "bg-gray-100"
            )}
          >
            <Filter className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className={cn(
          "absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col font-medium",
          showCalendar ? "min-w-[760px]" : "w-[220px]"
        )}>
          {!showCalendar ? (
            <>
              <div className="flex flex-col py-2">
                <button 
                  onClick={() => { setSelectedType('travel'); setShowCalendar(true); }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-[13px] text-gray-700 w-full text-left transition-colors"
                >
                  <div className={cn("w-5 h-5 rounded flex items-center justify-center border", selectedType === 'travel' ? "bg-[#6C2BD9] border-[#6C2BD9]" : "border-gray-300 bg-white")}>
                    {selectedType === 'travel' && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </div>
                  Travel Date
                </button>
                <div className="h-[1px] w-full bg-gray-100 my-1"></div>
                <button 
                  onClick={() => { setSelectedType('booking'); setShowCalendar(true); }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-[13px] text-gray-700 w-full text-left transition-colors"
                >
                  <div className={cn("w-5 h-5 rounded flex items-center justify-center border", selectedType === 'booking' ? "bg-[#6C2BD9] border-[#6C2BD9]" : "border-gray-300 bg-white")}>
                    {selectedType === 'booking' && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </div>
                  Booking Date
                </button>
              </div>
              
              <div className="border-t border-gray-100 p-3 flex items-center justify-between bg-white">
                <button 
                  className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 shadow-sm"
                  onClick={() => {}}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setShowCalendar(true)}
                  className="px-6 py-2 bg-[#6C2BD9] text-white text-[13px] font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
                >
                  Apply
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Top selection for Travel/Booking Date */}
              {/* Top selection for Travel/Booking Date */}
              {!hideTypeSelector && (
                <div className="flex items-center p-4 border-b border-gray-100 gap-6 bg-gray-50/50">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={cn("w-5 h-5 rounded flex items-center justify-center border transition-colors", selectedType === 'travel' ? "bg-[#6C2BD9] border-[#6C2BD9]" : "border-gray-300 bg-white group-hover:border-purple-400")}>
                      {selectedType === 'travel' && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </div>
                    <span className="text-[14px] text-gray-700 font-semibold">Travel Date</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={cn("w-5 h-5 rounded flex items-center justify-center border transition-colors", selectedType === 'booking' ? "bg-[#6C2BD9] border-[#6C2BD9]" : "border-gray-300 bg-white group-hover:border-purple-400")}>
                      {selectedType === 'booking' && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </div>
                    <span className="text-[14px] text-gray-700 font-semibold">Booking Date</span>
                  </label>
                </div>
              )}

              <div className="flex bg-white">
                {/* Sidebar Presets */}
                <div className="w-[160px] border-r border-gray-100 p-2 flex flex-col gap-0.5">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setSelectedPreset(preset)}
                      className={cn(
                        "px-4 py-2.5 text-left text-[13px] rounded-lg transition-colors",
                        selectedPreset === preset 
                          ? "bg-purple-50 text-purple-700 font-bold" 
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Calendars */}
                <div className="flex p-6 gap-8">
                  {/* Left Calendar */}
                  <div className="flex flex-col w-[260px]">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-1">
                        <button className="p-1 text-gray-400 hover:text-gray-600"><ChevronsLeft className="w-4 h-4" /></button>
                        <button className="p-1 text-gray-400 hover:text-gray-600"><ChevronLeft className="w-4 h-4" /></button>
                      </div>
                      <span className="font-bold text-gray-800 text-[14px]">March 2025</span>
                      <div className="w-10"></div> {/* Spacer for symmetry */}
                    </div>
                    {renderCalendar('March 2025', 6, 31)}
                  </div>

                  {/* Right Calendar */}
                  <div className="flex flex-col w-[260px]">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10"></div> {/* Spacer for symmetry */}
                      <span className="font-bold text-gray-800 text-[14px]">April 2025</span>
                      <div className="flex items-center gap-1">
                        <button className="p-1 text-gray-400 hover:text-gray-600"><ChevronRight className="w-4 h-4" /></button>
                        <button className="p-1 text-gray-400 hover:text-gray-600"><ChevronsRight className="w-4 h-4" /></button>
                      </div>
                    </div>
                    {renderCalendar('April 2025', 2, 30)}
                  </div>
                </div>
              </div>
              

            </>
          )}
        </div>
      )}
    </div>
  );
};
