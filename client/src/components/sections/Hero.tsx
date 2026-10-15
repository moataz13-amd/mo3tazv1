import { memo, useRef } from 'react';
import { ArrowDown, ArrowUpLeft, MoveLeft } from 'lucide-react';
import { useSettingsStore } from '../../store';
import './Hero.css';

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


      <div className="modern-hero-content relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
        <div className="hero-identity">
          <span>{settings?.name || 'معتز جمعة'}</span>
          <span className="hero-identity-divider" aria-hidden="true" />
          <span className="hero-specialty">{settings?.title || 'مصمم جرافيك وهوية بصرية'}</span>
        </div>
        <h1
          className="hero-headline modern-hero-title"
        >
          <span>{headlineLines[0]}</span>
          {headlineLines.length > 1 && (
            <>
              <br />
              <span className="modern-hero-accent">
                {headlineLines.slice(1).join(' ')}
              </span>
            </>
          )}
        </h1>
        <p className="modern-hero-description">
          {settings?.subtitle || 'هويات بصرية وتصاميم تحكي قصتك، وتترك أثرًا يدوم.'}
        </p>
        <div className="modern-hero-actions">
          <a href="#portfolio" className="hero-action hero-action-primary">
            <span>استكشف أعمالي</span>
            <ArrowUpLeft size={22} aria-hidden="true" />
          </a>
          <a href="#contact" className="hero-action hero-action-secondary">
            <span>خلينا نبدأ مشروعك</span>
            <MoveLeft size={21} aria-hidden="true" />
          </a>
        </div>
        <div className="hero-bottom-line">
          <span dir="ltr">BRAND IDENTITY & GRAPHIC DESIGN</span>
          <a href="#about" aria-label="اكتشف المزيد عني" title="اكتشف المزيد عني" className="hero-scroll-link">
            <ArrowDown size={20} aria-hidden="true" />
          </a>
          <span>{settings?.location || 'مصر'} <span className="hero-bottom-accent">/</span> إبداع بلا حدود</span>
        </div>
      </div>

      {/* Infinite Marquee Service Carousel - Matching Reference 100% */}
      {row1Tags.length > 0 && (
        <div className="hero-service-strips w-full mb-16 z-30 flex flex-col gap-0 overflow-hidden">
          {/* Row 1: Left scrolling - Dark Background / White Text */}
          <div className="marquee-container w-full py-5 bg-[#050505]">
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
            <div className="marquee-container w-full py-5 bg-[#26EFFD]">
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
