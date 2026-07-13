import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActiveTab } from '@/hooks/useBookings';

type ApprovalSubTab = 'all' | 'pending' | 'approved' | 'rejected';

interface BookingTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  approvalSubTab: ApprovalSubTab;
  onApprovalSubTabChange: (tab: ApprovalSubTab) => void;
  counts: any;
  totalBookings: number;
}

export const BookingTabs = ({
  activeTab,
  onTabChange,
  approvalSubTab,
  onApprovalSubTabChange,
}: BookingTabsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mainTabs = [
    { id: 'bookings' as ActiveTab, label: 'Bookings' },
    { id: 'deleted' as ActiveTab, label: 'Deleted' },
    { id: 'waitingForApproval' as ActiveTab, label: 'Waiting for Approval' },
  ];

  return (
    <div className="border-b border-gray-100 flex items-center justify-between pr-6">
      <div className="flex items-center px-6 gap-12">
        {mainTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div key={tab.id} className="flex items-center">
              <button
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'relative flex items-center py-4 text-[13px] font-semibold transition-colors border-b-2 whitespace-nowrap',
                  isActive
                    ? 'border-[#6C2BD9] text-[#6C2BD9]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                )}
              >
                {tab.label}
              </button>
              {tab.id === 'waitingForApproval' && isActive && (
                <div className="relative ml-6" ref={dropdownRef}>
                  <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between w-[160px] px-4 py-1.5 bg-[#F8F9FB] border border-gray-100 rounded-full text-[13px] text-gray-700 font-medium cursor-pointer hover:bg-gray-100 mb-0.5"
                  >
                    <span className="capitalize">{approvalSubTab || 'All'}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  
                  {isDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-[160px] bg-white border border-gray-200 rounded-[14px] shadow-lg z-50 overflow-hidden">
                      {['all', 'approved', 'pending', 'rejected'].map((option, index, arr) => (
                        <div
                          key={option}
                          onClick={() => {
                            if (onApprovalSubTabChange) onApprovalSubTabChange(option as ApprovalSubTab);
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            'px-4 py-2.5 text-[14px] cursor-pointer hover:bg-gray-50 transition-colors capitalize font-medium',
                            approvalSubTab === option ? 'text-[#6C2BD9]' : 'text-gray-700',
                            index !== arr.length - 1 ? 'border-b border-gray-100' : ''
                          )}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Right side: Show Incomplete Bookings Toggle */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="w-9 h-5 bg-gray-300 rounded-full flex items-center px-0.5 relative transition-colors cursor-pointer hover:bg-gray-400">
            <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 shadow-sm"></div>
          </button>
          <span className="text-[12px] font-medium text-gray-500">Show Incomplete Bookings</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FEF9C3] border border-yellow-200 rounded-full">
          <span className="text-[11px] font-medium text-yellow-800">Total</span>
          <span className="text-[12px] font-bold text-yellow-900">78</span>
        </div>
      </div>
    </div>
  );
};
