import { cn } from '@/lib/utils';
import type { Owner } from '@/types/booking.types';

interface AvatarStackProps {
  owners: Owner[];
  max?: number;
  size?: 'sm' | 'md';
}

export const AvatarStack = ({ owners, max = 3, size = 'sm' }: AvatarStackProps) => {
  const visible = owners.slice(0, max);
  const remaining = owners.length - max;

  const sizeClass = size === 'sm' ? 'w-[26px] h-[26px] text-[10px]' : 'w-8 h-8 text-xs';

  return (
    <div className="flex items-center justify-center">
      {visible.map((owner, i) => {
        return (
          <div
            key={owner.id}
            className={cn(
              'group rounded-full border flex items-center justify-center font-bold flex-shrink-0 transition-transform bg-white relative cursor-pointer',
              sizeClass,
              i === 1 && 'ml-2',
              i > 1 && '-ml-2'
            )}
            style={{ 
              borderColor: owner.color,
              color: owner.color,
              zIndex: 40 - i // Ensure proper stacking order (first is on top)
            }}
          >
            {owner.initials}
            
            {/* Custom Tooltip */}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3.5 py-1.5 bg-[#2A2B2E] text-white text-[12px] tracking-wide font-medium rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] shadow-md">
              {owner.name}
            </div>
          </div>
        );
      })}
      {remaining > 0 && (
        <div
          className={cn(
            'group rounded-full border-2 border-white bg-gray-100 flex items-center justify-center font-medium text-gray-600 flex-shrink-0 shadow-sm relative cursor-pointer',
            sizeClass,
            visible.length === 1 ? 'ml-2' : '-ml-1.5'
          )}
          style={{ zIndex: 10 }}
        >
          +{remaining}
          
          {/* Custom Tooltip */}
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3.5 py-1.5 bg-[#2A2B2E] text-white text-[12px] tracking-wide font-medium rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] shadow-md">
            {remaining} more
          </div>
        </div>
      )}
    </div>
  );
};

interface SingleAvatarProps {
  owner: Owner;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SingleAvatar = ({ owner, showName = false, size = 'sm' }: SingleAvatarProps) => {
  const sizeClass =
    size === 'sm' ? 'w-6 h-6 text-[10px]' : size === 'md' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-medium text-white flex-shrink-0',
          sizeClass
        )}
        style={{ backgroundColor: owner.color }}
        title={owner.name}
      >
        {owner.initials}
      </div>
      {showName && <span className="text-xs text-gray-700">{owner.name}</span>}
    </div>
  );
};
