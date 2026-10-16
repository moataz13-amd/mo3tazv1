import { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useSettingsStore } from '../../store';
import './About.css';

const Facebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.8 22v-9h3l.5-3.5h-3.5V7.3c0-1 .3-1.7 1.8-1.7h1.9V2.5a24 24 0 0 0-2.8-.2c-2.8 0-4.7 1.7-4.7 4.8v2.4H7V13h3v9h3.8Z" />
  </svg>
);

const Instagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const Youtube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M21.6 5.7c-.2-.9-.9-1.6-1.8-1.8C18.2 3.5 12 3.5 12 3.5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 7.3 2 12 2 12s0 4.7.4 6.3c.2.9.9 1.6 1.8 1.8 1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-6.3.4-6.3s0-4.7-.4-6.3ZM10 16V8l6 4-6 4Z" clipRule="evenodd" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.6 1h-3.4v14.4a3 3 0 1 1-2.6-3V9a6.4 6.4 0 1 0 6 6.4V8.1a8.3 8.3 0 0 0 4.9 1.6V6.3A5 5 0 0 1 16.6 1Z" />
  </svg>
);

const About = memo(function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '100px' });
  const settings = useSettingsStore((state) => state.settings);

  const name = settings?.name || "معتز جمعة";
  const title = settings?.title || "جونيور جرافيك ديزاينر";
  const bio = settings?.about_description || "الإبداع ليس ما نفعله فقط بل ما نتركه في أذهان عملائنا\nمن تصميم الهوية البصرية إلى المحتوى الإبداعي الذي يبرز علامتك التجارية.";
  const location = settings?.location || "البحيرة، مصر";
  const avatar = settings?.avatar || "/me2.png";
  const sectionTitle = settings?.about_section_title || "نبذة عني";
  const sectionHeading = settings?.about_section_heading || "نحول الأفكار إلى تصاميم مؤثرة";
  const ctaText = settings?.about_cta_text || "لنعمل معاً الآن";
  
  const stat1Value = settings?.stat1_value || "+4";
  const stat1Label = settings?.stat1_label || "شركات";
  const stat2Value = settings?.stat2_value || "+75";
  const stat2Label = settings?.stat2_label || "تصميم";

  const bioLines = bio.split('\n');
  const socialPlatforms = [
    { id: 'facebook', name: 'Facebook', Icon: Facebook, url: settings?.facebook_url },
    { id: 'tiktok', name: 'TikTok', Icon: TikTokIcon, url: settings?.tiktok_url },
    { id: 'instagram', name: 'Instagram', Icon: Instagram, url: settings?.instagram_url },
    { id: 'youtube', name: 'YouTube', Icon: Youtube, url: settings?.social_links?.find((link) => link.platform.toLowerCase() === 'youtube' && link.enabled !== false)?.url },
  ];

  // Check if we need to render the default stylized heading
  const isDefaultHeading = !settings?.about_section_heading || settings?.about_section_heading === "نحول الأفكار إلى تصاميم مؤثرة";

  return (
    <section id="about" className="relative py-2 md:py-4 overflow-hidden" dir="rtl">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(38,239,253,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div ref={ref} className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Centered Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div
            className="mb-4 text-base md:text-lg font-bold tracking-wider"
            style={{
              color: '#26EFFD',
              fontFamily: "'Sahara Bold', 'Inter', sans-serif",
            }}
          >
            {sectionTitle}
          </div>
          <h2
            className="text-xl md:text-4xl lg:text-5xl leading-tight"
            style={{
              fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif",
              fontWeight: 900,
              color: '#FFFFFF',
            }}
          >
            {isDefaultHeading ? (
              <>
                نحول الأفكار{' '}
                <span
                  style={{
                    borderBottom: '3px solid #26EFFD',
                    paddingBottom: '4px',
                  }}
                >
                  إلى
                </span>{' '}
                <span style={{ color: '#26EFFD' }}>
                  تصاميم مؤثرة
                </span>
              </>
            ) : (
              sectionHeading
            )}
          </h2>
        </motion.div>

        {/* Main Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full p-6 md:p-12 overflow-visible flex flex-col items-center"
        >
          {/* Location Pin - Top Right */}
          <div className="relative self-end mb-6 md:absolute md:top-8 md:right-8 z-30 flex items-center gap-2 text-white/50 text-[14px] font-medium" style={{ fontFamily: "'Sahara Bold', sans-serif" }}>
            <MapPin size={16} className="text-[#26EFFD]" />
            <span>{location}</span>
          </div>

          {/* Profile Photo with Cyan Arch/Circle Backdrop */}
          <div className="about-portrait-stage relative z-10 flex justify-center mb-8 md:mb-10 w-full">
            {/* Profile Avatar Frame */}
            <div className="about-portrait-frame relative w-full max-w-[360px] md:max-w-[480px] flex items-center justify-center">
              {avatar && (
                <img
                  src={avatar}
                  alt={name}
                  className="w-full max-h-[480px] md:max-h-[600px] object-contain transition-transform duration-500"
                  loading="lazy" decoding="async"
                />
              )}
              {socialPlatforms.map(({ id, name: platformName, Icon, url }) => {
                const configuredUrl = url || settings?.social_links?.find((link) => link.platform.toLowerCase() === id && link.enabled !== false)?.url;
                const safeUrl = configuredUrl && /^https?:\/\//i.test(configuredUrl) ? configuredUrl : undefined;
                const content = <Icon />;
                return safeUrl ? (
                  <a key={id} className={`about-floating-social about-social-${id}`} href={safeUrl} target="_blank" rel="noopener noreferrer" aria-label={platformName} title={platformName}>
                    {content}
                  </a>
                ) : (
                  <span key={id} className={`about-floating-social about-social-${id}`} role="img" aria-label={platformName} title={platformName}>
                    {content}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Details Row: Name + Stats */}
          <div className="relative z-20 w-full flex flex-col md:flex-row items-center justify-between gap-12 border-b border-white/5 pb-10 mb-10">
            {/* Right: Name and Role */}
            <div className="text-center md:text-right">
              <h3
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3"
                style={{ fontFamily: "'Milan Display', 'Sahara Bold', sans-serif" }}
              >
                {name}
              </h3>
              <div
                className="text-lg md:text-xl lg:text-2xl font-bold"
                style={{
                  color: '#26EFFD',
                  fontFamily: "'Sahara Bold', sans-serif",
                }}
              >
                {title}
              </div>
            </div>

            {/* Left: Stats */}
            <div className="flex items-center gap-10" style={{ fontFamily: "'Sahara Bold', sans-serif" }}>
              {/* Stat 1 */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2" style={{ fontFamily: "'Milan Display', 'Sahara Bold', sans-serif" }}>
                  {stat1Value}
                </div>
                <div className="text-sm text-white/40 font-medium">{stat1Label}</div>
              </div>

              {/* Divider */}
              <div className="h-14 w-[1px] bg-white/10" />

              {/* Stat 2 */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2" style={{ fontFamily: "'Milan Display', 'Sahara Bold', sans-serif" }}>
                  {stat2Value}
                </div>
                <div className="text-sm text-white/40 font-medium">{stat2Label}</div>
              </div>
            </div>
          </div>

          {/* Center Description */}
          <p
            className="text-center text-base md:text-lg lg:text-xl leading-[2.2] text-white/70 max-w-2xl mb-12"
            style={{
              fontFamily: "'Sahara Bold', 'Inter', sans-serif",
            }}
          >
            {bioLines[0]}
            {bioLines.length > 1 && (
              <>
                <br />
                {bioLines.slice(1).join(' ')}
              </>
            )}
          </p>

          {/* Full-width Call to Action Button */}
          <motion.button
            onClick={() => {
              const el = document.getElementById('contact');
              if (el) {
                if ((window as any).lenis) {
                  (window as any).lenis.scrollTo(el, { offset: -20, duration: 1.2 });
                } else {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }
            }}
            whileHover={{ scale: 1.02, y: 2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 inline-flex items-center justify-center bg-[#00E5FF] text-black border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] transition-all duration-150 leading-none select-none whitespace-nowrap cursor-pointer text-lg font-black"
            style={{
              borderRadius: '9999px',
              fontFamily: "'Sahara Bold', 'Inter', sans-serif",
            }}
          >
            {ctaText}
          </motion.button>
        </motion.div>

        {/* Stylized "أثر دائم" (Lasting Impact) Section Divider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-center mt-16 md:mt-24 mb-10 pb-2"
        >
          {/* Text "أثر دائم" with shine beam */}
          <div className="relative inline-block">
            <span
              className="text-white font-black leading-none select-none block relative"
              style={{
                fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif",
                fontSize: 'clamp(4.5rem, 12vw, 11rem)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                opacity: 0.6,
              }}
            >
              أثر دائم
            </span>
            <span
              className="absolute inset-0 font-black leading-none overflow-hidden pointer-events-none"
              style={{
                fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif",
                fontSize: 'clamp(4.5rem, 12vw, 11rem)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)',
                backgroundSize: '200% 100%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shine 3s ease-in-out infinite',
              }}
            >
              أثر دائم
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default About;
