import { memo, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import { projectsAPI } from '../../lib/api';
import type { Project } from '../../types';

const AUTOPLAY_DURATION = 5000;

// Lightweight responsive hook using matchMedia (zero DOM reflows)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 639px)').matches : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(max-width: 639px)');
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  return isMobile;
}

/* ─── Single Card (memoized to avoid needless re-render) ─── */
const CarouselCard = memo(function CarouselCard({
  project,
  offset,
  isActive,
  isSmallScreen,
  onPrev,
  onNext,
  onNavigate,
}: {
  project: Project;
  offset: number;
  isActive: boolean;
  isSmallScreen: boolean;
  onPrev: () => void;
  onNext: () => void;
  onNavigate: (p: Project) => void;
}) {
  // Responsive transform values for mobile vs desktop
  const xOffset = isSmallScreen ? 44 : 55;
  const xPercent = offset === 0 ? 0 : offset < 0 ? -xOffset : xOffset;
  const cardScale = isActive ? 1 : isSmallScreen ? 0.82 : 0.78;
  const cardOpacity = isActive ? 1 : 0.45;
  const zIndex = isActive ? 20 : 10;

  const handleClick = useCallback(() => {
    if (offset === -1) onPrev();
    else if (offset === 1) onNext();
  }, [offset, onPrev, onNext]);

  const handleViewClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onNavigate(project);
    },
    [project, onNavigate],
  );

  return (
    <motion.div
      layout={false}
      onClick={handleClick}
      initial={false}
      animate={{
        x: `${xPercent}%`,
        scale: cardScale,
        opacity: cardOpacity,
      }}
      transition={{
        type: 'tween',
        ease: [0.25, 0.1, 0.25, 1],   // cubic-bezier – buttery smooth
        duration: 0.55,
      }}
      className={`absolute top-0 w-full max-w-[960px] h-full rounded-[20px] sm:rounded-[32px] md:rounded-[42px] overflow-hidden select-none ${
        isActive
          ? 'border-2 border-[#26EFFD] shadow-[0_0_30px_rgba(38,239,253,0.35),0_8px_24px_rgba(0,0,0,0.7)] cursor-default'
          : 'border border-white/10 cursor-pointer'
      }`}
      style={{
        zIndex,
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        contain: 'layout style paint',
        transform: 'translateZ(0)',     // force GPU compositing layer
      }}
    >
      {/* Image – native lazy + decoding async for off-screen perf */}
      <div className="relative w-full h-full bg-[#050B14]">
        <img
          src={project.cover_image}
          alt={project.title}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />

        {/* Clean overlay – only at the bottom for text readability */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-10 lg:p-12"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 35%, transparent 60%)',
          }}
        >
          <div className="flex flex-col gap-1 max-w-2xl pb-10 sm:pb-0">
            <h3
              className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight"
              style={{ fontFamily: "'Sahara Bold', 'Milan Display', sans-serif" }}
            >
              {project.title}
            </h3>
            {project.description && (
              <p className="text-gray-300 text-[11px] sm:text-xs md:text-sm line-clamp-1 sm:line-clamp-2 mt-0.5">
                {project.description}
              </p>
            )}
          </div>

          {/* View button – only when show_details_btn is explicitly true */}
          {(() => {
            const raw = (project as any).show_details_btn;
            const showBtn = raw === true || raw === 'true';
            return (
              <AnimatePresence>
                {isActive && showBtn && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 md:bottom-10 md:left-10 z-30"
                  >
                    <button
                      onClick={handleViewClick}
                      className="px-4 py-1.5 sm:px-6 sm:py-2 md:px-8 md:py-2.5 bg-white text-black border-2 border-black rounded-full font-black text-[11px] sm:text-xs md:text-sm shadow-[2px_2px_0px_#000] sm:shadow-[3px_3px_0px_#000] hover:bg-[#26EFFD] active:scale-95 cursor-pointer flex items-center gap-1.5"
                      style={{
                        fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                        transition: 'box-shadow 0.15s, background 0.2s, transform 0.1s',
                      }}
                    >
                      <span>عرض التفاصيل</span>
                      <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })()}
        </div>
      </div>
    </motion.div>
  );
});

/* ─── Carousel Section (reusable) ─── */
interface Carousel3DSectionProps {
  id: string;
  subtitle: string;
  titlePrefix: string;
  titleHighlight: string;
  items: Project[];
}

const Carousel3DSection = memo(function Carousel3DSection({
  id,
  subtitle,
  titlePrefix,
  titleHighlight,
  items,
}: Carousel3DSectionProps) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-20px' });
  const isSmallScreen = useIsMobile();

  const [currentIndex, setCurrentIndex] = useState(0);
  const isPausedRef = useRef(false);           // ref instead of state – avoids re-renders on hover
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = items.length;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNavigate = useCallback(
    (project: Project) => {
      navigate(`/project/${project.id}`, { state: { project } });
    },
    [navigate],
  );

  // Auto-play timer: pauses when section is scrolled offscreen or browser tab is hidden
  useEffect(() => {
    if (total <= 1 || !isInView) return;

    timerRef.current = setInterval(() => {
      if (!isPausedRef.current && document.visibilityState === 'visible') {
        handleNext();
      }
    }, AUTOPLAY_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isInView, handleNext]);

  const handleMouseEnter = useCallback(() => { isPausedRef.current = true; }, []);
  const handleMouseLeave = useCallback(() => { isPausedRef.current = false; }, []);

  // Pre-compute visible cards array (max 3 at a time) – avoids work inside render
  const visibleCards = useMemo(() => {
    const result: { project: Project; offset: number; isActive: boolean }[] = [];
    for (let i = 0; i < total; i++) {
      let diff = i - currentIndex;
      if (diff > Math.floor(total / 2)) diff -= total;
      if (diff < -Math.floor(total / 2)) diff += total;
      if (Math.abs(diff) <= 1) {
        result.push({ project: items[i], offset: diff, isActive: diff === 0 });
      }
    }
    // sort so active card renders last (on top in DOM = on top visually)
    return result.sort((a, b) => Math.abs(a.offset) - Math.abs(b.offset)).reverse();
  }, [currentIndex, items, total]);

  return (
    <section
      id={id}
      className="py-10 md:py-16 px-4 md:px-6 relative z-10 overflow-hidden"
      dir="rtl"
      style={{ contain: 'layout style' }}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-10"
      >
        {/* Header */}
        <div className="text-center">
          {subtitle && (
            <div
              className="mb-2 text-xs md:text-sm font-bold tracking-wider uppercase"
              style={{
                color: '#26EFFD',
                fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif",
              }}
            >
              {subtitle}
            </div>
          )}
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight flex items-center justify-center gap-3"
            style={{ fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif" }}
          >
            {titlePrefix} <span style={{ color: '#26EFFD' }}>{titleHighlight}</span>
          </h2>
        </div>

        {/* 3D Stage – proportional aspect scaling on mobile */}
        {total === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <div className="inline-flex flex-col items-center gap-3 px-8 py-10 rounded-3xl border-2 border-dashed border-white/15 bg-white/[0.02]">
              <div className="text-3xl sm:text-4xl">🎨</div>
              <p className="text-gray-500 text-sm font-bold" style={{ fontFamily: "'Sahara Bold', 'Inter', sans-serif" }}>
                لا توجد عناصر في هذا القسم بعد
              </p>
              <p className="text-gray-600 text-xs">يتم إضافة التصاميم من لوحة التحكم</p>
            </div>
          </div>
        ) : (
        <div
          className="relative w-full flex items-center justify-center min-h-[240px] sm:min-h-[360px] md:min-h-[520px] lg:min-h-[580px] py-2 sm:py-4"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="relative w-full max-w-[960px] h-[230px] sm:h-[340px] md:h-[480px] lg:h-[540px] flex items-center justify-center"
            style={{ perspective: '1200px' }}
          >
            {visibleCards.map(({ project, offset, isActive }) => (
              <CarouselCard
                key={project.id}
                project={project}
                offset={offset}
                isActive={isActive}
                isSmallScreen={isSmallScreen}
                onPrev={handlePrev}
                onNext={handleNext}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        </div>
        )}

        {/* Navigation Buttons + Dashed Line */}
        {total > 0 && (
        <div className="w-full max-w-[960px] mx-auto flex items-center justify-between gap-3 sm:gap-4 mt-1 sm:mt-2">
          <button
            onClick={handlePrev}
            className="px-6 sm:px-10 md:px-14 py-2 sm:py-2.5 md:py-3 rounded-full bg-[#050816] border-[2.5px] border-[#26EFFD] text-[#26EFFD] font-black text-sm sm:text-base md:text-lg shadow-[3px_3px_0px_#26EFFD] sm:shadow-[5px_5px_0px_#26EFFD] hover:bg-[#26EFFD]/10 active:shadow-[0px_0px_0px_#26EFFD] active:translate-x-[3px] active:translate-y-[3px] sm:active:translate-x-[5px] sm:active:translate-y-[5px] cursor-pointer select-none"
            style={{
              fontFamily: "'Sahara Bold', 'Inter', sans-serif",
              transition: 'all 0.15s ease-out',
            }}
          >
            السابق
          </button>

          <div className="flex-1 h-[2px] flex items-center" aria-hidden>
            <div className="w-full border-t-2 border-dashed border-[#26EFFD]/50" />
          </div>

          <button
            onClick={handleNext}
            className="px-6 sm:px-10 md:px-14 py-2 sm:py-2.5 md:py-3 rounded-full bg-[#050816] border-[2.5px] border-[#26EFFD] text-[#26EFFD] font-black text-sm sm:text-base md:text-lg shadow-[3px_3px_0px_#26EFFD] sm:shadow-[5px_5px_0px_#26EFFD] hover:bg-[#26EFFD]/10 active:shadow-[0px_0px_0px_#26EFFD] active:translate-x-[3px] active:translate-y-[3px] sm:active:translate-x-[5px] sm:active:translate-y-[5px] cursor-pointer select-none"
            style={{
              fontFamily: "'Sahara Bold', 'Inter', sans-serif",
              transition: 'all 0.15s ease-out',
            }}
          >
            التالي
          </button>
        </div>
        )}
      </motion.div>
    </section>
  );
});

/* ─── Portfolio wrapper ─── */
const Portfolio = memo(function Portfolio() {
  const { data: dbProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.getAll({ status: 'published' }).then((r) => r.data as Project[]),
    staleTime: 120_000,
  });

  const { mockupsList, projectsList } = useMemo(() => {
    const all = Array.isArray(dbProjects) ? dbProjects : [];

    const isMockup = (p: Project) =>
      p.category === 'mockup' || p.category === 'branding' || p.title.toLowerCase().includes('mockup');

    // Mockup carousel: only mockup/branding category items
    const mockups = all.filter(isMockup);

    // Featured carousel: featured items that are NOT in the mockup carousel (no duplication)
    const featured = all.filter((p) => p.featured && !isMockup(p));

    // Fallback: if no featured, show all non-mockup items
    const nonMockups = all.filter((p) => !isMockup(p));

    return {
      mockupsList: mockups,
      projectsList: featured.length > 0 ? featured : nonMockups,
    };
  }, [dbProjects]);

  return (
    <div className="flex flex-col gap-8 md:gap-16">
      {/* 1. Mockup Showcase Section (Upper Section) */}
      <Carousel3DSection
        id="mockups"
        subtitle=""
        titlePrefix=""
        titleHighlight="الموك آب"
        items={mockupsList}
      />

      {/* 2. Featured Projects Section (Main Portfolio Section) */}
      <Carousel3DSection
        id="portfolio"
        subtitle="معرض الأعمال"
        titlePrefix="المشاريع"
        titleHighlight="المميزة"
        items={projectsList}
      />
    </div>
  );
});

export default Portfolio;
