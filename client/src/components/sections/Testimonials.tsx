import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { testimonialsAPI } from '../../lib/api';
import type { Testimonial } from '../../types';

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    client_name: 'Sarah Mitchell',
    client_title: 'CEO',
    client_company: 'TechVenture Inc.',
    client_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    content: 'Absolutely exceptional work! The portfolio platform delivered exceeded all expectations. The 3D visuals and animations are stunning — our conversions increased by 40% after launch.',
    rating: 5,
    project_type: 'Web Development',
    status: 'active',
    created_at: '',
  },
  {
    id: '2',
    client_name: 'James Chen',
    client_title: 'Product Director',
    client_company: 'InnovateLab',
    client_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    content: 'The UI/UX redesign transformed our product completely. Users love the new interface and our NPS score jumped from 32 to 78. Professional, creative, and delivered on time.',
    rating: 5,
    project_type: 'UI/UX Design',
    status: 'active',
    created_at: '',
  },
  {
    id: '3',
    client_name: 'Amira Hassan',
    client_title: 'Founder',
    client_company: 'Cosmos Brand',
    client_photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    content: 'The brand identity created for us is perfect. It captures our vision beautifully and has received tremendous positive feedback from our clients and partners worldwide.',
    rating: 5,
    project_type: 'Branding',
    status: 'active',
    created_at: '',
  },
  {
    id: '4',
    client_name: 'Marcus Williams',
    client_title: 'CTO',
    client_company: 'DataFlow Systems',
    client_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    content: 'Outstanding technical skills paired with incredible design sensibility. The dashboard built for us handles millions of data points beautifully. Highly recommend!',
    rating: 5,
    project_type: 'Web Development',
    status: 'active',
    created_at: '',
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const { data: testimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => testimonialsAPI.getAll(true).then((r) => r.data as Testimonial[]),
    staleTime: 120_000,
  });

  const all = (testimonials && testimonials.length > 0) ? testimonials : defaultTestimonials;

  // Auto-advance
  useEffect(() => {
    if (all.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % all.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [all.length]);

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + all.length) % all.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((c) => (c + 1) % all.length);
  };

  const t = all[current % all.length];

  return (
    <section id="testimonials" className="py-4 px-6">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-mono"
            style={{ background: 'rgba(0,191,255,0.08)', border: '1px solid rgba(0,191,255,0.2)', color: '#00BFFF' }}
          >
            ◭ CLIENT REVIEWS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit' }}>
            What Clients <span className="gradient-text">Say</span>
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Real feedback from real partnerships
          </p>
        </div>

        {/* Carousel */}
        <div className="glass-card p-8 relative overflow-hidden">
          {/* Quote mark */}
          <div
            className="absolute top-6 right-8 text-8xl font-serif leading-none opacity-10"
            style={{ color: '#00BFFF' }}
          >
            "
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 60 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="relative z-10"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" stroke="none" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-lg mb-6" style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontStyle: 'italic' }}>
                "{t.content}"
              </p>

              {/* Client info */}
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
                  style={{ border: '2px solid rgba(0,191,255,0.4)' }}
                >
                  {t.client_photo ? (
                    <img src={t.client_photo} alt={t.client_name} className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center font-bold"
                      style={{ background: 'rgba(0,191,255,0.2)', color: '#00BFFF' }}
                    >
                      {t.client_name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-white">{t.client_name}</div>
                  <div className="text-sm" style={{ color: 'rgba(0,191,255,0.7)' }}>
                    {t.client_title}, {t.client_company}
                  </div>
                  {t.project_type && (
                    <div
                      className="text-xs mt-0.5 font-mono"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >
                      {t.project_type}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex gap-2">
              {all.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === current ? '24px' : '8px',
                    height: '8px',
                    background: i === current ? '#00BFFF' : 'rgba(255,255,255,0.2)',
                    boxShadow: i === current ? '0 0 10px #00BFFF' : 'none',
                  }}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all neon-btn"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all neon-btn-solid"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
