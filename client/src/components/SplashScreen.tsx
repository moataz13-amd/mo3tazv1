import { useState, useEffect, useCallback } from 'react';
import { useSettingsStore } from '../store';

const StarDivider = ({ color = "#26EFFD" }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={color} className="mx-4 flex-shrink-0">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const defaultRow1Tags = [
  { text: 'تصميم الهوية' },
  { text: 'تصميم الشعارات' },
  { text: 'براندنج' },
  { text: 'تصاميم سوشيال ميديا' },
  { text: 'تصميم الشعارات' },
  { text: 'براندنج' },
  { text: 'تصاميم سوشيال ميديا' },
];

const defaultRow2Tags = [
  { text: 'المطبوعات' },
  { text: 'براندنج' },
  { text: 'واجهات المستخدم' },
  { text: 'تصميم التغليف' },
  { text: 'إنفوجرافيك' },
  { text: 'تصميم العروض التقديمية' },
];

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const settings = useSettingsStore((state) => state.settings);

  const parseTags = (tags: any, fallback: any) => {
    if (Array.isArray(tags) && tags.length > 0) {
      return tags.map((t) => (typeof t === 'string' ? { text: t } : t));
    }
    if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((t: any) => (typeof t === 'string' ? { text: t } : t));
        }
      } catch {}
    }
    return fallback;
  };

  const row1Tags = parseTags(settings?.marquee_row1, defaultRow1Tags);
  const row2Tags = parseTags(settings?.marquee_row2, defaultRow2Tags);

  const finishLoading = useCallback(() => {
    setProgress(100);
    setFadeOut(true);
    setTimeout(() => onComplete(), 600);
  }, [onComplete]);

  useEffect(() => {
    const startTime = Date.now();
    const minDuration = 2200; // Minimum 2.2 seconds display time

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(Math.round((elapsed / minDuration) * 100), 100);
      setProgress(calculatedProgress);

      if (elapsed >= minDuration) {
        clearInterval(interval);
        finishLoading();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [finishLoading]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col justify-center items-center overflow-hidden transition-opacity duration-600 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ background: '#082127' }}
      dir="rtl"
    >
      {/* Background glowing ambience */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          width: '800px',
          height: '800px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(38,239,253,0.18) 0%, rgba(8,33,39,0) 70%)',
        }}
      />

      {/* Stacked Full-Width Marquee Rows Matching Reference Image */}
      <div className="absolute inset-0 flex flex-col justify-center gap-3 py-6 pointer-events-none z-10 opacity-90 scale-105">
        {/* Row 1: Left Scroll - Dark Teal */}
        <div className="marquee-container w-full py-0">
          <div className="marquee-track marquee-track-left">
            {[...row1Tags, ...row1Tags, ...row1Tags, ...row1Tags, ...row1Tags].map((tag, idx) => (
              <div key={`s1-${idx}`} className="flex items-center flex-shrink-0">
                <div
                  className="px-8 py-3.5 rounded-xl text-lg md:text-xl font-black select-none flex-shrink-0 shadow-sm"
                  style={{
                    background: '#0a3740',
                    color: '#26EFFD',
                    border: '1px solid rgba(38,239,253,0.3)',
                    fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                  }}
                >
                  {tag.text}
                </div>
                <StarDivider color="#26EFFD" />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Right Scroll - Solid Cyan (#26EFFD) */}
        <div className="marquee-container w-full py-0">
          <div className="marquee-track marquee-track-right">
            {[...row2Tags, ...row2Tags, ...row2Tags, ...row2Tags, ...row2Tags].map((tag, idx) => (
              <div key={`s2-${idx}`} className="flex items-center flex-shrink-0">
                <div
                  className="px-8 py-3.5 rounded-xl text-lg md:text-xl font-black select-none flex-shrink-0 shadow-md"
                  style={{
                    background: '#26EFFD',
                    color: '#082127',
                    border: 'none',
                    fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                  }}
                >
                  {tag.text}
                </div>
                <StarDivider color="#26EFFD" />
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Left Scroll - Dark Teal */}
        <div className="marquee-container w-full py-0">
          <div className="marquee-track marquee-track-left">
            {[...row1Tags, ...row1Tags, ...row1Tags, ...row1Tags, ...row1Tags].map((tag, idx) => (
              <div key={`s3-${idx}`} className="flex items-center flex-shrink-0">
                <div
                  className="px-8 py-3.5 rounded-xl text-lg md:text-xl font-black select-none flex-shrink-0 shadow-sm"
                  style={{
                    background: '#0a3740',
                    color: '#26EFFD',
                    border: '1px solid rgba(38,239,253,0.3)',
                    fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                  }}
                >
                  {tag.text}
                </div>
                <StarDivider color="#26EFFD" />
              </div>
            ))}
          </div>
        </div>

        {/* Row 4: Right Scroll - Solid Cyan (#26EFFD) */}
        <div className="marquee-container w-full py-0">
          <div className="marquee-track marquee-track-right">
            {[...row2Tags, ...row2Tags, ...row2Tags, ...row2Tags, ...row2Tags].map((tag, idx) => (
              <div key={`s4-${idx}`} className="flex items-center flex-shrink-0">
                <div
                  className="px-8 py-3.5 rounded-xl text-lg md:text-xl font-black select-none flex-shrink-0 shadow-md"
                  style={{
                    background: '#26EFFD',
                    color: '#082127',
                    border: 'none',
                    fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                  }}
                >
                  {tag.text}
                </div>
                <StarDivider color="#26EFFD" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center Floating Glass Card with Logo & Progress Bar */}
      <div className="relative z-30 flex flex-col items-center justify-center gap-6 px-10 py-8 rounded-3xl bg-[#082127]/95 backdrop-blur-2xl border-2 border-[#26EFFD]/40 shadow-[0_0_80px_rgba(38,239,253,0.35)]">
        <div className="relative flex items-center justify-center">
          <img
            src="/Mo3taz..svg"
            alt="MO3TAZ."
            style={{
              height: '56px',
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
            className="font-black text-4xl tracking-tight"
            style={{
              display: 'none',
              fontFamily: "'Milan Display', 'Outfit', sans-serif",
              color: '#26EFFD',
              textShadow: '0 0 30px rgba(38,239,253,0.6)',
            }}
          >
            MO3TAZ.
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="flex flex-col items-center gap-2 w-full">
          <div
            style={{
              width: '240px',
              height: '5px',
              background: 'rgba(255,255,255,0.1)',
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
                boxShadow: '0 0 16px rgba(38,239,253,1)',
                transition: 'width 0.1s linear',
              }}
            />
          </div>
          <span className="text-xs font-mono text-[#26EFFD] tracking-widest font-black">
            {progress}%
          </span>
        </div>
      </div>

      {/* Inline Keyframes */}
      <style>{`
        @keyframes splashLogoGlow {
          0%, 100% { filter: brightness(0) saturate(100%) invert(75%) sepia(60%) saturate(500%) hue-rotate(145deg) brightness(1.1) drop-shadow(0 0 10px rgba(38,239,253,0.4)); }
          50% { filter: brightness(0) saturate(100%) invert(75%) sepia(60%) saturate(500%) hue-rotate(145deg) brightness(1.35) drop-shadow(0 0 26px rgba(38,239,253,0.85)); }
        }
      `}</style>
    </div>
  );
}
