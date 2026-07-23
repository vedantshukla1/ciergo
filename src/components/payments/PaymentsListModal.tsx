import React, { useState } from 'react';
import { X, Eye, Pencil } from 'lucide-react';
import type { PaymentRecord } from '../../api/payments';
import { RecordPaymentSidesheet } from './RecordPaymentSidesheet';

interface PaymentsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  payments: PaymentRecord[];
}

export const PaymentsListModal: React.FC<PaymentsListModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  payments
}) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [isSidesheetOpen, setIsSidesheetOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  if (!isOpen && !isSidesheetOpen) return null;

  const handleView = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setIsEditMode(false);
    setIsReadOnly(true);
    setIsSidesheetOpen(true);
  };

  const handleEdit = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setIsEditMode(true);
    setIsReadOnly(false);
    setIsSidesheetOpen(true);
  };

  return (
    <>
      {isOpen && !isSidesheetOpen && (
        <div className="fixed inset-0 bg-black/30 z-[90] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-[18px] font-bold text-gray-900">Recorded Payments</h2>
                <p className="text-[13px] text-gray-500 mt-1">Booking ID: {bookingId}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              {payments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No payments recorded yet for this booking.
                </div>
              ) : (
                <table className="w-full text-left text-[13px]">
                  <thead className="text-gray-500 border-b border-gray-100">
                    <tr>
                      <th className="pb-3 font-semibold">Payment ID</th>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Amount</th>
                      <th className="pb-3 font-semibold">Mode</th>
                      <th className="pb-3 font-semibold">Type</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p: any) => {
                      const pId = p.paymentId || p.PaymentID || 'PI-0001';
                      const pDate = p.date || p.paymentDate || p.createdAt?.split('T')[0] || '2026-07-23';
                      const pMode = p.mode || p.paymentMode || 'Cash';
                      const pType = (p.type || p.CustomerORVendor || p.Type || 'Customer').toLowerCase().includes('vendor') ? 'Vendor' : 'Customer';
                      const pCurr = p.currency || 'INR';
                      const pAmt = Number(p.amount || 0).toLocaleString('en-IN');

                      return (
                      <tr key={p.id || pId} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 font-medium text-gray-900">{pId}</td>
                        <td className="py-4 text-gray-600">{pDate}</td>
                        <td className="py-4 font-semibold text-gray-900">{pCurr} {pAmt}</td>
                        <td className="py-4 text-gray-600">{pMode}</td>
                        <td className="py-4 text-gray-600">
                           <span className={`px-2 py-1 rounded-md text-[11px] font-semibold ${pType === 'Customer' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>
                             {pType}
                           </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleView(p)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleEdit(p)} className="p-1.5 text-purple-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors" title="Edit">
                              <Pencil className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {isSidesheetOpen && selectedPayment && (
        <RecordPaymentSidesheet
          isOpen={isSidesheetOpen}
          onClose={() => setIsSidesheetOpen(false)}
          bookingId={bookingId}
          outstandingDue={selectedPayment.amount} // dummy value for view/edit mode
          initialPartyType={selectedPayment.type}
          initialPartyName={selectedPayment.partyName}
          editMode={isEditMode}
          isReadOnly={isReadOnly}
          paymentRecord={selectedPayment}
        />
      )}
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};
