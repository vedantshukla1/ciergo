import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { TimelineBookingCard } from './TimelineBookingCard';
import type { BookingType } from './TimelineBookingCard';

const DAYS = [
  { day: 'Wed', date: '05 Mar', os: 2, limitless: 0 },
  { day: 'Thu', date: '06 Mar', os: 1, limitless: 1, current: true },
  { day: 'Fri', date: '07 Mar', os: 2, limitless: 0 },
  { day: 'Sat', date: '08 Mar', os: 2, limitless: 0 },
  { day: 'Sun', date: '09 Mar', os: 2, limitless: 0 },
];

const HOURS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// Mapping grid coordinates [dayIndex, hourIndex]
const MOCK_EVENTS = [
  // Wed
  { day: 0, hour: 0, id: 'OS-ABC12', type: 'Flight' as BookingType, time: '09:00', route: 'DEL → DXB', status: 'Completed' },
  { day: 0, hour: 3, id: 'OS-ABC14', type: 'Hotel' as BookingType, time: '12:00', route: '4 Star', status: 'Cancelled' },
  // Thu
  { day: 1, hour: 2, id: 'OS-ABC12', type: 'Flight' as BookingType, time: '11:00', route: 'Explore UAE', status: 'Completed' },
  // Fri
  { day: 2, hour: 0, id: 'OS-ABC12', type: 'Flight' as BookingType, time: '09:00', route: 'DEL → DXB', status: 'Completed' },
  { day: 2, hour: 3, id: 'OS-ABC16', type: 'Transport' as BookingType, time: '12:30', route: 'Hotel Transfer', status: 'Completed' },
  { day: 2, hour: 7, id: 'OS-ABC12', type: 'Flight' as BookingType, time: '16:00', route: 'DEL → DXB', status: 'Completed' },
  // Sat
  { day: 3, hour: 1, id: 'OS-ABC12', type: 'Flight' as BookingType, time: '10:00', route: 'DEL → DXB', status: 'Completed' },
  { day: 3, hour: 5, id: 'OS-ABC16', type: 'Transport' as BookingType, time: '14:30', route: 'Hotel Transfer', status: 'Completed' },
  // Sun
  { day: 4, hour: 2, id: 'OS-ABC12', type: 'Flight' as BookingType, time: '11:00', route: 'DEL → DXB', status: 'Completed' },
];

export const BookingTimelineCalendar = () => {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-100 flex-1 w-full overflow-visible">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <h2 className="text-[15px] font-bold text-gray-900">Bookings Timeline</h2>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-[12px] hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-[13px] font-medium text-gray-700">Filter</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-1.5 border border-gray-100">
            <button className="p-1 hover:bg-gray-200 rounded-full transition-colors"><ChevronLeft className="w-4 h-4 text-gray-600" /></button>
            <span className="text-[13px] font-bold text-gray-800">05 Mar '25 - 14 Mar '25</span>
            <button className="p-1 hover:bg-gray-200 rounded-full transition-colors"><ChevronRight className="w-4 h-4 text-gray-600" /></button>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm">
            <span className="text-[11px] font-medium text-gray-500">Total</span>
            <span className="text-[12px] font-bold text-gray-800">18</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-[12px] font-medium">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#22C55E]"></div><span className="text-gray-400">Completed</span> <span className="text-gray-800 font-bold">14</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div><span className="text-gray-400">On Trip</span> <span className="text-gray-800 font-bold">3</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div><span className="text-gray-400">Upcoming</span> <span className="text-gray-800 font-bold">0</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#EF4444]"></div><span className="text-gray-400">Cancelled</span> <span className="text-gray-800 font-bold">1</span></div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative">
        <div className="min-w-[1000px] border-t border-gray-100">
          
          {/* Days Header */}
          <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-gray-100">
            <div className="p-4 border-r border-gray-100 bg-white sticky left-0 z-20"></div>
            {DAYS.map((d, i) => (
              <div key={i} className="px-4 py-3 flex flex-col items-center justify-center border-r border-gray-100 last:border-r-0 relative">
                {d.current && <div className="absolute top-0 left-0 right-0 h-1 bg-[#3B82F6]"></div>}
                <div className="text-[13px]">
                  <span className="text-gray-500 font-medium">{d.day}, </span>
                  <span className="text-gray-900 font-bold">{d.date}</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px] font-medium">
                  <div className="flex items-center gap-1.5"><span className="text-gray-400 uppercase">OS</span> <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">{d.os}</span></div>
                  <div className="flex items-center gap-1.5"><span className="text-gray-400 uppercase">Limitless</span> <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">{d.limitless}</span></div>
                </div>
              </div>
            ))}
          </div>

          {/* Time Rows */}
          <div className="relative">
            {HOURS.map((hour, hIdx) => (
              <div key={hour} className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] min-h-[90px] group relative">
                {/* Current time line mock (full width at 13:00) */}
                {hIdx === 4 && (
                   <div className="absolute top-1/2 left-[80px] right-0 h-[2px] bg-[#3B82F6] z-10 pointer-events-none">
                     <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#3B82F6]"></div>
                   </div>
                )}
                {/* Time Label */}
                <div className="p-4 text-[11px] font-semibold text-gray-400 border-r border-b border-gray-100 bg-white sticky left-0 z-20 flex justify-center pt-4">
                  {hour}
                </div>
                {/* Day Cells */}
                {DAYS.map((d, dIdx) => {
                  const event = MOCK_EVENTS.find(e => e.day === dIdx && e.hour === hIdx);
                  return (
                    <div key={dIdx} className="border-r border-b border-gray-100 last:border-r-0 relative p-2 transition-colors hover:bg-gray-50/30">
                      
                      {event && (
                        <div className="relative z-10 h-full max-w-[240px]">
                          <TimelineBookingCard {...event} status={event.status as any} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};
