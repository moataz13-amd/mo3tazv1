import { useState, useEffect, useCallback } from 'react';
import { useSettingsStore } from '../store';

const StarDivider = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#26EFFD" className="mx-3.5 flex-shrink-0 opacity-80">
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

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const settings = useSettingsStore((state) => state.settings);

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

  const finishLoading = useCallback(() => {
    setProgress(100);
    setFadeOut(true);
    setTimeout(() => onComplete(), 500);
  }, [onComplete]);

  useEffect(() => {
    let progressInterval: ReturnType<typeof setInterval>;
    let completed = false;

    const trackLoading = () => {
      setProgress(40);
      let current = 40;
      progressInterval = setInterval(() => {
        if (completed) return;
        const docReady = document.readyState === 'complete';
        const increment = docReady ? 25 : 10;
        current = Math.min(current + increment, 100);
        setProgress(Math.round(current));

        if (current >= 100 || docReady) {
          completed = true;
          clearInterval(progressInterval);
          finishLoading();
        }
      }, 50);

      if (document.readyState === 'complete') {
        if (!completed) {
          completed = true;
          clearInterval(progressInterval);
          finishLoading();
        }
      } else {
        window.addEventListener('load', () => {
          if (!completed) {
            completed = true;
            clearInterval(progressInterval);
            finishLoading();
          }
        }, { once: true });
      }

      setTimeout(() => {
        if (!completed) {
          completed = true;
          clearInterval(progressInterval);
          finishLoading();
        }
      }, 1200);
    };

    trackLoading();
    return () => clearInterval(progressInterval);
  }, [finishLoading]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between py-10 transition-opacity duration-500 overflow-hidden ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ background: '#082127' }}
      dir="rtl"
    >
      {/* Ambient background glow */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          width: '700px',
          height: '700px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(38,239,253,0.14) 0%, rgba(8,33,39,0) 70%)',
        }}
      />

      {/* Top Marquee Track */}
      <div className="marquee-container w-full z-10 opacity-75">
        <div className="marquee-track marquee-track-left">
          {[...row1Tags, ...row1Tags, ...row1Tags, ...row1Tags].map((tag, idx) => (
            <div key={`splash-r1-${idx}`} className="flex items-center flex-shrink-0">
              <div
                className="px-6 py-2.5 rounded-xl text-sm md:text-base font-bold select-none flex-shrink-0"
                style={{
                  background: tag.variant === 'solid' ? '#26EFFD' : '#0c3b47',
                  color: tag.variant === 'solid' ? '#082127' : '#26EFFD',
                  border: tag.variant === 'solid' ? 'none' : '1px solid rgba(38,239,253,0.35)',
                  fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                }}
              >
                {tag.text}
              </div>
              <StarDivider />
            </div>
          ))}
        </div>
      </div>

      {/* Center Section: Glowing Logo & Progress */}
      <div className="relative z-20 flex flex-col items-center justify-center gap-6 my-auto">
        <div className="relative flex items-center justify-center px-8 py-5 rounded-2xl bg-[#082127]/90 backdrop-blur-xl border border-[#26EFFD]/30 shadow-[0_0_50px_rgba(38,239,253,0.25)]">
          <img
            src="/Mo3taz..svg"
            alt="MO3TAZ."
            style={{
              height: '52px',
              filter:
                'brightness(0) saturate(100%) invert(75%) sepia(60%) saturate(500%) hue-rotate(145deg) brightness(1.1)',
              animation: 'splashLogoGlow 2s ease-in-out infinite',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <span
            className="font-bold text-3xl tracking-tight"
            style={{
              display: 'none',
              fontFamily: "'Milan Display', 'Outfit', sans-serif",
              color: '#26EFFD',
              textShadow: '0 0 30px rgba(38,239,253,0.5)',
            }}
          >
            MO3TAZ.
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="flex flex-col items-center gap-2">
          <div
            style={{
              width: '210px',
              height: '4px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '10px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                borderRadius: '10px',
                background: 'linear-gradient(90deg, #26EFFD, #00E5FF)',
                boxShadow: '0 0 14px rgba(38,239,253,0.9)',
                transition: 'width 0.2s ease-out',
              }}
            />
          </div>
          <span className="text-[11px] font-mono text-[#26EFFD]/90 tracking-widest font-bold">
            {progress}%
          </span>
        </div>
      </div>

      {/* Bottom Marquee Track */}
      <div className="marquee-container w-full z-10 opacity-75">
        <div className="marquee-track marquee-track-right">
          {[...row2Tags, ...row2Tags, ...row2Tags, ...row2Tags].map((tag, idx) => (
            <div key={`splash-r2-${idx}`} className="flex items-center flex-shrink-0">
              <div
                className="px-6 py-2.5 rounded-xl text-sm md:text-base font-bold select-none flex-shrink-0"
                style={{
                  background: tag.variant === 'solid' ? '#26EFFD' : '#0c3b47',
                  color: tag.variant === 'solid' ? '#082127' : '#26EFFD',
                  border: tag.variant === 'solid' ? 'none' : '1px solid rgba(38,239,253,0.35)',
                  fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                }}
              >
                {tag.text}
              </div>
              <StarDivider />
            </div>
          ))}
        </div>
      </div>

      {/* Inline Keyframes */}
      <style>{`
        @keyframes splashLogoGlow {
          0%, 100% { filter: brightness(0) saturate(100%) invert(75%) sepia(60%) saturate(500%) hue-rotate(145deg) brightness(1.1) drop-shadow(0 0 10px rgba(38,239,253,0.4)); }
          50% { filter: brightness(0) saturate(100%) invert(75%) sepia(60%) saturate(500%) hue-rotate(145deg) brightness(1.35) drop-shadow(0 0 24px rgba(38,239,253,0.8)); }
        }
      `}</style>
    </div>
  );
}
