import { memo, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
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
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const reducedMotion = useReducedMotion();
  const total = images.length;

  useEffect(() => {
    const resize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (total < 2 || reducedMotion) return;
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') setIndex((value) => value + 1);
    }, 2600);
    return () => clearInterval(timer);
  }, [total, reducedMotion]);

  if (!total) return null;
  const cardHeight = Math.min(480, viewport.height * 0.56, viewport.width < 640 ? viewport.width * 0.85 : 480);
  const cardWidth = cardHeight * 0.75;
  const radius = total === 1 ? 0 : Math.ceil(viewport.width / (cardWidth * 0.86) / 2) + 1;
  const slots = Array.from({ length: radius * 2 + 1 }, (_, slot) => {
    const offset = slot - radius;
    const position = index + offset;
    return { offset, position, imageIndex: ((position % total) + total) % total };
  });

  return (
    <section className="radial-carousel" dir="ltr" aria-label="معرض التصميمات" aria-roledescription="carousel">
      <div className="radial-carousel-stage">
        {slots.map(({ offset, position, imageIndex }) => (
          <motion.div
            key={position}
            className="radial-carousel-card"
            aria-hidden={offset !== 0}
            initial={false}
            animate={{
              x: offset * cardWidth * 0.92,
              y: Math.min(offset * offset * cardHeight * 0.035, cardHeight * 0.6),
              rotate: offset * 12,
              scale: offset === 0 ? 1 : 0.95,
            }}
            transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 100, damping: 12, mass: 1.1 }}
            style={{ width: cardWidth, height: cardHeight, zIndex: radius + 1 - Math.abs(offset) }}
          >
            <img src={images[imageIndex]} alt={`تصميم ${imageIndex + 1}`} draggable={false} decoding="async" />
          </motion.div>
        ))}
      </div>
    </section>
  );
});
