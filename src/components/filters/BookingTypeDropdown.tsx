import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const OPTIONS = [
  { label: 'All Bookings', value: 'all' },
  { label: 'Other Services', value: 'other' },
  { label: 'Limitless', value: 'limitless' },
];

interface BookingTypeDropdownProps {
  value?: string;
  onChange?: (val: string) => void;
}

export const BookingTypeDropdown = ({ value = 'all', onChange }: BookingTypeDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedOption = OPTIONS.find(o => o.value === value.toLowerCase()) || OPTIONS[0];

  return (
    <div className="relative inline-flex items-center w-full" ref={ref}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-[200px] px-4 h-[42px] bg-white border border-gray-200 rounded-[14px] cursor-pointer hover:border-gray-300 transition-colors shadow-sm"
      >
        <span className="text-[14px] text-gray-800 font-medium">{selectedOption.label}</span>
        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[200px] bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col font-medium py-2">
          {OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => {
                onChange?.(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "px-5 py-3 text-left text-[14px] hover:bg-gray-50 transition-colors w-full",
                selectedOption.value === option.value 
                  ? "text-[#6C2BD9] font-bold" 
                  : "text-gray-700 font-medium"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
