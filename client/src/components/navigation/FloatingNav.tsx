import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useUIStore } from '../../store';

const navItems = [
  { id: 'about', label: 'عنّي' },
  { id: 'services', label: 'الخدمات' },
  { id: 'skills', label: 'منهجية العمل' },
  { id: 'portfolio', label: 'المشاريع' },
];

export default function FloatingNav({ projectTitle }: { projectTitle?: string }) {
  const navigate = useNavigate();
  const { activeSection, setActiveSection } = useUIStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isProjectPage = !!projectTitle;

  const scrollToSection = (id: string) => {
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        if ((window as any).lenis) {
          (window as any).lenis.scrollTo(el, { offset: -20, duration: 1.2 });
        } else {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setActiveSection(id);
      }
    };
    if (isProjectPage) {
      navigate('/');
      setTimeout(doScroll, 300);
    } else {
      doScroll();
    }
  };

  // Set active section to portfolio when on project page
  useEffect(() => {
    if (isProjectPage) {
      setActiveSection('portfolio');
    }
  }, [isProjectPage, setActiveSection]);

  // Intersection Observer to auto-detect active section
  useEffect(() => {
    if (isProjectPage) return;
    const observers: IntersectionObserver[] = [];
    const allSections = [...navItems.map(i => i.id), 'contact'];

    allSections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isProjectPage, setActiveSection]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Desktop floating pill navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -40, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-6 left-1/2 w-[90%] max-w-4xl z-50 hidden md:block"
        dir="rtl"
      >
        <div
          className="w-full rounded-full px-10 md:px-12 flex items-center justify-between border border-white/10 bg-dark-950/20 backdrop-blur-md h-16 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)]"
          style={{ 
            padding: '10px 12px 10px 12px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
          }}
        >
          {/* Logo / Back button */}
          {isProjectPage ? (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 cursor-pointer flex-shrink-0 text-[rgba(180,220,220,0.7)] hover:text-[#00E5FF] transition-colors"
              style={{ fontFamily: "'Sahara Bold', 'Inter', sans-serif" }}
            >
              <ArrowRight size={18} />
              <span className="text-[14px] font-medium max-w-[140px] truncate">{projectTitle}</span>
            </button>
          ) : (
            <button
              onClick={() => scrollToSection('home')}
              className="flex items-center cursor-pointer flex-shrink-0"
            >
              <img
                src="/Mo3taz..svg"
                alt="MO3TAZ."
                style={{
                  height: '28px',
                  filter: 'brightness(0) saturate(100%) invert(75%) sepia(60%) saturate(500%) hue-rotate(145deg) brightness(1.1)',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <span
                className="font-bold text-xl tracking-tight"
                style={{
                  display: 'none',
                  fontFamily: 'Outfit, sans-serif',
                  color: '#00BFFF',
                  textShadow: '0 0 20px rgba(0,191,255,0.4)',
                }}
              >
                MO3TAZ.
              </span>
            </button>
          )}

          {/* Nav Links — center */}
          <div className="flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative text-[14px] font-medium transition-all duration-300 cursor-pointer"
                  style={{
                    color: isActive
                      ? '#00DFFF'
                      : 'rgba(180, 220, 220, 0.65)',
                    textShadow: isActive
                      ? '0 0 12px rgba(0,191,255,0.5)'
                      : 'none',
                    fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(200, 240, 240, 0.9)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(180, 220, 220, 0.65)';
                    }
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* CTA Button — left side in RTL (لنتحدث) */}
          <motion.button
            whileHover={{ scale: 1.02, x: 2, y: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => scrollToSection('contact')}
            className="flex-shrink-0 cursor-pointer inline-flex items-center justify-center bg-[#00E5FF] text-black border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] transition-all duration-150 leading-none select-none whitespace-nowrap"
            style={{
              width: '160px',
              height: '50px',
              fontSize: '18px',
              fontWeight: 900,
              borderRadius: '100px',
              fontFamily: "'Sahara Bold', 'Inter', sans-serif",
            }}
          >
            لنتحدث
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile header */}
      <nav className="fixed top-0 left-0 right-0 z-50 md:hidden" dir="rtl">
        <motion.div
          initial={{ y: -80 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between px-4 py-3 mx-3 mt-3"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
          }}
        >
          {/* Logo right / Back button */}
          {isProjectPage ? (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 cursor-pointer flex-shrink-0 text-[rgba(180,220,220,0.7)] hover:text-[#00E5FF] transition-colors max-w-[140px]"
              style={{ fontFamily: "'Sahara Bold', 'Inter', sans-serif" }}
            >
              <ArrowRight size={16} />
              <span className="text-[13px] font-medium truncate">{projectTitle}</span>
            </button>
          ) : (
            <button
              onClick={() => { scrollToSection('home'); setMobileMenuOpen(false); }}
              className="flex items-center cursor-pointer flex-shrink-0"
            >
              <img
                src="/Mo3taz..svg"
                alt="MO3TAZ."
                style={{
                  height: '24px',
                  filter: 'brightness(0) saturate(100%) invert(75%) sepia(60%) saturate(500%) hue-rotate(145deg) brightness(1.1)',
                }}
              />
            </button>
          )}

          {/* Left group: Menu + CTA */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { scrollToSection('contact'); setMobileMenuOpen(false); }}
              className="flex-shrink-0 cursor-pointer inline-flex items-center justify-center bg-[#00E5FF] text-black border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] transition-all duration-150 leading-none select-none whitespace-nowrap"
              style={{
                height: '38px',
                padding: '0 18px',
                fontSize: '14px',
                fontWeight: 900,
                borderRadius: '100px',
                fontFamily: "'Sahara Bold', 'Inter', sans-serif",
              }}
            >
              لنتحدث
            </motion.button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
              style={{
                background: mobileMenuOpen ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: mobileMenuOpen ? '#00E5FF' : 'rgba(180, 220, 220, 0.8)',
              }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </motion.div>
      </nav>

      {/* Mobile sidebar popup */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 md:hidden bg-black/40 backdrop-blur-sm"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-20 left-3 right-3 z-50 md:hidden overflow-hidden"
              dir="rtl"
              style={{
                background: 'linear-gradient(135deg, rgba(12, 50, 55, 0.97) 0%, rgba(8, 30, 38, 0.98) 100%)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(0, 191, 200, 0.2)',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="px-6 py-8 flex flex-col gap-1">
                {[
                  { id: 'home', label: 'الرئيسية' },
                  { id: 'about', label: 'عنّي' },
                  { id: 'services', label: 'الخدمات' },
                  { id: 'skills', label: 'منهجية العمل' },
                  { id: 'portfolio', label: 'المشاريع' },
                  { id: 'contact', label: 'تواصل' },
                ].map((item, i) => {
                  const isActive = activeSection === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, type: 'spring', damping: 20 }}
                      onClick={() => {
                        scrollToSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-right px-5 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer"
                      style={{
                        color: isActive ? '#00EFFF' : 'rgba(180, 220, 220, 0.7)',
                        background: isActive ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
                        fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                        fontSize: '17px',
                        fontWeight: 700,
                        textShadow: isActive ? '0 0 12px rgba(0,191,255,0.3)' : 'none',
                      }}
                    >
                      {item.label}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
