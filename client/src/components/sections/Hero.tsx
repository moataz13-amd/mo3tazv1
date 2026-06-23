import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useSettingsStore } from '../../store';
import { clientLogosAPI } from '../../lib/api';

const defaultClientLogos = [
  { name: 'بيرفكت', src: '/logos/perfect.png' },
  { name: 'EGYFIELD', src: '/logos/egyfield.png' },
  { name: 'معتز', src: '/logos/moataz.png' },
  { name: 'المعاهد التعليمية', src: '/logos/institutes.png' },
];

const defaultRow1Tags = [
  { text: 'تصميم الهوية', variant: 'glass' as const },
  { text: 'تصميم الشعارات', variant: 'solid' as const },
  { text: 'براندنج', variant: 'solid' as const },
  { text: 'تصاميم سوشيال ميديا', variant: 'solid' as const },
  { text: 'تصميم الشعارات', variant: 'solid' as const },
  { text: 'براندنج', variant: 'solid' as const },
  { text: 'تصاميم سوشيال ميديا', variant: 'solid' as const },
];

const defaultRow2Tags = [
  { text: 'المطبوعات', variant: 'glass' as const },
  { text: 'براندنج', variant: 'solid' as const },
  { text: 'واجهات المستخدم', variant: 'solid' as const },
  { text: 'تصميم التغليف', variant: 'solid' as const },
  { text: 'إنفوجرافيك', variant: 'solid' as const },
  { text: 'تصميم العروض التقديمية', variant: 'glass' as const },
];

const Spark8Icon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30 mx-4 flex-shrink-0 animate-pulse">
    <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
  </svg>
);

const CyanStar = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="#26EFFD" 
    className="drop-shadow-[0_0_8px_rgba(38,239,253,0.9)] flex-shrink-0"
  >
    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z" />
  </svg>
);

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const settings = useSettingsStore((state) => state.settings);

  // Fetch client logos from dedicated endpoint
  const { data: fetchedLogos } = useQuery({
    queryKey: ['client-logos'],
    queryFn: () => clientLogosAPI.getAll().then((r) => r.data as { id: string; name: string; src: string; order: number }[]),
    staleTime: 120_000,
  });

  const headline = settings?.hero_headline || "حين يجتمع الإبداع مع التفاصيل\nتولد تصاميم استثنائية.";
  const subheadline = settings?.hero_subheadline || "موثوق من قبل";
  const clientLogos = fetchedLogos && fetchedLogos.length > 0 ? fetchedLogos : defaultClientLogos;
  const [storedMarquee, setStoredMarquee] = useState<{row1: any[]; row2: any[]}>(() => {
    try {
      return {
        row1: JSON.parse(localStorage.getItem('portfolio_marquee_row1') || '[]'),
        row2: JSON.parse(localStorage.getItem('portfolio_marquee_row2') || '[]'),
      };
    } catch { return { row1: [], row2: [] }; }
  });
  const row1Tags = settings?.marquee_row1?.length ? settings.marquee_row1 : (storedMarquee.row1.length ? storedMarquee.row1 : defaultRow1Tags);
  const row2Tags = settings?.marquee_row2?.length ? settings.marquee_row2 : (storedMarquee.row2.length ? storedMarquee.row2 : defaultRow2Tags);
  const marqueeDuration = Math.max(180, row1Tags.length * 30);

  const headlineLines = headline.split('\n');

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative w-full flex flex-col items-center justify-between overflow-hidden"
      dir="rtl"
    >
      {/* ===== STRONG ANIMATED WAVE GRADIENT FROM TOP ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Primary wave — large cyan glow flowing from top */}
        <motion.div
          animate={{
            x: ['-10%', '15%', '-5%', '-10%'],
            y: ['-20%', '-10%', '-25%', '-20%'],
            scale: [1, 1.2, 0.95, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-[900px] h-[700px] rounded-full"
          style={{
            top: '-15%',
            left: '10%',
            background: 'radial-gradient(ellipse, rgba(38,239,253,0.25) 0%, rgba(38,239,253,0.08) 40%, transparent 100%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Secondary wave — indigo accent from top-right */}
        <motion.div
          animate={{
            x: ['5%', '-20%', '10%', '5%'],
            y: ['-15%', '-5%', '-20%', '-15%'],
            scale: [1, 0.9, 1.15, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-[800px] h-[600px] rounded-full"
          style={{
            top: '-10%',
            right: '-5%',
            background: 'radial-gradient(ellipse, rgba(79,70,229,0.22) 0%, rgba(79,70,229,0.06) 45%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />

        {/* Third wave — teal shimmer center-top */}
        <motion.div
          animate={{
            x: ['0%', '10%', '-15%', '0%'],
            y: ['-5%', '5%', '-10%', '-5%'],
            scale: [1.1, 0.85, 1.2, 1.1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-[700px] h-[500px] rounded-full"
          style={{
            top: '0%',
            left: '30%',
            background: 'radial-gradient(ellipse, rgba(0,191,255,0.18) 0%, rgba(6,182,212,0.06) 50%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />

        {/* Fourth wave — subtle deep purple from left */}
        <motion.div
          animate={{
            x: ['-5%', '10%', '-10%', '-5%'],
            y: ['0%', '-15%', '5%', '0%'],
            scale: [0.9, 1.1, 0.95, 0.9],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-[600px] h-[500px] rounded-full"
          style={{
            top: '5%',
            left: '-5%',
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 60%)',
            filter: 'blur(110px)',
          }}
        />

        {/* Top-to-bottom fade overlay for wave falloff */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(5,8,22,0.5) 70%, #050816 100%)',
          }}
        />
      </div>

      {/* Main headline content - takes up full viewport height on initial load */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto min-h-[92vh] pt-28 pb-10">
        {/* Arabic Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="hero-headline leading-tight mb-14"
          style={{
            fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif",
            fontSize: 'clamp(2.5rem, 7.5vw, 6rem)',
            fontWeight: 900,
            lineHeight: 1.25,
            color: '#FFFFFF',
            filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.3))',
          }}
        >
          <span>{headlineLines[0]}</span>
          {headlineLines.length > 1 && (
            <>
              <br />
              <span
                style={{
                  backgroundImage: 'linear-gradient(135deg, #26EFFD 0%, #26EFFD 50%, #26EFFD 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {headlineLines.slice(1).join(' ')}
              </span>
            </>
          )}
        </motion.h1>

        {/* Trusted By Section */}
        {clientLogos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Label */}
            <div className="glow-pill">
              <CyanStar />
              <span>{subheadline}</span>
              <CyanStar />
            </div>

            {/* Client logos */}
            <div className="flex items-center gap-10 md:gap-14 flex-wrap justify-center">
              {clientLogos.map((logo, index) => (
                <motion.div
                  key={`${logo.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  className="flex items-center justify-center h-10 md:h-12 transition-all duration-300"
                  style={{
                    filter: 'none',
                    opacity: 0.8,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.8';
                  }}
                >
                  <img
                    src={logo.src}
                    alt={logo.name || 'Client Logo'}
                    className="h-full w-auto object-contain max-w-[120px]"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Infinite Marquee Service Carousel - Pushed below the fold */}
      {row1Tags.length > 0 && (
        <div className="marquee-container mt-12 mb-16 w-full z-30" style={{ '--marquee-duration': `${marqueeDuration}s` } as React.CSSProperties}>
          {/* Row 1: Left scrolling */}
          <div className="marquee-track marquee-track-left">
            {[...row1Tags, ...row1Tags, ...row1Tags, ...row1Tags].map((tag, idx) => (
              <div key={`r1-${idx}`} className="flex items-center">
                <div
                  className="px-6 py-2 rounded-full text-sm select-none flex-shrink-0"
                  style={{
                    background: tag.variant === 'solid' ? '#00E5FF' : 'rgba(255, 255, 255, 0.08)',
                    color: tag.variant === 'solid' ? '#000000' : '#26EFFD',
                    border: tag.variant === 'solid' ? 'none' : '1px solid rgba(38, 239, 253, 0.3)',
                    fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                    fontSize: '15px',
                  }}
                >
                  {tag.text}
                </div>
                <Spark8Icon />
              </div>
            ))}
          </div>

          {/* Row 2: Right scrolling */}
          {row2Tags.length > 0 && (
            <div className="marquee-track marquee-track-right mt-1">
              {[...row2Tags, ...row2Tags, ...row2Tags, ...row2Tags].map((tag, idx) => (
                <div key={`r2-${idx}`} className="flex items-center">
                  <div
                    className="px-6 py-2 rounded-full text-sm select-none flex-shrink-0"
                    style={{
                      background: tag.variant === 'solid' ? '#00E5FF' : 'rgba(255, 255, 255, 0.08)',
                      color: tag.variant === 'solid' ? '#000000' : '#26EFFD',
                      border: tag.variant === 'solid' ? 'none' : '1px solid rgba(38, 239, 253, 0.3)',
                      fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                      fontSize: '15px',
                    }}
                  >
                    {tag.text}
                  </div>
                  <Spark8Icon />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, var(--bg, #050816), transparent)',
        }}
      />
    </section>
  );
}
