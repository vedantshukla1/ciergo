import { useState, useRef, useEffect } from 'react';
import { ChevronDown, MousePointerClick, Upload, MoreHorizontal } from 'lucide-react';

interface TopActionsDropdownProps {
  isSelectMode?: boolean;
  setIsSelectMode?: (val: boolean) => void;
  onSelectAll?: () => void;
}

export const TopActionsDropdown = ({ isSelectMode = false, setIsSelectMode, onSelectAll }: TopActionsDropdownProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isSelectMode) {
    return (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setIsSelectMode?.(false)}
          className="px-4 py-2 text-[14px] font-bold text-gray-700 bg-white border border-gray-200 rounded-[14px] shadow-sm hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={() => onSelectAll?.()}
          className="px-4 py-2 text-[14px] font-bold text-gray-700 bg-white border border-gray-200 rounded-[14px] shadow-sm hover:bg-gray-50 transition-colors"
        >
          Select all
        </button>
        <button className="flex items-center justify-center w-9 h-9 bg-white border border-gray-200 rounded-[14px] shadow-sm hover:bg-gray-50 transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center bg-white border border-purple-200 rounded-xl shadow-sm hover:border-purple-300 transition-colors cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <button className="px-4 py-2 text-[14px] font-bold text-gray-700 rounded-l-xl focus:outline-none">
          More Actions
        </button>
        <div className="w-[1px] h-6 bg-purple-200"></div>
        <button className="px-3 py-2 text-gray-700 rounded-r-xl focus:outline-none">
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 overflow-hidden py-1">
          <button 
            className="w-full px-4 py-2.5 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-3"
            onClick={() => {
              setIsOpen(false);
              setIsSelectMode?.(true);
            }}
          >
            <MousePointerClick className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Select</span>
          </button>
          <div className="w-full h-[1px] bg-gray-100"></div>
          <button 
            className="w-full px-4 py-2.5 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-3"
            onClick={() => setIsOpen(false)}
          >
            <Upload className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Upload</span>
          </button>
        </div>
      )}
    </div>
  );
};
