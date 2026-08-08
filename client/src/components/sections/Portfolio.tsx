import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import { projectsAPI } from '../../lib/api';
import type { Project } from '../../types';

// Mockup showcase fallback items
const defaultMockups: Project[] = [
  {
    id: 'm1',
    title: 'Brand Packaging Mockup',
    category: 'branding',
    featured: true,
    status: 'published',
    description: 'موك آب احترافي للهويات البصرية والتغليف الفاخر لاستعراض المنتجات.',
    cover_image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&q=80',
    tech_stack: ['Photoshop', '3D Mockup'],
    created_at: '',
    updated_at: '',
  },
  {
    id: 'm2',
    title: 'Stationery & Branding Showcase',
    category: 'branding',
    featured: true,
    status: 'published',
    description: 'عرض موك آب متكامل للمطبوعات، الكروت الشخصية والمستندات الرسمية.',
    cover_image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1200&q=80',
    tech_stack: ['Illustrator', 'Photoshop'],
    created_at: '',
    updated_at: '',
  },
  {
    id: 'm3',
    title: 'Digital Screen Mockup',
    category: 'ui-ux',
    featured: true,
    status: 'published',
    description: 'استعراض تصاميم الواجهات والتطبيقات على أحدث الشاشات والأجهزة الرقمية.',
    cover_image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&q=80',
    tech_stack: ['Figma', 'Dimension'],
    created_at: '',
    updated_at: '',
  },
  {
    id: 'm4',
    title: '3D Product Design Mockup',
    category: 'graphic',
    featured: true,
    status: 'published',
    description: 'موك آب ثلاثي الأبعاد يعكس التفاصيل بدقة متناهية وزوايا واقعية.',
    cover_image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=80',
    tech_stack: ['Cinema 4D', 'Photoshop'],
    created_at: '',
    updated_at: '',
  }
];

// Featured projects fallback items
const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'Pop Art Designs',
    category: 'graphic',
    featured: true,
    status: 'published',
    description: 'مجموعة من التصاميم الفنية الجريئة المستوحاة من ثقافة البوب آرت والألوان الحيوية.',
    cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
    tech_stack: ['Photoshop', 'Illustrator'],
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    title: 'Social Media Designs',
    category: 'graphic',
    featured: true,
    status: 'published',
    description: 'تصاميم إبداعية لمنصات التواصل الاجتماعي تركز على الهوية البصرية وزيادة التفاعل.',
    cover_image: 'https://images.unsplash.com/photo-1614849963640-9cc74b2a826f?w=1200&q=80',
    tech_stack: ['Photoshop', 'Figma'],
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    title: 'Collage Art Designs',
    category: 'graphic',
    featured: true,
    status: 'published',
    description: 'دمج الصور والمواد المختلفة لإنشاء لوحات فنية معبرة وفريدة من نوعها.',
    cover_image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=80',
    tech_stack: ['Mixed Media', 'Photoshop'],
    created_at: '',
    updated_at: '',
  },
  {
    id: '4',
    title: 'Sports Designs',
    category: 'graphic',
    featured: true,
    status: 'published',
    description: 'تصاميم رياضية ديناميكية ومليئة بالحماس للاعبين والأندية والفعاليات الرياضية.',
    cover_image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80',
    tech_stack: ['Photoshop', 'Lightroom'],
    created_at: '',
    updated_at: '',
  },
  {
    id: '5',
    title: 'Visuals Designs',
    category: 'graphic',
    featured: true,
    status: 'published',
    description: 'عناصر مرئية وتصاميم فنية مبتكرة تناسب مختلف مجالات النشر الرقمي.',
    cover_image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&q=80',
    tech_stack: ['Illustrator', 'Dimension'],
    created_at: '',
    updated_at: '',
  }
];

const AUTOPLAY_DURATION = 5000; // 5 seconds timer

interface Carousel3DSectionProps {
  id: string;
  subtitle: string;
  titlePrefix: string;
  titleHighlight: string;
  items: Project[];
}

const Carousel3DSection = memo(function Carousel3DSection({
  id,
  subtitle,
  titlePrefix,
  titleHighlight,
  items,
}: Carousel3DSectionProps) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = items.length;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Smooth Auto-play Timer (No progress bar UI)
  useEffect(() => {
    if (isPaused || total <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, AUTOPLAY_DURATION);

    return () => clearInterval(timer);
  }, [isPaused, total, handleNext]);

  // Calculate 3D Offset for center card vs side cards
  const getCardOffset = (index: number) => {
    let diff = index - currentIndex;
    if (diff > Math.floor(total / 2)) diff -= total;
    if (diff < -Math.floor(total / 2)) diff += total;
    return diff;
  };

  return (
    <section id={id} className="py-10 md:py-16 px-4 md:px-6 relative z-10 overflow-hidden" dir="rtl">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-10"
      >
        {/* Header */}
        <div className="text-center">
          {subtitle && (
            <div
              className="mb-2 text-xs md:text-sm font-bold tracking-wider uppercase"
              style={{
                color: '#26EFFD',
                fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif",
              }}
            >
              {subtitle}
            </div>
          )}
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight flex items-center justify-center gap-3"
            style={{
              fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif",
            }}
          >
            {titlePrefix} <span style={{ color: '#26EFFD' }}>{titleHighlight}</span>
          </h2>
        </div>

        {/* 3D Stage (960x540 card aspect ratio with ultra-smooth spring physics) */}
        <div
          className="relative w-full flex items-center justify-center min-h-[320px] md:min-h-[520px] lg:min-h-[580px] py-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative w-full max-w-[960px] h-[270px] sm:h-[360px] md:h-[480px] lg:h-[540px] flex items-center justify-center">
            {items.map((project, index) => {
              const offset = getCardOffset(index);
              const isActive = offset === 0;
              const isVisible = Math.abs(offset) <= 1;

              if (!isVisible) return null;

              let xPosition = '0%';
              let scale = 1;
              let zIndex = 20;
              let opacity = 1;

              if (offset === -1) {
                xPosition = '-55%';
                scale = 0.78;
                zIndex = 10;
                opacity = 0.45;
              } else if (offset === 1) {
                xPosition = '55%';
                scale = 0.78;
                zIndex = 10;
                opacity = 0.45;
              }

              return (
                <motion.div
                  key={project.id}
                  onClick={() => {
                    if (offset === -1) handlePrev();
                    else if (offset === 1) handleNext();
                  }}
                  initial={false}
                  animate={{
                    x: xPosition,
                    scale: scale,
                    opacity: opacity,
                    zIndex: zIndex,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 180,
                    damping: 24,
                    mass: 0.8,
                  }}
                  className={`absolute top-0 w-full max-w-[960px] h-full rounded-[32px] md:rounded-[42px] overflow-hidden cursor-pointer select-none transition-all duration-300 ${
                    isActive
                      ? 'border-2 border-[#26EFFD] shadow-[0_0_50px_rgba(38,239,253,0.35),0_10px_30px_rgba(0,0,0,0.8)]'
                      : 'border border-white/10 hover:border-[#26EFFD]/50 shadow-2xl brightness-75'
                  }`}
                >
                  {/* Image */}
                  <div className="relative w-full h-full bg-[#050B14]">
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay & Details */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-10 lg:p-12">
                      <div className="flex flex-col gap-2 max-w-2xl">
                        {project.category && (
                          <span
                            className="text-xs md:text-sm font-bold tracking-wider uppercase inline-block"
                            style={{ color: '#26EFFD' }}
                          >
                            {project.category}
                          </span>
                        )}
                        <h3
                          className="text-2xl md:text-4xl font-extrabold text-white leading-tight"
                          style={{ fontFamily: "'Sahara Bold', 'Milan Display', sans-serif" }}
                        >
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-gray-300 text-xs md:text-sm line-clamp-2 mt-1">
                            {project.description}
                          </p>
                        )}
                      </div>

                      {/* View Button on Active Card */}
                      {isActive && (
                        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-30">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/project/${project.id}`, { state: { project } });
                            }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 md:px-8 py-2 md:py-2.5 bg-[#ffffff] text-black border-2 border-black rounded-full font-black text-xs md:text-sm shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:bg-[#26EFFD] transition-all cursor-pointer flex items-center gap-2"
                            style={{ fontFamily: "'Sahara Bold', 'Inter', sans-serif" }}
                          >
                            <span>عرض التفاصيل</span>
                            <ExternalLink size={14} />
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Nav Bar with Dashed Cyan Line (NO Duration progress bar) */}
        <div className="w-full max-w-[960px] mx-auto flex items-center justify-between gap-4 mt-2">
          {/* Previous Button (Right in RTL) */}
          <motion.button
            onClick={handlePrev}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 md:px-12 py-2.5 md:py-3 rounded-full bg-[#050B14]/80 backdrop-blur-md border-2 border-[#26EFFD] text-[#26EFFD] font-bold text-sm md:text-base shadow-[0_0_20px_rgba(38,239,253,0.2)] hover:shadow-[0_0_30px_rgba(38,239,253,0.4)] hover:bg-[#26EFFD]/10 transition-all flex items-center gap-2 cursor-pointer select-none"
            style={{ fontFamily: "'Sahara Bold', 'Inter', sans-serif" }}
          >
            <span>السابق</span>
          </motion.button>

          {/* Cyan Dashed Line */}
          <div className="flex-1 h-[2px] relative flex items-center">
            <div className="w-full border-t-2 border-dashed border-[#26EFFD]/50" />
          </div>

          {/* Next Button (Left in RTL) */}
          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 md:px-12 py-2.5 md:py-3 rounded-full bg-[#050B14]/80 backdrop-blur-md border-2 border-[#26EFFD] text-[#26EFFD] font-bold text-sm md:text-base shadow-[0_0_20px_rgba(38,239,253,0.2)] hover:shadow-[0_0_30px_rgba(38,239,253,0.4)] hover:bg-[#26EFFD]/10 transition-all flex items-center gap-2 cursor-pointer select-none"
            style={{ fontFamily: "'Sahara Bold', 'Inter', sans-serif" }}
          >
            <span>التالي</span>
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
});

const Portfolio = memo(function Portfolio() {
  const { data: dbProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.getAll({ status: 'published' }).then((r) => r.data as Project[]),
    staleTime: 120_000,
  });

  // Filter branding / mockup projects vs featured projects
  const mockupProjects = Array.isArray(dbProjects)
    ? dbProjects.filter((p) => p.category === 'mockup' || p.category === 'branding' || p.title.toLowerCase().includes('mockup'))
    : [];

  const featuredProjects = Array.isArray(dbProjects)
    ? dbProjects.filter((p) => p.featured)
    : [];

  const mockupsList = mockupProjects.length > 0 ? mockupProjects : defaultMockups;
  const projectsList = featuredProjects.length > 0
    ? featuredProjects
    : (Array.isArray(dbProjects) && dbProjects.length > 0 ? dbProjects : defaultProjects);

  return (
    <div className="flex flex-col gap-8 md:gap-16">
      {/* 1. Mockup Showcase Section (Upper Section) */}
      <Carousel3DSection
        id="mockups"
        subtitle="معرض الموك آب"
        titlePrefix="تصاميم"
        titleHighlight="الموك آب"
        items={mockupsList}
      />

      {/* 2. Featured Projects Section (Main Portfolio Section) */}
      <Carousel3DSection
        id="portfolio"
        subtitle="معرض الأعمال"
        titlePrefix="المشاريع"
        titleHighlight="المميزة"
        items={projectsList}
      />
    </div>
  );
});

export default Portfolio;
