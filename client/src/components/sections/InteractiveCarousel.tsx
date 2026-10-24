import { memo, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { carouselsAPI } from '../../lib/api';
import type { Carousel } from '../../types';
import './RadialCarousel.css';

export default memo(function InteractiveCarouselSection() {
  const { data: carousels } = useQuery({
    queryKey: ['carousels'],
    queryFn: () => carouselsAPI.getAll().then((r) => r.data as Carousel[]),
    staleTime: 60_000,
  });
  const images = carousels?.[0]?.images || [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);
  const didSwipe = useRef(false);
  const reducedMotion = useReducedMotion();
  const total = images.length;
  const activeIndex = total ? index % total : 0;

  useEffect(() => {
    if (total < 2 || paused || reducedMotion) return;
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') setIndex((value) => (value + 1) % total);
    }, 4500);
    return () => clearInterval(timer);
  }, [total, paused, reducedMotion]);

  if (!total) return null;
  const step = (direction: number) => setIndex((value) => (value + direction + total) % total);
  const visible = images.map((src, position) => {
    let offset = (position - activeIndex + total) % total;
    if (offset > total / 2) offset -= total;
    return { src, position, offset };
  }).filter(({ offset }) => Math.abs(offset) <= 2);

  return (
    <section
      className="radial-carousel"
      dir="ltr"
      aria-label="معرض التصميمات"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
    >
      <div
        className="radial-carousel-stage"
        onPointerDown={(event) => { startX.current = event.clientX; didSwipe.current = false; event.currentTarget.setPointerCapture(event.pointerId); }}
        onPointerUp={(event) => {
          if (startX.current === null) return;
          const delta = event.clientX - startX.current;
          startX.current = null;
          if (Math.abs(delta) > 40) { didSwipe.current = true; step(delta < 0 ? 1 : -1); }
        }}
        onPointerCancel={() => { startX.current = null; }}
        onPointerLeave={() => { startX.current = null; }}
      >
        {visible.map(({ src, position, offset }) => (
          <motion.button
            type="button"
            key={position}
            className="radial-carousel-card"
            aria-label={`التصميم ${position + 1} من ${total}`}
            aria-current={offset === 0 ? 'true' : undefined}
            tabIndex={Math.abs(offset) <= 1 ? 0 : -1}
            initial={false}
            animate={{
              x: `${offset * 83}%`,
              y: `${Math.abs(offset) * 12}%`,
              rotate: offset * 18,
              scale: offset === 0 ? 1 : 0.92,
              opacity: Math.abs(offset) <= 1 ? 1 : 0,
            }}
            transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ zIndex: 10 - Math.abs(offset), pointerEvents: Math.abs(offset) > 1 ? 'none' : 'auto' }}
            onClick={() => {
              if (didSwipe.current) { didSwipe.current = false; return; }
              if (startX.current !== null) startX.current = null;
              setIndex(position);
            }}
          >
            <img src={src} alt={`تصميم ${position + 1}`} draggable={false} decoding="async" />
          </motion.button>
        ))}
      </div>
      {total > 1 && (
        <div className="radial-carousel-controls">
          <button type="button" onClick={() => step(-1)} aria-label="التصميم السابق" title="التصميم السابق"><ChevronLeft size={22} /></button>
          <span aria-live="polite" aria-atomic="true">{activeIndex + 1} / {total}</span>
          <button type="button" onClick={() => step(1)} aria-label="التصميم التالي" title="التصميم التالي"><ChevronRight size={22} /></button>
        </div>
      )}
    </section>
  );
});
