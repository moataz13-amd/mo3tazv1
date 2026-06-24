import { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  Briefcase,
  MessageSquareCode,
  Settings,
  LogOut,
  Menu,
  X,
  ImagePlus,
  Image as ImageIcon
} from 'lucide-react';
import { useUIStore, useAuthStore } from '../../store';
import { useAdminTranslation } from '../../lib/adminTranslations';

const adminNavItems = [
  { path: '/admin', labelKey: 'dashboard', icon: LayoutDashboard },
  { path: '/admin/projects', labelKey: 'categories', icon: FolderOpen },
  { path: '/admin/designs', labelKey: 'designs', icon: ImageIcon },
  { path: '/admin/services', labelKey: 'services', icon: Briefcase },
  { path: '/admin/client-logos', labelKey: 'clientLogos', icon: ImagePlus },
  { path: '/admin/messages', labelKey: 'messages', icon: MessageSquareCode },
  { path: '/admin/settings', labelKey: 'settings', icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLElement>(null);
  const { logout } = useAuthStore();
  const { adminSidebarOpen, setAdminSidebarOpen, adminLanguage, setAdminLanguage } = useUIStore();
  const { t } = useAdminTranslation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const currentNav = adminNavItems.find((item) => item.path === location.pathname);
  const currentTitle = currentNav ? t(currentNav.labelKey as any) : t('system');

  const closeSidebar = () => setAdminSidebarOpen(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) closeSidebar();
  }, [location.pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile || !adminSidebarOpen) return;
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        closeSidebar();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [adminSidebarOpen]);

  useEffect(() => {
    document.documentElement.style.fontSize = '17.5px';
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-[#050816] text-white flex transition-all duration-300"
      dir={adminLanguage === 'ar' ? 'rtl' : 'ltr'}
      style={{ fontFamily: "'Milan Display', 'Cairo', 'Inter', 'Outfit', sans-serif", fontSize: '17px' }}
    >
      {/* Mobile Overlay Backdrop */}
      {adminSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={closeSidebar} />
      )}

      {/* Sidebar Panel */}
      <aside
        ref={sidebarRef}
        className={`${
          adminSidebarOpen ? '' : 'max-md:hidden'
        } fixed md:relative top-0 bottom-0 ${
          adminLanguage === 'ar' ? 'right-0 border-l' : 'left-0 border-r'
        } z-30 transition-all duration-300 flex flex-col border-glass-border bg-[rgba(5,8,22,0.95)] backdrop-blur-xl ${
          adminSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Header/Logo */}
        <div className="h-16 flex items-center justify-center px-4 border-b border-glass-border flex-shrink-0">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <img
              src="/Mo3taz..svg"
              alt="MO3TAZ."
              className="h-6 w-auto object-contain"
              style={{
                filter: 'brightness(0) saturate(100%) invert(75%) sepia(60%) saturate(500%) hue-rotate(145deg) brightness(1.1)',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
          </Link>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-3 overflow-y-auto">
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const itemLabel = t(item.labelKey as any);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-150 group relative border-2 ${
                  isActive
                    ? 'bg-[#00E5FF] text-black border-black shadow-[4px_4px_0px_#000000] font-black rounded-xl'
                    : 'text-gray-400 border-transparent hover:text-black hover:bg-[#00E5FF] hover:border-black hover:shadow-[4px_4px_0px_#000000] rounded-xl hover:translate-x-0.5 hover:translate-y-0.5'
                }`}
              >
                <Icon
                  size={18}
                  className={`flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-black' : 'text-gray-400 group-hover:text-black'
                  }`}
                />
                {adminSidebarOpen && <span className="whitespace-nowrap font-black tracking-wide text-sm uppercase">{itemLabel}</span>}

                {/* Tooltip for collapsed mode */}
                {!adminSidebarOpen && (
                  <div className={`absolute ${adminLanguage === 'ar' ? 'right-16' : 'left-16'} px-2 py-1 bg-[#00E5FF] border border-black text-black rounded-lg text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-[2px_2px_0px_#000000]`}>
                    {itemLabel}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer/Logout */}
        <div className="p-3 border-t border-glass-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 transition-all duration-150 border-2 border-transparent text-red-400 hover:text-black hover:bg-red-500 hover:border-black hover:shadow-[4px_4px_0px_#000000] rounded-xl cursor-pointer group relative hover:translate-x-0.5 hover:translate-y-0.5"
          >
            <LogOut size={18} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
            {adminSidebarOpen && <span className="whitespace-nowrap font-black tracking-wide text-xs uppercase">{t('exitSystem')}</span>}

            {!adminSidebarOpen && (
              <div className={`absolute ${adminLanguage === 'ar' ? 'right-16' : 'left-16'} px-2 py-1 bg-red-500 border border-black text-black rounded-lg text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-[2px_2px_0px_#000000]`}>
                {t('exitSystem')}
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (Global Header) */}
        <header className="h-16 border-b border-glass-border flex items-center justify-between px-6 bg-[rgba(5,8,22,0.5)] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAdminSidebarOpen(!adminSidebarOpen)}
              className="p-2 border border-glass-border hover:bg-surface text-primary rounded-xl cursor-pointer transition-colors duration-150"
            >
              <Menu size={18} />
            </button>
            <h2 className="font-black text-white text-xl tracking-wider uppercase">
              {currentTitle}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="neon-btn px-4 py-1.5 text-xs flex items-center gap-2"
            >
              {t('publicPlatform')}
            </a>
          </div>
        </header>

        {/* Panel Content wrapper with padding & scroll */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[150px] opacity-10 bg-primary pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[150px] opacity-10 bg-secondary pointer-events-none" />

          <div className="relative z-10 max-w-6xl mx-auto space-y-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

