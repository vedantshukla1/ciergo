import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PAGE_SIZE_OPTIONS } from '@/constants/bookingConstants';

interface PaginationProps {
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const Pagination = ({
  pageIndex,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalRows / pageSize);
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
      {/* Rows info */}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>
          Showing {totalRows === 0 ? 0 : startRow}–{endRow} of {totalRows} bookings
        </span>
        <div className="flex items-center gap-1.5">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => { onPageSizeChange(Number(e.target.value)); onPageChange(0); }}
            className="border border-gray-200 rounded px-1.5 py-0.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <PagBtn
          onClick={() => onPageChange(0)}
          disabled={pageIndex === 0}
          title="First page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </PagBtn>
        <PagBtn
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={pageIndex === 0}
          title="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </PagBtn>

        {getPageNumbers(pageIndex, totalPages).map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="w-7 h-7 flex items-center justify-center text-xs text-gray-400">
              …
            </span>
          ) : (
            <PagBtn
              key={p}
              onClick={() => onPageChange(Number(p) - 1)}
              active={pageIndex === Number(p) - 1}
            >
              {p}
            </PagBtn>
          )
        )}

        <PagBtn
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={pageIndex >= totalPages - 1}
          title="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </PagBtn>
        <PagBtn
          onClick={() => onPageChange(totalPages - 1)}
          disabled={pageIndex >= totalPages - 1}
          title="Last page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </PagBtn>
      </div>
    </div>
  );
};

const PagBtn = ({
  children,
  onClick,
  disabled = false,
  active = false,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  title?: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      'w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-colors',
      active
        ? 'bg-primary-700 text-white'
        : disabled
        ? 'text-gray-300 cursor-not-allowed'
        : 'text-gray-600 hover:bg-gray-100'
    )}
  >
    {children}
  </button>
);

function getPageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const page = current + 1;
  if (page <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (page >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', page - 1, page, page + 1, '...', total];
}
