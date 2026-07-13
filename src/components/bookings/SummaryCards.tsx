
import { Calculator, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface SummaryCardsProps {
  data: {
    net: number;
    youGive: number;
    youGet: number;
  };
}

export const SummaryCards = ({ data }: SummaryCardsProps) => {
  return (
    <div className="flex items-center gap-6">
      {/* Net */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-[14px] shadow-sm text-[13px] font-semibold">
        <Calculator className="w-[18px] h-[18px] text-gray-400" />
        <span className="text-gray-500 font-medium">Net</span>
        <span className="text-[#22C55E] text-[14px] font-semibold">₹ {data.net.toLocaleString('en-IN')}</span>
      </div>

      {/* You Give */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-[14px] shadow-sm text-[13px] font-semibold">
        <ArrowUpRight className="w-[18px] h-[18px] text-gray-400" />
        <span className="text-gray-500 font-medium">You Give</span>
        <span className="text-[#EF4444] text-[14px] font-semibold">₹ {data.youGive.toLocaleString('en-IN')}</span>
      </div>

      {/* You Get */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-[14px] shadow-sm text-[13px] font-semibold">
        <ArrowDownLeft className="w-[18px] h-[18px] text-gray-400" />
        <span className="text-gray-500 font-medium">You Get</span>
        <span className="text-[#22C55E] text-[14px] font-semibold">₹ {data.youGet.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
};
