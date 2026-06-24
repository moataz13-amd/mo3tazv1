import { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface StepItem {
  id: string;
  number: string;
  title: string;
  description: string;
}

const processSteps: StepItem[] = [
  {
    id: 'step1',
    number: '01',
    title: 'اكتشاف الاحتياجات',
    description:
      'أبدأ بفهم أهداف المشروع والجمهور المستهدف وتحليل متطلبات العلامة التجارية لضمان بناء رؤية تصميمية واضحة ومناسبة.',
  },
  {
    id: 'step2',
    number: '02',
    title: 'التخطيط والإبداع',
    description:
      'تحويل الأفكار والرؤية إلى مفاهيم تصميمية مدروسة مع وضع الاتجاه البصري المناسب الذي يعكس هوية المشروع بشكل احترافي.',
  },
  {
    id: 'step3',
    number: '03',
    title: 'التصميم والتطوير',
    description:
      'تنفيذ التصاميم بأعلى معايير الجودة مع التركيز على التفاصيل البصرية وتجربة المستخدم لتحقيق أفضل النتائج الممكنة.',
  },
  {
    id: 'step4',
    number: '04',
    title: 'التسليم والمتابعة',
    description:
      'تسليم الملفات النهائية بجميع الصيغ المطلوبة مع تقديم الدعم اللازم لضمان تطبيق الهوية أو التصاميم بشكل صحيح وفعال.',
  },
];

const Skills = memo(function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <section id="skills" className="py-12 md:py-20 px-6 relative overflow-hidden" dir="rtl">
      {/* Ambient glow backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(38,239,253,0.03)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto relative"
      >
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className="mb-3 text-base md:text-lg font-bold tracking-wider"
            style={{
              color: '#26EFFD',
              fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif",
            }}
          >
            خطوات التنفيذ
          </div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight"
            style={{
              fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif",
              fontWeight: 900,
            }}
          >
            منهجية <span style={{ color: '#26EFFD' }}>العمل</span>
          </h2>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div
            className="absolute right-[122px] md:right-[198px] top-[48px] md:top-[67px] bottom-[48px] md:bottom-[67px] w-[1.5px] pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, #26EFFD, #0c5a6b)',
            }}
          />

          {/* Steps List */}
          <div className="flex flex-col">
          {processSteps.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="flex items-start gap-4 md:gap-8 relative py-8 md:py-12 border-b border-[#0c5a6b]/20 last:border-0 group"
            >
              {/* Right Column (Large Gradient Number) */}
              <div
                className="w-[90px] md:w-[150px] text-5xl md:text-7xl font-black select-none text-right leading-none mt-0"
                style={{
                  fontFamily: "'Milan Display', 'Outfit', sans-serif",
                  fontWeight: 900,
                  background: 'linear-gradient(180deg, #26EFFD 0%, #06404d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {item.number}
              </div>

              {/* Middle Column (Dot Container) */}
              <div className="w-8 flex flex-col items-center justify-start self-stretch relative">
                {/* Glowing Bullet Dot - Centered vertically with the first line of the title text */}
                <div className="w-3.5 h-3.5 rounded-full bg-[#26EFFD] shadow-[0_0_12px_#26EFFD] border-2 border-[#050816] z-10 mt-[9px] md:mt-[12px]" />
              </div>

              {/* Left Column (Content): Title + Description */}
              <div className="flex-1 text-right mt-0">
                <h3
                  className="text-2xl md:text-3xl font-black mb-4 text-white transition-colors duration-300 group-hover:text-[#26EFFD] leading-tight"
                  style={{
                    fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif",
                    fontWeight: 900,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm md:text-base leading-[2] text-white/50 max-w-2xl"
                  style={{
                    fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                  }}
                >
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  </section>
  );
});

export default Skills;
