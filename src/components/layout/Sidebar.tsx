import {
  LayoutDashboard,
  LineChart,
  Settings,
  ClipboardList,
  CheckSquare,
  FileText,
  Banknote,
  Book,
  BarChart2,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

interface SubMenuItem {
  label: string;
  href: string;
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  submenus?: SubMenuItem[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { 
    icon: LineChart, 
    label: 'Sales', 
    href: '/sales',
    submenus: [
      { label: 'Leads', href: '/sales/leads' },
      { label: 'Quotations', href: '/sales/quotations' },
    ]
  },
  { icon: Settings, label: 'Operations', href: '/operations' },
  { icon: ClipboardList, label: 'Bookings', href: '/bookings-main' },
  { 
    icon: CheckSquare, 
    label: 'Approvals', 
    href: '/approvals',
    submenus: [
      { label: 'Bookings', href: '/approvals/bookings' },
      { label: 'Payments', href: '/approvals/payments' },
    ]
  },
  { icon: FileText, label: 'Content', href: '/content' },
  { 
    icon: Banknote, 
    label: 'Finance', 
    href: '/finance',
    submenus: [
      { label: 'Bookings', href: '/bookings' },
      { label: 'Customers', href: '/finance/customers' },
      { label: 'Vendors', href: '/finance/vendors' },
      { label: 'Payments', href: '/finance/payments' },
      { label: 'Journals', href: '/finance/journals' },
      { label: 'Expense+', href: '/finance/expense' },
    ]
  },
  { 
    icon: Book, 
    label: 'Directory', 
    href: '/directory',
    submenus: [
      { label: 'Customers', href: '/directory/customers' },
      { label: 'Vendors', href: '/directory/vendors' },
      { label: 'Team', href: '/directory/team' },
    ]
  },
  { icon: BarChart2, label: 'Reports', href: '/reports' },
];

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[200px] bg-white border-r border-gray-200 flex flex-col z-30 shadow-sm">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-[22px] font-bold text-[#6C2BD9] tracking-tight">ciergo</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600" onClick={onClose}>
          <PanelLeftClose className="w-[18px] h-[18px]" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>
      </nav>

      <div className="p-3 border-t border-gray-100 mt-auto">
        <Link
          to="/settings"
          className="flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-[18px] h-[18px] text-gray-400 group-hover:text-gray-600" />
            <span>Settings</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </Link>
      </div>
    </aside>
  );
};

import { useState, useEffect } from 'react';

const SidebarItem = ({ item }: { item: NavItem }) => {
  const location = useLocation();
  const isParentActive = item.label === 'Finance' && location.pathname.includes('/bookings') 
    || location.pathname.startsWith(item.href);

  const [isOpen, setIsOpen] = useState(isParentActive);

  useEffect(() => {
    if (isParentActive) {
      setIsOpen(true);
    }
  }, [isParentActive]);

  const Icon = item.icon;
  
  return (
    <div className={cn(
      "flex flex-col",
      isOpen && item.submenus ? "bg-[#F4F0FF] rounded-lg" : ""
    )}>
      {item.submenus ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 group',
            isOpen ? 'text-[#6C2BD9]' : 'text-gray-600 hover:bg-gray-50/70'
          )}
        >
          <div className="flex items-center gap-3">
            <Icon
              className={cn(
                'w-[18px] h-[18px] flex-shrink-0',
                isOpen ? 'text-[#6C2BD9]' : 'text-gray-400 group-hover:text-gray-600'
              )}
            />
            <span>{item.label}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-[#6C2BD9]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>
      ) : (
        <Link
          to={item.href}
          className={cn(
            'flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 group',
            isParentActive
              ? 'bg-[#F4F0FF] text-[#6C2BD9]'
              : 'text-gray-600 hover:bg-gray-50/70'
          )}
        >
          <div className="flex items-center gap-3">
            <Icon
              className={cn(
                'w-[18px] h-[18px] flex-shrink-0',
                isParentActive ? 'text-[#6C2BD9]' : 'text-gray-400 group-hover:text-gray-600'
              )}
            />
            <span>{item.label}</span>
          </div>
        </Link>
      )}

      {isOpen && item.submenus && (
        <div className="flex flex-col gap-0.5 pb-2 relative">
          <div className="absolute left-[21px] top-0 bottom-4 w-px bg-[#6C2BD9]/20"></div>
          
          {item.submenus.map((sub) => {
            const isChildActive = location.pathname.includes(sub.href);
            return (
              <Link
                key={sub.label}
                to={sub.href}
                className={cn(
                  'flex items-center pl-10 pr-3 py-[6px] text-[13px] transition-all duration-200 relative z-10',
                  isChildActive
                    ? 'text-[#6C2BD9] font-bold'
                    : 'text-gray-600 hover:text-[#6C2BD9]'
                )}
              >
                {sub.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

