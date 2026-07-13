import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';

interface MainLayoutProps {
  children: React.ReactNode;
  customBreadcrumbs?: { label: string; href?: string; isHome?: boolean }[];
}

const defaultBreadcrumbs = [
  { label: 'Home', href: '/', isHome: true },
  { label: 'Finance', href: '/finance' },
  { label: 'Bookings' },
];

export const MainLayout = ({ children, customBreadcrumbs }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const breadcrumbsToUse = customBreadcrumbs || defaultBreadcrumbs;

  return (
    <div className="w-[1780px] min-h-screen bg-[#F8F9FB] flex relative mx-auto">
      {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}
      <div className={`flex-1 flex flex-col min-w-0 transition-all pt-8 ${isSidebarOpen ? 'ml-[200px]' : 'ml-0'}`}>
        <TopNav breadcrumbs={breadcrumbsToUse} isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};
