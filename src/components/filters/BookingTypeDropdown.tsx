import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const OPTIONS = [
  'All Bookings',
  'Other Services',
  'Limitless'
];

export const BookingTypeDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('All Bookings');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative inline-flex items-center w-full" ref={ref}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-[180px] px-4 py-2 bg-white border border-gray-200 rounded-[14px] cursor-pointer hover:border-gray-300 transition-colors"
      >
        <span className="text-[13px] text-gray-700 font-medium">{selected}</span>
        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[180px] bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden flex flex-col font-medium py-1">
          {OPTIONS.map(option => (
            <button
              key={option}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
              className={cn(
                "px-4 py-2.5 text-left text-[13px] hover:bg-gray-50 transition-colors w-full border-b border-gray-50 last:border-b-0",
                selected === option ? "text-[#6C2BD9]" : "text-gray-700"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
