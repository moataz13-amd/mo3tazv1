import { memo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useSettingsStore } from '../../store';
import { clientLogosAPI } from '../../lib/api';

const StarDivider = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#26EFFD" className="mx-3.5 flex-shrink-0 opacity-80">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const ClientLogoItem = memo(function ClientLogoItem({ logo }: { logo: { name: string; src: string } }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="flex items-center justify-center h-10 md:h-12 px-3 py-1 opacity-80 hover:opacity-100 transition-opacity duration-200"
    >
      {logo.src && !imgError ? (
        <img
          src={logo.src}
          alt={logo.name || 'Client Logo'}
          className="h-full w-auto object-contain max-w-[120px]"
          loading="eager"
          decoding="async"
          onError={() => setImgError(true)}
        />
      ) : (
        <span 
          className="text-lg md:text-xl font-bold tracking-wide text-white/80 hover:text-[#26EFFD] transition-colors"
          style={{ fontFamily: "'Sahara Bold', 'Inter', sans-serif" }}
        >
          {logo.name}
        </span>
      )}
    </div>
  );
});

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

const Hero = memo(function Hero() {
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
  const clientLogos = fetchedLogos || [];

  const parseTags = (tags: any, fallback: any) => {
    if (Array.isArray(tags) && tags.length > 0) return tags;
    if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return fallback;
  };

  const row1Tags = parseTags(settings?.marquee_row1, defaultRow1Tags);
  const row2Tags = parseTags(settings?.marquee_row2, defaultRow2Tags);

  const headlineLines = headline.split('\n');

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-[92vh] overflow-hidden bg-[#082127]"
      dir="rtl"
    >
      {/* ===== STRONG ANIMATED WAVE GRADIENT FROM TOP ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* First wave — cyan primary, top right */}
        <motion.div
          animate={{
            x: ['0%', '12%', '-8%', '0%'],
            y: ['0%', '-10%', '8%', '0%'],
            scale: [1, 1.25, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-[800px] h-[600px] rounded-full"
          style={{
            top: '-50%',
            right: '-30%',
            background: 'radial-gradient(ellipse, rgba(0,229,255,0.22) 0%, rgba(0,191,255,0.08) 45%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />

        {/* Second wave — indigo depth, center bottom */}
        <motion.div
          animate={{
            x: ['0%', '-15%', '10%', '0%'],
            y: ['0%', '12%', '-10%', '0%'],
            scale: [1.1, 0.9, 1.2, 1.1],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-[900px] h-[700px] rounded-full"
          style={{
            bottom: '-20%',
            left: '10%',
            background: 'radial-gradient(ellipse, rgba(79,70,229,0.18) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />

        {/* Third wave — bright cyan accent, middle */}
        <motion.div
          animate={{
            x: ['10%', '-8%', '12%', '10%'],
            y: ['-5%', '15%', '-5%', '-5%'],
            scale: [0.95, 1.15, 1, 0.95],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-[550px] h-[550px] rounded-full"
          style={{
            top: '0%',
            left: '30%',
            background: 'radial-gradient(ellipse, rgba(0,191,255,0.18) 0%, rgba(6,182,212,0.06) 50%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />

        {/* Top-to-bottom fade overlay for wave falloff */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(8,33,39,0.5) 70%, #082127 100%)',
          }}
        />
      </div>

      {/* Main headline content - takes up full viewport height on initial load */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto min-h-[92vh] pt-28 pb-10">
        {/* Arabic Hero Headline */}
        <h1
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
        </h1>

        {/* Trusted By Section */}
        {clientLogos.length > 0 && (
          <div className="flex flex-col items-center gap-8">
            {/* Label */}
            {subheadline && (
              <div className="glow-pill">
                <CyanStar />
                <span>{subheadline}</span>
                <CyanStar />
              </div>
            )}

            {/* Client logos */}
            <div className="flex items-center gap-10 md:gap-14 flex-wrap justify-center">
              {clientLogos.map((logo, index) => (
                <ClientLogoItem key={`${logo.name}-${index}`} logo={logo} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Infinite Marquee Service Carousel - Pushed below the fold */}
      {row1Tags.length > 0 && (
        <div className="marquee-container mt-12 mb-16 w-full z-30">
          {/* Row 1: Left scrolling */}
          <div className="marquee-track marquee-track-left">
            {[...row1Tags, ...row1Tags, ...row1Tags, ...row1Tags].map((tag, idx) => (
              <div key={`r1-${idx}`} className="flex items-center flex-shrink-0">
                <div
                  className="px-6 py-2.5 rounded-xl text-sm md:text-base font-bold select-none flex-shrink-0"
                  style={{
                    background: tag.variant === 'solid' ? '#26EFFD' : '#0c3b47',
                    color: tag.variant === 'solid' ? '#082127' : '#26EFFD',
                    border: tag.variant === 'solid' ? 'none' : '1px solid rgba(38,239,253,0.35)',
                    fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                    fontSize: '15px',
                  }}
                >
                  {tag.text}
                </div>
                <StarDivider />
              </div>
            ))}
          </div>

          {/* Row 2: Right scrolling */}
          {row2Tags.length > 0 && (
            <div className="marquee-track marquee-track-right mt-3">
              {[...row2Tags, ...row2Tags, ...row2Tags, ...row2Tags].map((tag, idx) => (
                <div key={`r2-${idx}`} className="flex items-center flex-shrink-0">
                  <div
                    className="px-6 py-2.5 rounded-xl text-sm md:text-base font-bold select-none flex-shrink-0"
                    style={{
                      background: tag.variant === 'solid' ? '#26EFFD' : '#0c3b47',
                      color: tag.variant === 'solid' ? '#082127' : '#26EFFD',
                      border: tag.variant === 'solid' ? 'none' : '1px solid rgba(38,239,253,0.35)',
                      fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                      fontSize: '15px',
                    }}
                  >
                    {tag.text}
                  </div>
                  <StarDivider />
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
          background: 'linear-gradient(to top, var(--bg, #082127), transparent)',
        }}
      />
    </section>
  );
});

export default Hero;
