import { memo, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ClipboardList, Calendar, Users } from 'lucide-react';

interface StatItem {
  id: number;
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  progressTarget: number; // Percentage of the circle stroke (e.g. 0.75 for 75%)
}

const statsData: StatItem[] = [
  {
    id: 1,
    value: '+75',
    label: 'مشروع تم تنفيذه',
    icon: ClipboardList,
    progressTarget: 0.75,
  },
  {
    id: 2,
    value: '+2',
    label: 'سنوات خبرة',
    icon: Calendar,
    progressTarget: 0.45,
  },
  {
    id: 3,
    value: '+25',
    label: 'عملاء راضِ',
    icon: Users,
    progressTarget: 0.80,
  },
];

const Stats = memo(function Stats() {
  const containerRef = useRef<HTMLElement>(null);

  // useScroll to track scroll progress over the entire section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Create a smooth spring-based scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 15,
    mass: 0.2,
    stiffness: 80,
  });

  // Transform scroll progress to continuous rotation for the circle outlines (e.g. rotate up to 360 degrees)
  const circleRotation = useTransform(smoothProgress, [0, 1], [0, 360]);

  return (
    <section
      id="stats"
      ref={containerRef}
      className="py-16 md:py-24 px-6 relative z-10 overflow-hidden"
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight"
            style={{
              fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif",
              fontWeight: 900,
            }}
          >
            أثر <span style={{ color: '#26EFFD' }}>يُرى ويُقاس</span>
          </h2>
        </motion.div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {statsData.map((item, index) => {
            const IconComponent = item.icon;

            // Specific stroke dashoffset for each card based on scroll progress
            // Total stroke length is 2 * Math.PI * 40 = 251.2
            const strokeDasharray = 251.2;
            
            // Calculate progress value: starts at fully offset (empty) and draws up to its progressTarget as scroll enters
            const strokeDashoffset = useTransform(
              smoothProgress,
              [0.1, 0.6], // Animates between 10% and 60% of scroll progress into the viewport
              [strokeDasharray, strokeDasharray - strokeDasharray * item.progressTarget]
            );

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                // Outer container with hidden overflow and padding for border stroke
                className="relative p-[1.5px] overflow-hidden rounded-[36px] bg-transparent flex items-center justify-center w-full h-[380px] group"
              >
                {/* Rotating Conic Gradient Border background (Continuous spinning in all directions) */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-[250%] rounded-full bg-[conic-gradient(from_0deg,#26EFFD,#4F46E5,#26EFFD,#4F46E5,#26EFFD,#4F46E5,#26EFFD,#4F46E5,#26EFFD)] animate-[spin_3s_linear_infinite]"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Inner Card content container */}
                <div className="relative z-10 w-full h-full bg-[#0A0F24]/90 backdrop-blur-xl rounded-[34px] flex flex-col items-center justify-center p-8 gap-6 text-center">
                  
                  {/* Icon Circle Container with Scroll Animation */}
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    
                    {/* SVG Progress Circle linked to scroll */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Faint track border */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="rgba(38, 239, 253, 0.08)"
                        strokeWidth="6"
                        fill="transparent"
                      />
                      
                      {/* Active stroke colored border */}
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#26EFFD"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={strokeDasharray}
                        style={{
                          strokeDashoffset: strokeDashoffset,
                          // Spin the stroke slightly for extra dynamism
                          rotate: circleRotation,
                        }}
                      />
                    </svg>

                    {/* Icon container */}
                    <div className="relative z-10 w-16 h-16 rounded-full bg-[#060a17] flex items-center justify-center shadow-inner border border-white/5">
                      <IconComponent className="w-7 h-7 text-[#26EFFD]" />
                    </div>
                  </div>

                  {/* Value/Number */}
                  <h3
                    className="text-5xl md:text-6xl font-black text-white tracking-tight"
                    style={{
                      fontFamily: "'Milan Display', 'Outfit', 'Inter', sans-serif",
                    }}
                  >
                    {item.value}
                  </h3>

                  {/* Description Label */}
                  <p
                    className="text-lg md:text-xl font-bold text-gray-300"
                    style={{
                      fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                    }}
                  >
                    {item.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default Stats;
