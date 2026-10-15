import { memo, useRef } from 'react';
import { useSettingsStore } from '../../store';

const StarDivider = ({ fill = "#26EFFD" }: { fill?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={fill} className="mx-5 flex-shrink-0">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
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

  const headline = settings?.hero_headline || "حين يجتمع الإبداع مع التفاصيل\nتولد تصاميم استثنائية.";

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
      className="relative min-h-[92vh] overflow-hidden bg-transparent"
      dir="rtl"
    >


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

      </div>

      {/* Infinite Marquee Service Carousel - Matching Reference 100% */}
      {row1Tags.length > 0 && (
        <div className="w-full mt-12 mb-16 z-30 flex flex-col gap-0 overflow-hidden">
          {/* Row 1: Left scrolling - Dark Background / White Text */}
          <div className="marquee-container w-full py-10 bg-[#050505]">
            <div className="marquee-track marquee-track-left">
              {[...row1Tags, ...row1Tags, ...row1Tags, ...row1Tags, ...row1Tags].map((tag, idx) => (
                <div key={`r1-${idx}`} className="flex items-center flex-shrink-0">
                  <span
                    className="text-3xl md:text-4xl font-black text-white select-none tracking-wide"
                    style={{ fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif" }}
                  >
                    {tag.text}
                  </span>
                  <StarDivider />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Right scrolling - FULL WIDTH SOLID CYAN/MINT BANNER / Black Text */}
          {row2Tags.length > 0 && (
            <div className="marquee-container w-full py-10 bg-[#26EFFD]">
              <div className="marquee-track marquee-track-right">
                {[...row2Tags, ...row2Tags, ...row2Tags, ...row2Tags, ...row2Tags].map((tag, idx) => (
                  <div key={`r2-${idx}`} className="flex items-center flex-shrink-0">
                    <span
                      className="text-3xl md:text-4xl font-black text-black select-none tracking-wide"
                      style={{ fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif" }}
                    >
                      {tag.text}
                    </span>
                    <StarDivider fill="#000000" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
});

export default Hero;
