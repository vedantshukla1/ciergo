import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: React.ReactNode;
  confirmText: string;
  cancelText?: string;
  type?: 'approve' | 'reject' | 'send_for_approval';
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText,
  cancelText = 'Cancel',
  type = 'approve'
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-[440px] w-full mx-4 shadow-xl border border-gray-100 flex flex-col gap-8">
        <p className="text-[15px] text-gray-700 leading-relaxed font-medium">
          {title}
        </p>

        <div className="flex items-center justify-between mt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors bg-white shadow-sm"
          >
            {cancelText}
          </button>
          
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn(
              "px-6 py-2.5 rounded-xl text-white font-bold transition-colors shadow-sm",
              type === 'approve' 
                ? "bg-[#389E3D] hover:bg-green-700" 
                : type === 'send_for_approval'
                  ? "bg-[#713197] hover:bg-purple-800"
                  : "bg-[#D91B2A] hover:bg-red-700"
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
