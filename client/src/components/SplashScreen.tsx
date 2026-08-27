import { useState, useEffect, useCallback } from 'react';
import { useSettingsStore } from '../store';

const Star4Icon = ({ fill = '#b0b0b0' }: { fill?: string }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill={fill} className="mx-6 sm:mx-10 flex-shrink-0 inline-block align-middle">
    <path d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z" />
  </svg>
);

const FlowerIcon = ({ fill = '#b0b0b0' }: { fill?: string }) => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={fill} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mx-6 sm:mx-10 flex-shrink-0 inline-block align-middle">
    <circle cx="12" cy="12" r="2.5" fill={fill} />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

const SunburstIcon = ({ fill = '#b0b0b0' }: { fill?: string }) => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill={fill} className="mx-6 sm:mx-10 flex-shrink-0 inline-block align-middle">
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
  const [isOpening, setIsOpening] = useState(false);
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
    setIsOpening(true);
    setTimeout(() => {
      onComplete();
    }, 750);
  }, [onComplete]);

  useEffect(() => {
    const timer = setTimeout(() => {
      finishLoading();
    }, 1800);

    return () => clearTimeout(timer);
  }, [finishLoading]);

  return (
    <div
      className="fixed inset-0 w-screen h-screen h-[100dvh] z-[9999] bg-[#050505] flex flex-col justify-center items-center overflow-hidden pointer-events-none"
      dir="rtl"
    >
      {/* Background Stacked Marquee Banners (Large Height, Centered Text, No Gaps) */}
      <div className="w-full h-full flex flex-col justify-stretch items-stretch gap-0 p-0 m-0 overflow-hidden">
        
        {/* Row 1: Slides Left on Finish */}
        <div 
          className={`marquee-container flex-1 w-full flex items-center bg-[#050505] overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
            isOpening ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          <div className="marquee-track marquee-track-left flex items-center">
            {[...row1, ...row1, ...row1, ...row1, ...row1].map((item, idx) => (
              <div key={`splash-r1-${idx}`} className="flex items-center flex-shrink-0">
                <span
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white select-none tracking-wide leading-none flex items-center"
                  style={{ fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif" }}
                >
                  {item.text}
                </span>
                {renderIcon(item.icon, '#a0a0a0')}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: FULL WIDTH CYAN BANNER - Slides Right on Finish */}
        <div 
          className={`marquee-container flex-1 w-full flex items-center bg-[#26EFFD] overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
            isOpening ? 'translate-x-full' : 'translate-x-0'
          }`}
        >
          <div className="marquee-track marquee-track-right flex items-center">
            {[...row2, ...row2, ...row2, ...row2, ...row2].map((item, idx) => (
              <div key={`splash-r2-${idx}`} className="flex items-center flex-shrink-0">
                <span
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black select-none tracking-wide leading-none flex items-center"
                  style={{ fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif" }}
                >
                  {item.text}
                </span>
                {renderIcon(item.icon, '#000000')}
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Slides Left on Finish */}
        <div 
          className={`marquee-container flex-1 w-full flex items-center bg-[#050505] overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
            isOpening ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          <div className="marquee-track marquee-track-left flex items-center">
            {[...row3, ...row3, ...row3, ...row3, ...row3].map((item, idx) => (
              <div key={`splash-r3-${idx}`} className="flex items-center flex-shrink-0">
                <span
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white select-none tracking-wide leading-none flex items-center"
                  style={{ fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif" }}
                >
                  {item.text}
                </span>
                {renderIcon(item.icon, '#a0a0a0')}
              </div>
            ))}
          </div>
        </div>

        {/* Row 4: FULL WIDTH CYAN BANNER - Slides Right on Finish */}
        <div 
          className={`marquee-container flex-1 w-full flex items-center bg-[#26EFFD] overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
            isOpening ? 'translate-x-full' : 'translate-x-0'
          }`}
        >
          <div className="marquee-track marquee-track-right flex items-center">
            {[...row1, ...row1, ...row1, ...row1, ...row1].map((item, idx) => (
              <div key={`splash-r4-${idx}`} className="flex items-center flex-shrink-0">
                <span
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black select-none tracking-wide leading-none flex items-center"
                  style={{ fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif" }}
                >
                  {item.text}
                </span>
                {renderIcon(item.icon, '#000000')}
              </div>
            ))}
          </div>
        </div>

        {/* Row 5: Slides Left on Finish */}
        <div 
          className={`marquee-container flex-1 w-full flex items-center bg-[#050505] overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
            isOpening ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          <div className="marquee-track marquee-track-left flex items-center">
            {[...row2, ...row2, ...row2, ...row2, ...row2].map((item, idx) => (
              <div key={`splash-r5-${idx}`} className="flex items-center flex-shrink-0">
                <span
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white select-none tracking-wide leading-none flex items-center"
                  style={{ fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif" }}
                >
                  {item.text}
                </span>
                {renderIcon(item.icon, '#a0a0a0')}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
