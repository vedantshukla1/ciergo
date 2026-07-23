import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, ChevronDown, ChevronRight, File as FileIcon } from 'lucide-react';
import { usePayments } from '../../hooks/usePayments';
import type { PaymentRecord } from '../../api/payments';

interface RecordPaymentSidesheetProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  outstandingDue: number;
  initialPartyType?: 'Customer' | 'Vendor';
  initialPartyName?: string;
  editMode?: boolean;
  isReadOnly?: boolean;
  paymentRecord?: PaymentRecord; // If editing
}

export const RecordPaymentSidesheet: React.FC<RecordPaymentSidesheetProps> = ({
  isOpen,
  onClose,
  bookingId,
  outstandingDue,
  initialPartyType = 'Customer',
  initialPartyName = '',
  editMode = false,
  isReadOnly = false,
  paymentRecord
}) => {
  const { createPayment, updatePayment } = usePayments();

  const [partyType, setPartyType] = useState<'Customer' | 'Vendor'>(initialPartyType);
  const [partyName, setPartyName] = useState(initialPartyName);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState(outstandingDue.toString());
  const [currency, setCurrency] = useState('INR');
  const [mode, setMode] = useState<'Cash' | 'Bank Transfer' | 'UPI' | 'Cheque' | 'Card'>('Cash');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [isAdvance, setIsAdvance] = useState(false);
  const [documentName, setDocumentName] = useState('');

  // Collapsible sections
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositRef, setDepositRef] = useState('');

  const [showCashback, setShowCashback] = useState(false);
  const [cashbackAmount, setCashbackAmount] = useState('');
  const [cashbackRef, setCashbackRef] = useState('');

  const [showBankCharges, setShowBankCharges] = useState(false);
  const [bankChargesAmount, setBankChargesAmount] = useState('');
  const [bankChargesRef, setBankChargesRef] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [autoPaymentId, setAutoPaymentId] = useState('');

  const generatePaymentId = (type: 'Customer' | 'Vendor') => {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = '23456789';
    let chars = [
      letters[Math.floor(Math.random() * letters.length)],
      letters[Math.floor(Math.random() * letters.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
    ];
    const all = letters + numbers;
    chars.push(all[Math.floor(Math.random() * all.length)]);
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return `${type === 'Customer' ? 'PI' : 'PO'}-${chars.join('')}`;
  };

  useEffect(() => {
    if (isOpen) {
      if (editMode && paymentRecord) {
        setAutoPaymentId(paymentRecord.paymentId);
        setPartyType(paymentRecord.type);
        setPartyName(paymentRecord.partyName);
        setDate(paymentRecord.date);
        setAmount(paymentRecord.amount.toString());
        setCurrency(paymentRecord.currency);
        setMode(paymentRecord.mode);
        setReference(paymentRecord.reference || '');
        setNotes(paymentRecord.notes || '');
        setIsAdvance(paymentRecord.isAdvance || false);
        setDocumentName(paymentRecord.documentName || '');

        if (paymentRecord.deposit) {
          setShowDeposit(true);
          setDepositAmount(paymentRecord.deposit.amount.toString());
          setDepositRef(paymentRecord.deposit.reference || '');
        } else { setShowDeposit(false); }
        
        if (paymentRecord.cashback) {
          setShowCashback(true);
          setCashbackAmount(paymentRecord.cashback.amount.toString());
          setCashbackRef(paymentRecord.cashback.reference || '');
        } else { setShowCashback(false); }

        if (paymentRecord.bankCharges) {
          setShowBankCharges(true);
          setBankChargesAmount(paymentRecord.bankCharges.amount.toString());
          setBankChargesRef(paymentRecord.bankCharges.reference || '');
        } else { setShowBankCharges(false); }
      } else {
        // Create mode
        const generated = generatePaymentId(initialPartyType);
        setAutoPaymentId(generated);
        setPartyType(initialPartyType);
        setPartyName(initialPartyName);
        setDate(new Date().toISOString().split('T')[0]);
        setAmount(outstandingDue.toString());
        setCurrency('INR');
        setMode('Cash');
        setReference('');
        setNotes('');
        setIsAdvance(false);
        setDocumentName('');
        setShowDeposit(false);
        setShowCashback(false);
        setShowBankCharges(false);
      }
      setError('');
    }
  }, [isOpen, editMode, paymentRecord, initialPartyType, initialPartyName, outstandingDue]);

  // Update autoPaymentId prefix when partyType changes in create mode
  const handlePartyTypeChange = (newType: 'Customer' | 'Vendor') => {
    setPartyType(newType);
    if (!editMode) {
      setAutoPaymentId(generatePaymentId(newType));
    }
  };

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocumentName(e.target.files[0].name);
    }
  };

  const handleAdvanceClick = () => {
    if (window.confirm('Are you sure you want to record this as an advance payment?')) {
      setIsAdvance(true);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const payload: any = {
        paymentId: (editMode && paymentRecord) ? paymentRecord.paymentId : (autoPaymentId || generatePaymentId(partyType)),
        bookingId,
        type: partyType,
        partyName,
        date,
        amount: parseFloat(amount) || 0,
        currency,
        mode,
        reference,
        notes,
        isAdvance,
        documentName
      };

      if (showDeposit && depositAmount) {
        payload.deposit = { amount: parseFloat(depositAmount), reference: depositRef };
      }
      if (showCashback && cashbackAmount) {
        payload.cashback = { amount: parseFloat(cashbackAmount), reference: cashbackRef };
      }
      if (showBankCharges && bankChargesAmount) {
        payload.bankCharges = { amount: parseFloat(bankChargesAmount), reference: bankChargesRef };
      }

      if (editMode && paymentRecord) {
        await updatePayment(paymentRecord.id, payload);
      } else {
        await createPayment(payload);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[100] transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-[450px] bg-white shadow-2xl z-[110] flex flex-col transform transition-transform overflow-y-auto animate-slide-in">
        <div className="flex flex-col border-b border-gray-100 p-6">
          <div className="flex justify-between items-center mb-1">
            <div>
              <h2 className="text-[18px] font-bold text-gray-900">
                {autoPaymentId}
              </h2>
              <span className={`text-[12px] font-semibold ${isReadOnly ? 'text-gray-500' : 'text-purple-700'}`}>
                {isReadOnly ? 'Payment Details (Read Only)' : editMode ? 'Edit Payment Record' : 'Record Payment'}
              </span>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[13px] text-gray-500 font-medium">Booking ID: {bookingId}</p>
        </div>

        <div className="flex-1 p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* Party Type */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="partyType" 
                disabled={isReadOnly}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500 disabled:opacity-50" 
                checked={partyType === 'Customer'}
                onChange={() => handlePartyTypeChange('Customer')}
              />
              <span className="text-[14px] font-medium text-gray-700">Customer</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="partyType" 
                disabled={isReadOnly}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500 disabled:opacity-50" 
                checked={partyType === 'Vendor'}
                onChange={() => handlePartyTypeChange('Vendor')}
              />
              <span className="text-[14px] font-medium text-gray-700">Vendor</span>
            </label>
          </div>

          <div>
            <input 
              type="text" 
              disabled={isReadOnly}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 disabled:opacity-75 disabled:bg-gray-100"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              placeholder="Party Name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-700">Payment Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  disabled={isReadOnly}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 disabled:opacity-75 disabled:bg-gray-50"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-700">Amount</label>
              <input 
                type="number" 
                disabled={isReadOnly}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 disabled:opacity-75 disabled:bg-gray-50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-700">Currency</label>
              <select 
                disabled={isReadOnly}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 appearance-none disabled:opacity-75 disabled:bg-gray-50"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="AED">AED</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-700">Payment Mode</label>
              <select 
                disabled={isReadOnly}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 appearance-none disabled:opacity-75 disabled:bg-gray-50"
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Cheque</option>
                <option value="Card">Card</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-700">Transaction Reference / UTR</label>
            <input 
              type="text" 
              disabled={isReadOnly}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 disabled:opacity-75 disabled:bg-gray-50"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Enter reference number"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-700">Notes</label>
            <textarea 
              disabled={isReadOnly}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] text-gray-900 min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 disabled:opacity-75 disabled:bg-gray-50"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes"
            />
          </div>

          {/* Additional Entries */}
          <div className="space-y-3 pt-2">
            {/* Deposit */}
            <div>
              <button 
                className="flex items-center gap-2 text-[14px] font-semibold text-purple-700 hover:text-purple-800"
                onClick={() => setShowDeposit(!showDeposit)}
              >
                {showDeposit ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                Deposit / Incentive
              </button>
              {showDeposit && (
                <div className="grid grid-cols-2 gap-3 mt-3 ml-6">
                  <input type="number" disabled={isReadOnly} placeholder="Amount" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] disabled:opacity-75 disabled:bg-gray-50" />
                  <input type="text" disabled={isReadOnly} placeholder="Reference" value={depositRef} onChange={(e) => setDepositRef(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] disabled:opacity-75 disabled:bg-gray-50" />
                </div>
              )}
            </div>
            
            {/* Cashback */}
            <div>
              <button 
                className="flex items-center gap-2 text-[14px] font-semibold text-purple-700 hover:text-purple-800"
                onClick={() => setShowCashback(!showCashback)}
              >
                {showCashback ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                Cashback
              </button>
              {showCashback && (
                <div className="grid grid-cols-2 gap-3 mt-3 ml-6">
                  <input type="number" disabled={isReadOnly} placeholder="Amount" value={cashbackAmount} onChange={(e) => setCashbackAmount(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] disabled:opacity-75 disabled:bg-gray-50" />
                  <input type="text" disabled={isReadOnly} placeholder="Reference" value={cashbackRef} onChange={(e) => setCashbackRef(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] disabled:opacity-75 disabled:bg-gray-50" />
                </div>
              )}
            </div>

            {/* Bank Charges */}
            <div>
              <button 
                className="flex items-center gap-2 text-[14px] font-semibold text-purple-700 hover:text-purple-800"
                onClick={() => setShowBankCharges(!showBankCharges)}
              >
                {showBankCharges ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                Bank Charges
              </button>
              {showBankCharges && (
                <div className="grid grid-cols-2 gap-3 mt-3 ml-6">
                  <input type="number" disabled={isReadOnly} placeholder="Amount" value={bankChargesAmount} onChange={(e) => setBankChargesAmount(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] disabled:opacity-75 disabled:bg-gray-50" />
                  <input type="text" disabled={isReadOnly} placeholder="Reference" value={bankChargesRef} onChange={(e) => setBankChargesRef(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] disabled:opacity-75 disabled:bg-gray-50" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            {!isAdvance ? (
              !isReadOnly && (
                <button 
                  onClick={handleAdvanceClick}
                  className="text-[14px] font-semibold text-gray-700 hover:text-purple-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Record as Advance Payment
                </button>
              )
            ) : (
              <div className="inline-block px-3 py-1.5 bg-purple-50 text-purple-700 text-[12px] font-bold rounded-lg border border-purple-100">
                Advance Payment Recorded
              </div>
            )}
          </div>

          <div className="pt-2">
            {!documentName ? (
              !isReadOnly && (
                <div>
                  <input 
                    type="file" 
                    id="document-upload" 
                    className="hidden" 
                    onChange={handleFileUpload}
                  />
                  <label 
                    htmlFor="document-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-xl text-[14px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    <Upload className="w-4 h-4" /> Attach Screenshot / Document
                  </label>
                </div>
              )
            ) : (
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50">
                <FileIcon className="w-5 h-5 text-gray-400" />
                <span className="text-[13px] font-medium text-gray-700 flex-1 truncate">{documentName}</span>
                {!isReadOnly && (
                  <button onClick={() => setDocumentName('')} className="p-1 hover:bg-gray-200 rounded-md transition-colors text-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {!isReadOnly && (
          <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-white">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 text-[14px] font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#6F35D0] hover:bg-[#5B29AE] text-white text-[14px] font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editMode ? 'Update Payment' : 'Record Payment'}
            </button>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
};
