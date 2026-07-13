import { Bell, Search, Home, PanelRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href?: string;
  isHome?: boolean;
}

interface TopNavProps {
  breadcrumbs: Breadcrumb[];
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const TopNav = ({ breadcrumbs, isSidebarOpen = true, onToggleSidebar }: TopNavProps) => {
  return (
    <header className="h-[60px] bg-transparent flex items-center justify-between w-full px-6 z-20">
      
      {/* Left: Breadcrumb */}
      <div className="flex items-center text-[14px] w-1/3">
        {!isSidebarOpen && (
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-100 px-4 py-2 mr-6">
            <span className="text-[20px] font-bold text-[#6C2BD9] tracking-tight mr-4">ciergo</span>
            <button className="text-gray-400 hover:text-gray-600" onClick={onToggleSidebar}>
              <PanelRight className="w-5 h-5" />
            </button>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {crumb.isHome ? (
                <a href={crumb.href || '/'} className="text-gray-500 hover:text-gray-900 transition-colors">
                  <Home className="w-4 h-4" />
                </a>
            ) : crumb.href && i < breadcrumbs.length - 1 ? (
              <a href={crumb.href} className="text-gray-500 hover:text-gray-900 transition-colors">
                {crumb.label}
              </a>
            ) : (
              <span className={i === breadcrumbs.length - 1 ? 'text-[#6C2BD9] font-medium' : 'text-gray-500'}>
                {crumb.label}
              </span>
            )}
            {i < breadcrumbs.length - 1 && (
              <span className="text-gray-400 font-medium">/</span>
            )}
          </span>
        ))}
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center w-1/3">
        <div className="relative hidden md:block w-full max-w-[480px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
          <input
            type="text"
            placeholder="Search or type command.."
            className="w-full pl-11 pr-14 py-2.5 text-[14px] bg-white border border-gray-200 rounded-[14px] focus:outline-none focus:ring-1 focus:ring-[#6C2BD9] focus:border-[#6C2BD9] transition-all placeholder:text-gray-400"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <kbd className="text-[12px] font-sans px-2 py-1 rounded text-gray-400 bg-[#F1F5F9] font-semibold">⌘ K</kbd>
          </div>
        </div>
      </div>

      {/* Right: Profile */}
      <div className="flex items-center justify-end gap-5 w-1/3">
        {/* Bell */}
        <button className="relative flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors">
          <Bell className="w-[20px] h-[20px]" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#EF4444] rounded-full border-[1.5px] border-white" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        {/* User */}
        <button className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-1 pr-2 transition-colors">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <img src="/avatar.jpg" alt="Vedant Shukla" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-[13px] font-semibold text-gray-900 leading-none">Vedant Shukla</p>
            <p className="text-[11px] text-gray-500 leading-none mt-1">Sales Lead</p>
          </div>
        </button>
      </div>
    </header>
  );
};
