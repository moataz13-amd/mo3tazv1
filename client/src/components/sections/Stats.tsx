import { memo, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ClipboardCheck, Calendar, Users } from 'lucide-react';
import { useSettingsStore } from '../../store';

interface StatItem {
  id: number;
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  progressTarget: number;
}

const StatCard = memo(function StatCard({
  item,
  index,
  smoothProgress,
  circleRotation,
}: {
  item: StatItem;
  index: number;
  smoothProgress: any;
  circleRotation: any;
}) {
  const IconComponent = item.icon;
  const strokeDasharray = 263.8;

  const strokeDashoffset = useTransform(
    smoothProgress,
    [0.1, 0.6],
    [strokeDasharray, strokeDasharray - strokeDasharray * item.progressTarget]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="w-full flex items-center justify-center group"
    >
      <div
        className="relative w-full h-[370px] sm:h-[390px] md:h-[410px] flex flex-col items-center justify-center p-8 text-center transition-all duration-300 hover:scale-[1.02]"
        style={{
          background: 'linear-gradient(180deg, #082127 0%, #082127 100%)',
          border: '3px solid #26EFFD',
          borderRadius: '42px',
        }}
      >
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-6">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="rgba(38, 239, 253, 0.25)"
              strokeWidth="4"
              fill="transparent"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              stroke="#26EFFD"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              style={{
                strokeDashoffset: strokeDashoffset,
                rotate: circleRotation,
              }}
            />
          </svg>

          <div className="relative z-10 w-full h-full flex items-center justify-center text-[#26EFFD]">
            <IconComponent className="w-10 h-10 sm:w-11 sm:h-11 text-[#26EFFD]" />
          </div>
        </div>

        <div className="border-b-[2.5px] border-[#26EFFD] pb-1 px-4 mb-5 inline-block">
          <h3
            dir="ltr"
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight"
            style={{
              fontFamily: "'Milan Display', 'Sahara Bold', sans-serif",
              letterSpacing: '-0.02em',
            }}
          >
            {item.value}
          </h3>
        </div>

        <p
          className="text-base sm:text-lg font-black text-white leading-relaxed"
          style={{
            fontFamily: "'Sahara Bold', 'Milan Display', 'Inter', sans-serif",
          }}
        >
          {item.label}
        </p>
      </div>
    </motion.div>
  );
});

const Stats = memo(function Stats() {
  const containerRef = useRef<HTMLElement>(null);
  const settings = useSettingsStore((state) => state.settings);

  const stat1Val = settings?.stat1_value || '75';
  const stat1Lbl = settings?.stat1_label || 'تصميم محترفي';

  const stat2Val = settings?.stat2_value || '2';
  const stat2Lbl = settings?.stat2_label || 'سنوات خبرة';
  
  const stat3Val = settings?.stat3_value || '40';
  const stat3Lbl = settings?.stat3_label || 'عميل';

  const statsData: StatItem[] = [
    {
      id: 1,
      value: stat1Val.startsWith('+') ? stat1Val : `+${stat1Val}`,
      label: stat1Lbl,
      icon: ClipboardCheck,
      progressTarget: 0.85,
    },
    {
      id: 2,
      value: stat2Val.startsWith('+') ? stat2Val : `+${stat2Val}`,
      label: stat2Lbl,
      icon: Calendar,
      progressTarget: 0.65,
    },
    {
      id: 3,
      value: stat3Val.startsWith('+') ? stat3Val : `+${stat3Val}`,
      label: stat3Lbl,
      icon: Users,
      progressTarget: 0.90,
    },
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 18,
    mass: 0.2,
    stiffness: 90,
  });

  const circleRotation = useTransform(smoothProgress, [0, 1], [0, 360]);

  return (
    <section
      id="stats"
      ref={containerRef}
      className="py-16 md:py-24 px-6 relative z-10 overflow-hidden"
      dir="rtl"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(38,239,253,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col gap-12 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight"
            style={{
              fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif",
              fontWeight: 900,
            }}
          >
            أثر يُرى ويُقاس
          </h2>
        </motion.div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {statsData.map((item, index) => (
            <StatCard
              key={item.id}
              item={item}
              index={index}
              smoothProgress={smoothProgress}
              circleRotation={circleRotation}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

export default Stats;
