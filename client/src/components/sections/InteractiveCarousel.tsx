import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { carouselsAPI } from '../../lib/api';
import type { Carousel } from '../../types';

export default memo(function InteractiveCarouselSection() {
  // Fetch all carousels managed by Admin
  const { data: carousels } = useQuery({
    queryKey: ['carousels'],
    queryFn: () => carouselsAPI.getAll().then((r) => r.data as Carousel[]),
    staleTime: 60_000,
  });

  const activeCarousel = carousels && carousels.length > 0 ? carousels[0] : null;
  const images = activeCarousel?.images || [];
  const spacing = activeCarousel?.spacing ?? 16;

  if (!activeCarousel || images.length === 0) {
    return null;
  }

  // Duplicate images for seamless infinite loop
  const duplicatedImages = [...images, ...images];

  return (
    <section className="w-full py-8 md:py-12 bg-transparent relative z-20 overflow-hidden" dir="ltr">
      {/* Infinite Marquee Carousel */}
      <div className="marquee-container">
        <div
          className="marquee-track marquee-track-left"
          style={{ gap: `${spacing}px` }}
        >
          {duplicatedImages.map((imgUrl, idx) => (
            <div
              key={`${imgUrl}-${idx}`}
              className="relative flex-shrink-0 rounded-2xl md:rounded-3xl overflow-hidden border-2 border-black bg-[#082127]"
              style={{
                width: '391px',
                height: '524px',
                maxWidth: '85vw',
                maxHeight: '114vw',
                marginRight: idx < duplicatedImages.length - 1 ? `${spacing}px` : '0px',
              }}
            >
              <img
                src={imgUrl}
                alt={`Carousel card ${idx + 1}`}
                className="w-full h-full object-cover select-none pointer-events-none"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
