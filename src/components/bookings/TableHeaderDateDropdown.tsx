import { useState, useRef, useEffect } from 'react';
import { Filter, ArrowUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const TableHeaderDateDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'travel' | 'booking'>('travel');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative inline-flex items-center" ref={ref}>
      <div className="flex items-center gap-1.5 hover:text-gray-700 transition-colors cursor-pointer">
        {selectedType === 'travel' ? 'Travel Date' : 'Booking Date'}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center justify-center p-0.5 rounded hover:bg-gray-100 transition-colors",
            isOpen && "bg-gray-100"
          )}
        >
          <Filter className="w-3 h-3 text-gray-400" />
        </button>
        <ArrowUpDown className="w-3 h-3 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden flex flex-col font-medium py-1">
          <button
            onClick={() => {
              setSelectedType('travel');
              setIsOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors w-full text-left"
          >
            <div className={cn("w-5 h-5 rounded flex items-center justify-center border transition-colors shrink-0", selectedType === 'travel' ? "bg-[#6C2BD9] border-[#6C2BD9]" : "border-gray-300 bg-white")}>
              {selectedType === 'travel' && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
            </div>
            <span className="text-[13px] text-gray-700">Travel Date</span>
          </button>
          
          <button
            onClick={() => {
              setSelectedType('booking');
              setIsOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors w-full text-left"
          >
            <div className={cn("w-5 h-5 rounded flex items-center justify-center border transition-colors shrink-0", selectedType === 'booking' ? "bg-[#6C2BD9] border-[#6C2BD9]" : "border-gray-300 bg-white")}>
              {selectedType === 'booking' && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
            </div>
            <span className="text-[13px] text-gray-700">Booking Date</span>
          </button>
        </div>
      )}
    </div>
  );
};
