import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Clock, Edit2, Trash2, ArrowDownLeft, ArrowUpRight, RotateCcw, RefreshCw, Plane, Building, Car } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BookingType = 'Flight' | 'Hotel' | 'Transport';

interface TimelineBookingCardProps {
  id: string;
  type: BookingType;
  time: string;
  route: string;
  status: 'Completed' | 'Upcoming' | 'On Trip' | 'Cancelled' | 'Pending';
  colSpan?: number;
}

export const TimelineBookingCard = ({
  id,
  type,
  time,
  route,
  status,
  colSpan = 1,
}: TimelineBookingCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Completed': return 'bg-[#22C55E]'; // green
      case 'On Trip': return 'bg-[#F59E0B]'; // orange
      case 'Upcoming': return 'bg-[#3B82F6]'; // blue
      case 'Cancelled': return 'bg-[#EF4444]'; // red
      case 'Pending': return 'bg-[#EAB308]'; // yellow
      default: return 'bg-gray-300';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'Flight': return <Plane className="w-3.5 h-3.5 text-[#6C2BD9]" />;
      case 'Hotel': return <Building className="w-3.5 h-3.5 text-[#6C2BD9]" />;
      case 'Transport': return <Car className="w-3.5 h-3.5 text-[#6C2BD9]" />;
    }
  };

  const isFaded = status === 'Cancelled' || type === 'Hotel'; // Mock styling to match screenshot "OS-ABC14 Hotel"

  return (
    <div 
      className={cn(
        "relative bg-white border border-gray-100 rounded-[12px] p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow",
        isFaded && "opacity-60",
        `col-span-${colSpan}`
      )}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className={cn("w-2 h-2 rounded-full", getStatusColor(status))} />
          <span className="text-[13px] font-bold text-gray-800">{id}</span>
          <div className="flex items-center gap-1.5 ml-2">
            {getIcon()}
            <span className="text-[12px] font-semibold text-gray-900">{type}</span>
          </div>
        </div>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50">
              <button className="w-full px-4 py-2 text-left text-[13px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                <ArrowDownLeft className="w-4 h-4 text-[#22C55E]" />
                You Got
              </button>
              <button className="w-full px-4 py-2 text-left text-[13px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                <ArrowUpRight className="w-4 h-4 text-[#EF4444]" />
                You Gave
              </button>
              <button className="w-full px-4 py-2 text-left text-[13px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-gray-500" />
                Reschedule
              </button>
              <button className="w-full px-4 py-2 text-left text-[13px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-gray-500" />
                Change Status
              </button>
              <button className="w-full px-4 py-2 text-left text-[13px] font-medium text-[#6C2BD9] hover:bg-purple-50 flex items-center gap-2.5">
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button className="w-full px-4 py-2 text-left text-[13px] font-medium text-[#EF4444] hover:bg-red-50 flex items-center gap-2.5">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-[12px] font-medium">{time}</span>
        </div>
        <span className="text-[12px] font-semibold text-gray-700">{route}</span>
      </div>
    </div>
  );
};
