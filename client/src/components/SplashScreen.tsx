import { useState, useEffect, useCallback } from 'react';
import { useSettingsStore } from '../store';

const Star4Icon = ({ fill = '#b0b0b0' }: { fill?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={fill} className="mx-6 flex-shrink-0 inline-block align-middle">
    <path d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z" />
  </svg>
);

const FlowerIcon = ({ fill = '#b0b0b0' }: { fill?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={fill} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mx-6 flex-shrink-0 inline-block align-middle">
    <circle cx="12" cy="12" r="2.5" fill={fill} />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

const SunburstIcon = ({ fill = '#b0b0b0' }: { fill?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={fill} className="mx-6 flex-shrink-0 inline-block align-middle">
    <path d="M12 0L14.3 4.8L19.3 2.7L18.1 8L23.4 9.2L19.7 13.1L23.4 17L18.1 18.2L19.3 23.5L14.3 21.4L12 26L9.7 21.4L4.7 23.5L5.9 18.2L0.6 17L4.3 13.1L0.6 9.2L5.9 8L4.7 2.7L9.7 4.8L12 0Z" />
  </svg>
);

const defaultRow1Items = [
  { text: 'النمو', icon: 'star' },
  { text: 'إعلانات ميتا', icon: 'sunburst' },
  { text: 'إعلانات جوجل', icon: 'flower' },
  { text: 'براندنج', icon: 'star' },
  { text: 'تصميم الهوية', icon: 'flower' },
];

const defaultRow2Items = [
  { text: 'تطبيقات الجوال', icon: 'flower' },
  { text: 'تطوير الواجهات', icon: 'star' },
  { text: 'البرمجة', icon: 'sunburst' },
  { text: 'واجهات المستخدم', icon: 'flower' },
  { text: 'تصميم الشعارات', icon: 'star' },
];

const defaultRow3Items = [
  { text: 'تصميم المنتجات', icon: 'sunburst' },
  { text: 'الاستراتيجية', icon: 'star' },
  { text: 'تصاميم سوشيال ميديا', icon: 'flower' },
  { text: 'المطبوعات', icon: 'star' },
  { text: 'تصميم التغليف', icon: 'sunburst' },
];

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const settings = useSettingsStore((state) => state.settings);

  const parseTags = (tags: any, fallback: any) => {
    if (Array.isArray(tags) && tags.length > 0) {
      return tags.map((t, idx) => (typeof t === 'string' ? { text: t, icon: idx % 3 === 0 ? 'star' : idx % 3 === 1 ? 'flower' : 'sunburst' } : t));
    }
    if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((t: any, idx: number) => (typeof t === 'string' ? { text: t, icon: idx % 3 === 0 ? 'star' : idx % 3 === 1 ? 'flower' : 'sunburst' } : t));
        }
      } catch {}
    }
    return fallback;
  };

  const row1 = parseTags(settings?.marquee_row1, defaultRow1Items);
  const row2 = parseTags(settings?.marquee_row2, defaultRow2Items);
  const row3 = defaultRow3Items;

  const renderIcon = (type: string, fill: string) => {
    if (type === 'flower') return <FlowerIcon fill={fill} />;
    if (type === 'sunburst') return <SunburstIcon fill={fill} />;
    return <Star4Icon fill={fill} />;
  };

  const finishLoading = useCallback(() => {
    setProgress(100);
    setFadeOut(true);
    setTimeout(() => onComplete(), 600);
  }, [onComplete]);

  useEffect(() => {
    const startTime = Date.now();
    const minDuration = 2200; // 2.2s visible display time

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
      style={{ background: '#050505' }}
      dir="rtl"
    >
      {/* Background Stacked Full-Width Marquee Banners 100% Matching Reference */}
      <div className="absolute inset-0 flex flex-col justify-center gap-0 pointer-events-none z-10 scale-105">
        
        {/* Row 1: Left Scroll - Black Background / White Text */}
        <div className="marquee-container w-full py-4 bg-[#050505]">
          <div className="marquee-track marquee-track-left">
            {[...row1, ...row1, ...row1, ...row1, ...row1].map((item, idx) => (
              <div key={`splash-r1-${idx}`} className="flex items-center flex-shrink-0">
                <span
                  className="text-2xl md:text-4xl font-black text-white select-none tracking-wide"
                  style={{ fontFamily: "'Sahara Bold', 'Inter', sans-serif" }}
                >
                  {item.text}
                </span>
                {renderIcon(item.icon, '#a0a0a0')}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Right Scroll - FULL WIDTH SOLID CYAN/MINT BANNER / Black Text */}
        <div className="marquee-container w-full py-5 bg-[#26EFFD] shadow-lg">
          <div className="marquee-track marquee-track-right">
            {[...row2, ...row2, ...row2, ...row2, ...row2].map((item, idx) => (
              <div key={`splash-r2-${idx}`} className="flex items-center flex-shrink-0">
                <span
                  className="text-2xl md:text-4xl font-black text-black select-none tracking-wide"
                  style={{ fontFamily: "'Sahara Bold', 'Inter', sans-serif" }}
                >
                  {item.text}
                </span>
                {renderIcon(item.icon, '#000000')}
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Left Scroll - Black Background / White Text */}
        <div className="marquee-container w-full py-4 bg-[#050505]">
          <div className="marquee-track marquee-track-left">
            {[...row3, ...row3, ...row3, ...row3, ...row3].map((item, idx) => (
              <div key={`splash-r3-${idx}`} className="flex items-center flex-shrink-0">
                <span
                  className="text-2xl md:text-4xl font-black text-white select-none tracking-wide"
                  style={{ fontFamily: "'Sahara Bold', 'Inter', sans-serif" }}
                >
                  {item.text}
                </span>
                {renderIcon(item.icon, '#a0a0a0')}
              </div>
            ))}
          </div>
        </div>

        {/* Row 4: Right Scroll - FULL WIDTH SOLID CYAN/MINT BANNER / Black Text */}
        <div className="marquee-container w-full py-5 bg-[#26EFFD] shadow-lg">
          <div className="marquee-track marquee-track-right">
            {[...row1, ...row1, ...row1, ...row1, ...row1].map((item, idx) => (
              <div key={`splash-r4-${idx}`} className="flex items-center flex-shrink-0">
                <span
                  className="text-2xl md:text-4xl font-black text-black select-none tracking-wide"
                  style={{ fontFamily: "'Sahara Bold', 'Inter', sans-serif" }}
                >
                  {item.text}
                </span>
                {renderIcon(item.icon, '#000000')}
              </div>
            ))}
          </div>
        </div>

        {/* Row 5: Left Scroll - Black Background / White Text */}
        <div className="marquee-container w-full py-4 bg-[#050505]">
          <div className="marquee-track marquee-track-left">
            {[...row2, ...row2, ...row2, ...row2, ...row2].map((item, idx) => (
              <div key={`splash-r5-${idx}`} className="flex items-center flex-shrink-0">
                <span
                  className="text-2xl md:text-4xl font-black text-white select-none tracking-wide"
                  style={{ fontFamily: "'Sahara Bold', 'Inter', sans-serif" }}
                >
                  {item.text}
                </span>
                {renderIcon(item.icon, '#a0a0a0')}
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
