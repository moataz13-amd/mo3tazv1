import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { projectsAPI } from '../../lib/api';
import type { Project } from '../../types';

const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'Pop Art Designs',
    category: 'graphic',
    featured: true,
    status: 'published',
    description: 'مجموعة من التصاميم الفنية الجريئة المستوحاة من ثقافة البوب آرت والألوان الحيوية.',
    cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80',
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80'
    ],
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
    cover_image: 'https://images.unsplash.com/photo-1614849963640-9cc74b2a826f?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1614849963640-9cc74b2a826f?w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'
    ],
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
    cover_image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'
    ],
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
    cover_image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80'
    ],
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
    cover_image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80'
    ],
    tech_stack: ['Illustrator', 'Dimension'],
    created_at: '',
    updated_at: '',
  }
];

export default function Portfolio() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  const { data: dbProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.getAll({ status: 'published' }).then((r) => r.data as Project[]),
    staleTime: 120_000,
  });

  // Use DB projects if present, else fallback to defaults
  const projectsList = Array.isArray(dbProjects) && dbProjects.length > 0 ? dbProjects : defaultProjects;

  return (
    <section id="portfolio" className="py-10 md:py-16 lg:py-24 px-4 md:px-6 relative z-10" dir="rtl">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto flex flex-col gap-12"
      >
        {/* Section Header */}
        <div className="text-center mb-4 md:mb-6">
          <div
            className="mb-2 text-sm md:text-base font-bold tracking-wider"
            style={{
              color: '#26EFFD',
              fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif",
            }}
          >
            معرض الأعمال
          </div>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight"
            style={{
              fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif",
              fontWeight: 900,
            }}
          >
            المشاريع <span style={{ color: '#26EFFD' }}>المميزة</span>
          </h2>
        </div>

        {/* Categories Stack (Alternating Cards) */}
        <div className="flex flex-col gap-4 md:gap-6 w-full">
          {projectsList.map((project, i) => {
            const isOdd = i % 2 === 0;
            const cardNumber = String(i + 1).padStart(2, '0');

            return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="relative overflow-hidden rounded-[40px] md:rounded-[50px] flex flex-col transition-all duration-300 hover:scale-[1.01] aspect-[4/3] md:aspect-[16/10] lg:aspect-[16/9] border-2 border-white/10 hover:border-[#26EFFD] hover:shadow-[0_10px_30px_rgba(38,239,253,0.2)] group"
                >
                {/* Full Bleed Background Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Large Background Card Number */}
                <div
                  className={`absolute top-0 select-none pointer-events-none leading-none text-[6rem] md:text-[9rem] lg:text-[10rem] z-10`}
                  style={{
                    fontFamily: "'Milan Display', sans-serif",
                    fontWeight: 900,
                    color: 'rgba(255, 255, 255, 0.04)',
                    left: isOdd ? '25px' : 'auto',
                    right: isOdd ? 'auto' : '25px',
                  }}
                >
                  {cardNumber}
                </div>

                {/* Inner layout wrapper */}
                <div className="w-full h-full flex flex-col justify-end relative z-10 p-4 md:p-8 lg:p-14 pb-16 md:pb-16 flex-1">
                  {/* Text information hidden as requested */}
                </div>

                {/* Bottom View Project Button */}
                <div
                  className={`absolute bottom-4 md:bottom-6 lg:bottom-8 ${
                    isOdd ? 'right-4 md:right-6 lg:right-14' : 'left-4 md:left-6 lg:left-14'
                  } z-20`}
                >
                  <motion.button
                    onClick={() => navigate(`/project/${project.id}`, { state: { project } })}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 md:px-8 py-2 md:py-2.5 bg-[#ffffff] text-black border-2 border-black rounded-full font-black text-xs md:text-sm shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:bg-white transition-all cursor-pointer"
                    style={{
                      fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                    }}
                  >
                    عرض المشروع
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
