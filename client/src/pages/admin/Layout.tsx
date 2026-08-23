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
      className="admin-shell h-screen w-screen text-white flex overflow-hidden transition-all duration-300"
      dir={adminLanguage === 'ar' ? 'rtl' : 'ltr'}
      style={{ background: 'var(--bg)', fontFamily: "'Milan Display', 'Cairo', 'Inter', 'Outfit', sans-serif", fontSize: '17px' }}
    >
      {/* Mobile Overlay Backdrop */}
      {adminSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={closeSidebar} />
      )}

      {/* Sidebar Panel */}
      <aside
        ref={sidebarRef}
        className={`admin-sidebar-panel ${
          adminSidebarOpen ? '' : 'max-md:hidden'
        } fixed md:sticky top-0 h-screen ${
          adminLanguage === 'ar' ? 'right-0 border-l' : 'left-0 border-r'
        } z-30 transition-all duration-300 flex flex-col border-glass-border bg-[rgba(5,8,22,0.95)] backdrop-blur-xl shrink-0 ${
          adminSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Header/Logo */}
        <div className="h-16 flex items-center justify-center px-4 border-b border-glass-border flex-shrink-0 cursor-pointer">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden group">
            <img
              src="/Mo3taz..svg"
              alt="MO3TAZ."
              className="h-6 w-auto object-contain transition-transform group-hover:scale-105"
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
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const itemLabel = t(item.labelKey as any);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 transition-all duration-150 group relative border ${
                  isActive
                    ? 'bg-[#22d3d6] text-[#17213c] border-[#22d3d6] shadow-[0_12px_24px_rgba(34,211,214,0.24)] font-black rounded-2xl'
                    : 'text-[#aab8d1] border-transparent hover:text-white hover:bg-white/10 hover:border-white/10 rounded-2xl'
                }`}
              >
                <Icon
                  size={18}
                  className={`flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#17213c]' : 'text-[#aab8d1] group-hover:text-white'
                  }`}
                />
                {adminSidebarOpen && <span className="whitespace-nowrap font-black tracking-wide text-xs uppercase">{itemLabel}</span>}

                {/* Tooltip for collapsed mode */}
                {!adminSidebarOpen && (
                  <div className={`absolute ${adminLanguage === 'ar' ? 'right-16' : 'left-16'} px-3 py-1.5 bg-[#22d3d6] text-[#17213c] rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-[0_12px_24px_rgba(34,211,214,0.24)]`}>
                    {itemLabel}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer/Logout */}
        <div className="p-3 border-t border-glass-border flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 transition-all duration-150 border border-transparent text-red-300 hover:text-white hover:bg-red-500/15 hover:border-red-400/25 rounded-2xl cursor-pointer group relative"
          >
            <LogOut size={18} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
            {adminSidebarOpen && <span className="whitespace-nowrap font-black tracking-wide text-xs uppercase">{t('exitSystem')}</span>}

            {!adminSidebarOpen && (
              <div className={`absolute ${adminLanguage === 'ar' ? 'right-16' : 'left-16'} px-3 py-1.5 bg-red-500 text-white rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-[0_12px_24px_rgba(239,68,68,0.24)]`}>
                {t('exitSystem')}
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (Global Header) */}
        <header className="admin-topbar h-16 border-b border-glass-border flex items-center justify-between px-6 bg-[rgba(5,8,22,0.5)] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAdminSidebarOpen(!adminSidebarOpen)}
              className="p-2 border border-white/10 hover:bg-white/10 text-[#22d3d6] rounded-2xl cursor-pointer transition-colors duration-150"
            >
              <Menu size={18} />
            </button>
            <h2 className="font-black text-white text-xl tracking-wider uppercase">
              {currentTitle}
            </h2>
          </div>
        </header>

        {/* Panel Content wrapper with padding & scroll */}
        <main className="admin-main flex-1 overflow-y-auto p-4 md:p-7 relative">
          <div className="admin-content-shell relative z-10 w-full max-w-[1600px] mx-auto space-y-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
