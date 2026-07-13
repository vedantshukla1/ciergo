import { useState, useRef, useEffect } from 'react';
import { Filter, RotateCcw, Check, Plane, Building2, Bus, Ticket, Activity, CreditCard, Shield, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBookings } from '@/hooks/useBookings';
import type { ServiceType } from '@/types/booking.types';

const SERVICES_LIST: { id: ServiceType; label: string; icon: any }[] = [
  { id: 'flight', label: 'Flight', icon: Plane },
  { id: 'accommodation', label: 'Accommodation', icon: Building2 },
  { id: 'transportationLand', label: 'Transportation (Land)', icon: Bus },
  { id: 'ticketAttraction', label: 'Ticket (Attraction)', icon: Ticket },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'visa', label: 'Visa', icon: CreditCard },
  { id: 'travelInsurance', label: 'Travel Insurance', icon: Shield },
  { id: 'others', label: 'Others', icon: LayoutGrid },
];

export const ServiceFilterDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { filters, setFilters } = useBookings();
  const ref = useRef<HTMLDivElement>(null);

  const filterState = filters.serviceFilter || { otherServices: [], limitless: false, selectAll: false };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleService = (id: ServiceType) => {
    setFilters({
      ...filters,
      serviceFilter: {
        ...filterState,
        otherServices: filterState.otherServices.includes(id)
          ? filterState.otherServices.filter(s => s !== id)
          : [...filterState.otherServices, id]
      }
    });
  };

  const toggleAllServices = () => {
    const allSelected = filterState.otherServices.length === SERVICES_LIST.length;
    setFilters({
      ...filters,
      serviceFilter: {
        ...filterState,
        otherServices: allSelected ? [] : SERVICES_LIST.map(s => s.id)
      }
    });
  };

  const toggleLimitless = () => {
    setFilters({
      ...filters,
      serviceFilter: {
        ...filterState,
        limitless: !filterState.limitless
      }
    });
  };

  const deselectAll = () => {
    setFilters({
      ...filters,
      serviceFilter: { otherServices: [], limitless: false, selectAll: false }
    });
  };

  const allServicesSelected = filterState.otherServices.length === SERVICES_LIST.length && SERVICES_LIST.length > 0;
  const isIndeterminate = filterState.otherServices.length > 0 && !allServicesSelected;

  return (
    <div className="relative inline-block" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center p-1 rounded hover:bg-gray-100 transition-colors",
          isOpen && "bg-gray-100"
        )}
      >
        <Filter className="w-3 h-3 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[280px] bg-white border border-gray-200 rounded-[14px] shadow-lg z-50 overflow-hidden flex flex-col font-medium max-h-[80vh]">
          <div className="flex flex-col overflow-y-auto custom-scrollbar">
            
            {/* OTHER SERVICES Group */}
            <div className="p-4 border-b border-gray-100">
              <button 
                onClick={toggleAllServices}
                className="flex items-center gap-3 text-[13px] text-gray-600 font-semibold uppercase tracking-wide mb-3 hover:text-gray-900 w-full text-left"
              >
                <div className={cn("w-5 h-5 rounded flex items-center justify-center border shrink-0", allServicesSelected || isIndeterminate ? "bg-[#6C2BD9] border-[#6C2BD9]" : "border-gray-300 bg-white")}>
                  {(allServicesSelected || isIndeterminate) && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </div>
                OTHER SERVICES
              </button>
              
              <div className="flex flex-col gap-1 pl-1">
                {SERVICES_LIST.map((service) => {
                  const Icon = service.icon;
                  const isSelected = filterState.otherServices.includes(service.id);
                  return (
                    <button 
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className="flex items-center gap-3 py-2 px-3 hover:bg-gray-50 rounded-lg text-[13px] text-gray-700 w-full text-left transition-colors"
                    >
                      <div className={cn("w-5 h-5 rounded flex items-center justify-center border shrink-0", isSelected ? "bg-[#6C2BD9] border-[#6C2BD9]" : "border-gray-300 bg-white")}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </div>
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span>{service.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LIMITLESS Option */}
            <button 
              onClick={toggleLimitless}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 text-[13px] text-gray-600 font-semibold uppercase tracking-wide w-full text-left transition-colors"
            >
              <div className={cn("w-5 h-5 rounded flex items-center justify-center border shrink-0", filterState.limitless ? "bg-[#6C2BD9] border-[#6C2BD9]" : "border-gray-300 bg-white")}>
                {filterState.limitless && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
              </div>
              LIMITLESS
            </button>
          </div>
          
          <div className="border-t border-gray-100 p-3 flex items-center justify-between bg-white shrink-0">
            <button 
              onClick={deselectAll}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-600 font-bold text-[13px] rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              Deselect All
            </button>
            <div className="flex items-center gap-2">
              <button 
                onClick={deselectAll}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-[#6C2BD9] text-white text-[13px] font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
