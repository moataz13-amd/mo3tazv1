import { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useSettingsStore } from '../../store';

const About = memo(function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
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

  // Check if we need to render the default stylized heading
  const isDefaultHeading = sectionHeading === "نحول الأفكار إلى تصاميم مؤثرة";

  return (
    <section id="about" className="relative py-2 md:py-4 overflow-hidden" dir="rtl">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(38,239,253,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div ref={ref} className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Centered Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full p-10 md:p-16 overflow-visible flex flex-col items-center"
        >
          {/* Location Pin - Top Right */}
          <div className="absolute top-8 right-8 flex items-center gap-2 text-white/50 text-[14px] font-medium" style={{ fontFamily: "'Sahara Bold', sans-serif" }}>
            <MapPin size={16} className="text-[#26EFFD]" />
            <span>{location}</span>
          </div>

          {/* Profile Photo with Cyan Arch/Circle Backdrop */}
          <div className="relative flex justify-center -mt-[80px] md:-mt-[160px] -mb-[40px] md:-mb-[90px]">
            {/* Profile Avatar Frame */}
            <div className="relative z-20 w-full max-w-[460px] md:max-w-[580px] flex items-center justify-center">
              <img
                src={avatar}
                alt={name}
                className="w-full h-auto object-contain transform scale-110 md:scale-120 transition-transform duration-500"
                loading="lazy" decoding="async"
              />
            </div>
          </div>

          {/* Details Row: Name + Stats */}
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-12 border-b border-white/5 pb-10 mb-10">
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
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
                  {stat1Value}
                </div>
                <div className="text-sm text-white/40 font-medium">{stat1Label}</div>
              </div>

              {/* Divider */}
              <div className="h-14 w-[1px] bg-white/10" />

              {/* Stat 2 */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
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
          transition={{ duration: 0.8, delay: 0.1 }}
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
