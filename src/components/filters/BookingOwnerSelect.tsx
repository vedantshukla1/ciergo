import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, X, RotateCcw, Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_OWNERS } from '@/data/mockOwners';
import type { OwnerFilter, AdvancedOwnerFilter } from '@/types/filter.types';

interface BookingOwnerSelectProps {
  selected: OwnerFilter[];
  advanced: AdvancedOwnerFilter;
  isAdvancedMode: boolean;
  onChangeSelected: (owners: OwnerFilter[]) => void;
  onChangeAdvanced: (advanced: AdvancedOwnerFilter) => void;
  onToggleAdvanced: (val: boolean) => void;
  onApply: () => void;
  onReset: () => void;
}

export const BookingOwnerSelect = ({
  selected,
  advanced,
  isAdvancedMode,
  onChangeSelected,
  onChangeAdvanced,
  onToggleAdvanced,
  onApply,
  onReset,
}: BookingOwnerSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const totalSelected = isAdvancedMode
    ? advanced.primaryOwners.length + advanced.secondaryOwners.length
    : selected.length;

  const label = totalSelected === 0
    ? 'Booking Owner'
    : `${totalSelected} Owner(s) Selected`;

  return (
    <div className="relative" ref={ref}>
      <label className="text-[12px] font-semibold text-gray-700 mb-1.5 block">Booking Owner</label>
      <div
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-between w-[220px] px-4 py-2 bg-white border border-gray-200 rounded-[14px] cursor-pointer hover:border-gray-300 transition-colors"
      >
        <span className={`text-[13px] truncate ${totalSelected > 0 ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
          {totalSelected > 0 ? `${totalSelected} Owner(s) Selected` : 'Search / Select Owners'}
        </span>
        <ChevronDown className={cn('w-4 h-4 text-gray-400 flex-shrink-0 transition-transform', open && 'rotate-180')} />
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in">
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            {isAdvancedMode ? (
              <AdvancedOwnerPanel
                advanced={advanced}
                onChangeAdvanced={onChangeAdvanced}
                onToggleAdvanced={onToggleAdvanced}
                onApply={() => { onApply(); setOpen(false); }}
                onReset={onReset}
                onClose={() => setOpen(false)}
              />
            ) : (
              <SimpleOwnerPanel
                selected={selected}
                onChangeSelected={onChangeSelected}
                onToggleAdvanced={onToggleAdvanced}
                onApply={() => { onApply(); setOpen(false); }}
                onReset={onReset}
                onClose={() => setOpen(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ---- Simple Panel ---- */
const SimpleOwnerPanel = ({
  selected,
  onChangeSelected,
  onToggleAdvanced,
  onApply,
  onReset,
  onClose,
}: {
  selected: OwnerFilter[];
  onChangeSelected: (owners: OwnerFilter[]) => void;
  onToggleAdvanced: (v: boolean) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}) => {
  const [search, setSearch] = useState('');
  const [isListOpen, setIsListOpen] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) setIsListOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(
    () =>
      MOCK_OWNERS.filter((o) =>
        o.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const toggleOwner = (owner: OwnerFilter) => {
    const exists = selected.find((s) => s.id === owner.id);
    if (exists) {
      onChangeSelected(selected.filter((s) => s.id !== owner.id));
    } else {
      onChangeSelected([...selected, owner]);
    }
  };

  const removeChip = (id: string) => onChangeSelected(selected.filter((s) => s.id !== id));

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-xl w-[400px] p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[13px] font-bold text-gray-900 mb-1">Select Booking Owners</h3>
          <p className="text-[11px] text-gray-500">{selected.length} Owner(s) Selected</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-[11px] text-gray-600 font-medium">
            <div className="w-3.5 h-3.5 border border-gray-300 rounded flex items-center justify-center bg-white transition-colors">
              <input
                type="checkbox"
                className="opacity-0 absolute w-0 h-0"
                checked={false}
                onChange={(e) => onToggleAdvanced(e.target.checked)}
              />
            </div>
            Advance Search
          </label>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search dropdown */}
      <div className="relative mb-4" ref={inputRef}>
        <div 
          className="relative"
          onClick={() => setIsListOpen(true)}
        >
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsListOpen(true);
            }}
            placeholder="Search / Select Owners"
            className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-gray-600 placeholder-gray-400 cursor-text"
          />
          <ChevronDown 
            className={cn("absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform cursor-pointer", isListOpen && "rotate-180")} 
            onClick={(e) => {
              e.stopPropagation();
              setIsListOpen(!isListOpen);
            }}
          />
        </div>

        {/* Dropdown options */}
        {isListOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto scrollbar-thin z-10">
            {filtered.map((owner) => (
              <OwnerOption
                key={owner.id}
                owner={owner}
                checked={!!selected.find((s) => s.id === owner.id)}
                onChange={() => toggleOwner(owner)}
              />
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-3 text-xs text-gray-400 text-center">No owners found</p>
            )}
          </div>
        )}
      </div>

      {/* Chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selected.map((owner) => (
            <OwnerChip key={owner.id} name={owner.name} onRemove={() => removeChip(owner.id)} />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 mt-2">
        <button
          onClick={onReset}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onApply}
          className="px-6 py-1.5 text-[13px] font-medium bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors shadow-sm"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

/* ---- Advanced Panel ---- */
const AdvancedOwnerPanel = ({
  advanced,
  onChangeAdvanced,
  onToggleAdvanced,
  onApply,
  onReset,
  onClose,
}: {
  advanced: AdvancedOwnerFilter;
  onChangeAdvanced: (a: AdvancedOwnerFilter) => void;
  onToggleAdvanced: (v: boolean) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}) => {
  const [primarySearch, setPrimarySearch] = useState('');
  const [secondarySearch, setSecondarySearch] = useState('');

  const filteredPrimary = useMemo(
    () => MOCK_OWNERS.filter((o) => o.name.toLowerCase().includes(primarySearch.toLowerCase())),
    [primarySearch]
  );
  const filteredSecondary = useMemo(
    () => MOCK_OWNERS.filter((o) => o.name.toLowerCase().includes(secondarySearch.toLowerCase())),
    [secondarySearch]
  );

  const togglePrimary = (owner: OwnerFilter) => {
    const exists = advanced.primaryOwners.find((o) => o.id === owner.id);
    onChangeAdvanced({
      ...advanced,
      primaryOwners: exists
        ? advanced.primaryOwners.filter((o) => o.id !== owner.id)
        : [...advanced.primaryOwners, owner],
    });
  };

  const toggleSecondary = (owner: OwnerFilter) => {
    const exists = advanced.secondaryOwners.find((o) => o.id === owner.id);
    onChangeAdvanced({
      ...advanced,
      secondaryOwners: exists
        ? advanced.secondaryOwners.filter((o) => o.id !== owner.id)
        : [...advanced.secondaryOwners, owner],
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-xl w-[700px] p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-[13px] font-bold text-gray-900">Select Booking Owners</h3>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-[11px] text-gray-600 font-medium">
            <div className="w-3.5 h-3.5 border border-primary-700 rounded flex items-center justify-center bg-primary-700 transition-colors">
              <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
              <input
                type="checkbox"
                className="opacity-0 absolute w-0 h-0"
                checked={true}
                onChange={(e) => onToggleAdvanced(e.target.checked)}
              />
            </div>
            Advance Search
          </label>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Primary Owners */}
        <div className="flex-1 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[11px] font-bold text-gray-900">Primary Owner(s)</h4>
            <span className="text-[10px] text-gray-500">{advanced.primaryOwners.length} Owner(s) Selected</span>
          </div>
          <ColumnSearch
            search={primarySearch}
            onSearchChange={setPrimarySearch}
            filteredOwners={filteredPrimary}
            selected={advanced.primaryOwners}
            onToggle={togglePrimary}
            onRemoveChip={(id) =>
              onChangeAdvanced({
                ...advanced,
                primaryOwners: advanced.primaryOwners.filter((o) => o.id !== id),
              })
            }
          />
        </div>

        {/* Secondary Owners */}
        <div className="flex-1 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[11px] font-bold text-gray-900">Secondary Owner(s)</h4>
            <span className="text-[10px] text-gray-500">{advanced.secondaryOwners.length} Owner(s) Selected</span>
          </div>
          <ColumnSearch
            search={secondarySearch}
            onSearchChange={setSecondarySearch}
            filteredOwners={filteredSecondary}
            selected={advanced.secondaryOwners}
            onToggle={toggleSecondary}
            onRemoveChip={(id) =>
              onChangeAdvanced({
                ...advanced,
                secondaryOwners: advanced.secondaryOwners.filter((o) => o.id !== id),
              })
            }
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 mt-4">
        <button
          onClick={onReset}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onApply}
          className="px-6 py-1.5 text-[13px] font-medium bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors shadow-sm"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

const ColumnSearch = ({
  search,
  onSearchChange,
  filteredOwners,
  selected,
  onToggle,
  onRemoveChip,
}: {
  search: string;
  onSearchChange: (s: string) => void;
  filteredOwners: OwnerFilter[];
  selected: OwnerFilter[];
  onToggle: (owner: OwnerFilter) => void;
  onRemoveChip: (id: string) => void;
}) => {
  const [isListOpen, setIsListOpen] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) setIsListOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div>
      <div className="relative mb-3" ref={inputRef}>
        <div 
          className="relative"
          onClick={() => setIsListOpen(true)}
        >
          <input
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setIsListOpen(true);
            }}
            placeholder="Search / Select Owners"
            className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-gray-600 bg-white placeholder-gray-400 cursor-text"
          />
          <ChevronDown 
            className={cn("absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform cursor-pointer", isListOpen && "rotate-180")} 
            onClick={(e) => {
              e.stopPropagation();
              setIsListOpen(!isListOpen);
            }}
          />
        </div>
        
        {isListOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto scrollbar-thin z-10">
            {filteredOwners.map((owner) => (
              <OwnerOption
                key={owner.id}
                owner={owner}
                checked={!!selected.find((s) => s.id === owner.id)}
                onChange={() => onToggle(owner)}
              />
            ))}
            {filteredOwners.length === 0 && (
              <p className="px-3 py-3 text-xs text-gray-400 text-center">No owners found</p>
            )}
          </div>
        )}
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((o) => (
            <OwnerChip key={o.id} name={o.name} onRemove={() => onRemoveChip(o.id)} />
          ))}
        </div>
      )}
    </div>
  );
};

const OwnerOption = ({
  owner,
  checked,
  onChange,
}: {
  owner: OwnerFilter;
  checked: boolean;
  onChange: () => void;
}) => (
  <label className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
    <div className={cn(
      "w-4 h-4 rounded border flex items-center justify-center transition-colors",
      checked ? "bg-primary-700 border-primary-700" : "bg-white border-gray-300"
    )}>
      {checked && <Check className="w-3 h-3 text-white stroke-[3]" />}
    </div>
    <span className="text-[12px] text-gray-700">{owner.name}</span>
  </label>
);

export const OwnerChip = ({ name, onRemove }: { name: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[12px] text-gray-700 font-medium">
    <button
      onClick={onRemove}
      className="text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
    >
      <X className="w-3.5 h-3.5" />
    </button>
    {name}
  </span>
);
