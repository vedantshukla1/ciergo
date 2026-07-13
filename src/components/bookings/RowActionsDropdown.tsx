import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Pencil, Trash2, Link as LinkIcon, Copy, RotateCcw, Send } from 'lucide-react';


interface RowActionsDropdownProps {
  hideDelete?: boolean;
  isDeleted?: boolean;
  isEmptyState?: boolean;
  hideLink?: boolean;
  onSendForApproval?: () => void;
}

export const RowActionsDropdown = ({ hideDelete = false, isDeleted = false, isEmptyState = false, hideLink = false, onSendForApproval }: RowActionsDropdownProps) => {
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

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-[30px] h-[30px] bg-white border border-gray-200 rounded-lg text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 w-48 bg-white border border-gray-100 rounded-[14px] shadow-lg z-50 overflow-hidden flex flex-col">
          {isEmptyState ? (
            <>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onSendForApproval?.();
                }}
                className="w-full px-4 py-2.5 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors group"
              >
                <Send className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-gray-700">Send for Approval</span>
              </button>
              <button className="w-full px-4 py-2.5 text-left text-[14px] hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors group">
                <Trash2 className="w-4 h-4 text-[#EF4444]" />
                <span className="font-semibold text-[#EF4444]">Delete</span>
              </button>
              <button className="w-full px-4 py-2.5 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors group">
                <Copy className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-gray-700">Duplicate</span>
              </button>
            </>
          ) : isDeleted ? (
            <>
              <button className="w-full px-4 py-2.5 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors group">
                <RotateCcw className="w-4 h-4 text-gray-500" />
                <span className="font-semibold">Restore</span>
              </button>
              <button className="w-full px-4 py-2.5 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors group">
                <Copy className="w-4 h-4 text-gray-500" />
                <span className="font-semibold">Duplicate</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsOpen(false)} className="w-full px-4 py-2.5 text-left text-[14px] hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors group">
                <Pencil className="w-4 h-4 text-[#3B82F6]" />
                <span className="font-semibold text-[#3B82F6]">Edit</span>
              </button>
              {!hideDelete && (
                <button onClick={() => setIsOpen(false)} className="w-full px-4 py-2.5 text-left text-[14px] hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors group">
                  <Trash2 className="w-4 h-4 text-[#EF4444]" />
                  <span className="font-semibold text-[#EF4444]">Delete</span>
                </button>
              )}
              {!hideLink && (
                <button onClick={() => setIsOpen(false)} className="w-full px-4 py-2.5 text-left text-[14px] hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors group">
                  <LinkIcon className="w-4 h-4 text-[#22C55E]" />
                  <span className="font-semibold text-gray-700">Link</span>
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="w-full px-4 py-2.5 text-left text-[14px] hover:bg-gray-50 flex items-center gap-3 transition-colors group">
                <Copy className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-gray-700">Duplicate</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
