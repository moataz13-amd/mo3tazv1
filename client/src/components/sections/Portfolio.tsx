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
    else if (offset === 0) onNavigate(project);
  }, [offset, onPrev, onNext, onNavigate, project]);

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
      className={`absolute top-0 w-full max-w-[960px] h-full rounded-[20px] sm:rounded-[32px] md:rounded-[42px] overflow-hidden select-none cursor-pointer group ${
        isActive
          ? 'border-2 border-[#26EFFD] shadow-[6px_6px_0px_rgba(38,239,253,0.6),0_8px_0px_rgba(0,0,0,0.9)]'
          : 'border border-white/10'
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
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
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
  hideText?: boolean;
}

const Carousel3DSection = memo(function Carousel3DSection({
  id,
  subtitle,
  titlePrefix,
  titleHighlight,
  items,
  hideText = false,
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

  // Touch Swipe Handlers for mobile & tablet
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  }, [handleNext, handlePrev]);

  // Mouse Swipe / Drag Handlers for desktop
  const mouseStartX = useRef<number | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
  }, []);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (mouseStartX.current === null) return;
    const deltaX = e.clientX - mouseStartX.current;
    mouseStartX.current = null;

    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  }, [handleNext, handlePrev]);

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

        {/* 3D Stage with Touch & Mouse Swipe Support */}
        {total === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <div className="inline-flex flex-col items-center gap-3 px-8 py-10 rounded-3xl border-2 border-dashed border-white/15 bg-white/[0.02]">
              <p className="text-gray-500 text-sm font-bold" style={{ fontFamily: "'Sahara Bold', 'Inter', sans-serif" }}>
                لا توجد عناصر في هذا القسم بعد
              </p>
            </div>
          </div>
        ) : (
        <div
          className="relative w-full flex items-center justify-center min-h-[240px] sm:min-h-[360px] md:min-h-[520px] lg:min-h-[580px] py-2 sm:py-4 cursor-grab active:cursor-grabbing select-none"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          style={{ touchAction: 'pan-y' }}
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

        {/* Group / Project Title outside the card */}
        {!hideText && total > 0 && items[currentIndex] && (
          <AnimatePresence mode="wait">
            <motion.div
              key={items[currentIndex].id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              onClick={() => handleNavigate(items[currentIndex])}
              className="text-center cursor-pointer group max-w-2xl mx-auto px-4 mt-1 mb-1"
            >
              <h3
                className="text-2xl sm:text-3xl md:text-4xl font-black text-white group-hover:text-[#26EFFD] transition-colors duration-200"
                style={{ fontFamily: "'Sahara Bold', 'Milan Display', sans-serif" }}
              >
                {items[currentIndex].title || items[currentIndex].internal_name || 'غير مسمى'}
              </h3>
              {items[currentIndex].description && (
                <p className="text-gray-300 text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed">
                  {items[currentIndex].description}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
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
