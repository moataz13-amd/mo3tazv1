import { memo, useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { carouselsAPI } from '../../lib/api';
import type { Carousel } from '../../types';

export default memo(function InteractiveCarouselSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Drag / Touch scroll state
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch all carousels managed by Admin
  const { data: carousels } = useQuery({
    queryKey: ['carousels'],
    queryFn: () => carouselsAPI.getAll().then((r) => r.data as Carousel[]),
    staleTime: 60_000,
  });

  const activeCarousel = carousels && carousels.length > 0 ? carousels[0] : null;
  const images = activeCarousel?.images || [];
  const spacing = activeCarousel?.spacing ?? 16;

  // Mouse Drag handlers for smooth horizontal pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isMouseDown.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 5) setIsDragging(true);
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isMouseDown.current = false;
    setTimeout(() => setIsDragging(false), 50);
  };

  if (!activeCarousel || images.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 md:py-16 bg-transparent relative z-20 overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6 text-center">
        <h2
          className="text-2xl md:text-3xl font-black text-white tracking-wide"
          style={{ fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif" }}
        >
          {activeCarousel.title || 'معرض الكاروسيل'}
        </h2>
      </div>

      {/* Infinite/Pan Interactive Horizontal Carousel Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="w-full overflow-x-auto scrollbar-none flex items-center py-6 px-4 md:px-12 cursor-grab active:cursor-grabbing select-none"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          className="flex items-center mx-auto"
          style={{ gap: `${spacing}px` }}
        >
          {images.map((imgUrl, idx) => (
            <motion.div
              key={`${imgUrl}-${idx}`}
              whileHover={{ scale: 1.03, y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => {
                if (!isDragging) setLightboxImage(imgUrl);
              }}
              className="relative flex-shrink-0 rounded-2xl md:rounded-3xl overflow-hidden border-2 border-black bg-[#082127] shadow-[6px_6px_0px_#000000] hover:shadow-[10px_10px_0px_#26EFFD] transition-all duration-300 group cursor-pointer"
              style={{
                width: '391px',
                height: '524px',
                maxWidth: '85vw',
                maxHeight: '114vw',
              }}
            >
              <img
                src={imgUrl}
                alt={`Carousel card ${idx + 1}`}
                className="w-full h-full object-cover select-none pointer-events-none"
                loading="lazy"
                decoding="async"
              />

              {/* Hover overlay glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span
                  className="text-white text-sm font-bold bg-[#082127]/90 border border-[#26EFFD] px-4 py-2 rounded-full shadow-[2px_2px_0px_#26EFFD]"
                  style={{ fontFamily: "'Sahara Bold', 'Inter', sans-serif" }}
                >
                  اضغط للتكبير
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-[92vw] max-h-[90vh]">
            <img
              src={lightboxImage}
              alt="Enlarged design"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl border-4 border-black shadow-[8px_8px_0px_#26EFFD]"
            />
          </div>
        </div>
      )}
    </section>
  );
});
