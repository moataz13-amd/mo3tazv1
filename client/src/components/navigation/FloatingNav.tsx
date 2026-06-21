import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../../store';

const navItems = [
  { id: 'about', label: 'عنّي' },
  { id: 'services', label: 'الخدمات' },
  { id: 'skills', label: 'منهجية العمل' },
  { id: 'portfolio', label: 'المشاريع' },
];

export default function FloatingNav() {
  const { activeSection, setActiveSection } = useUIStore();
  const [scrolled, setScrolled] = useState(false);

  const scrollToSection = (id: string) => {
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

  // Intersection Observer to auto-detect active section
  useEffect(() => {
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
  }, [setActiveSection]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          {/* Logo — right side in RTL */}
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

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden" dir="rtl">
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-around px-4 py-3 mx-4 mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(18, 90, 90, 0.9) 0%, rgba(12, 60, 68, 0.95) 100%)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(0, 191, 200, 0.25)',
            borderRadius: '50px',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
          }}
        >
          {[
            { id: 'home', label: 'الرئيسية' },
            { id: 'services', label: 'الخدمات' },
            { id: 'skills', label: 'المنهجية' },
            { id: 'portfolio', label: 'المشاريع' },
            { id: 'contact', label: 'تواصل' },
          ].map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="flex flex-col items-center gap-0.5 transition-all cursor-pointer"
                style={{
                  color: isActive ? '#00E0FF' : 'rgba(180, 220, 220, 0.5)',
                  textShadow: isActive ? '0 0 10px rgba(0,191,255,0.5)' : 'none',
                }}
              >
                <span className="text-[11px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </motion.div>
      </nav>
    </>
  );
}
