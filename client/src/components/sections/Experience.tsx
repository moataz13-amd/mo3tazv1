import { memo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { experienceAPI } from '../../lib/api';
import type { ExperienceEntry } from '../../types';

const defaultTimelineData = [
  {
    type: 'experience',
    title: 'Senior Full Stack Developer',
    organization: 'TechCorp Global',
    period: '2022 — Present',
    description: 'Leading development of enterprise SaaS platforms with React, Node.js, and cloud infrastructure. Managing a team of 5 developers.',
    tags: ['React', 'Node.js', 'AWS', 'PostgreSQL'],
    icon: '💼',
    color: '#00BFFF',
  },
  {
    type: 'experience',
    title: 'UI/UX Developer',
    organization: 'Creative Studio X',
    period: '2020 — 2022',
    description: 'Designed and developed premium web experiences for Fortune 500 clients. Specialized in 3D web, motion design, and interactive prototypes.',
    tags: ['Figma', 'Three.js', 'GSAP', 'Vue.js'],
    icon: '🎨',
    color: '#4F46E5',
  },
  {
    type: 'certification',
    title: 'AWS Solutions Architect',
    organization: 'Amazon Web Services',
    period: '2023',
    description: 'Professional certification covering cloud architecture, scalability, and best practices for AWS infrastructure design.',
    tags: ['Cloud', 'AWS', 'Architecture'],
    icon: '🏆',
    color: '#f59e0b',
  },
  {
    type: 'education',
    title: 'BSc Computer Science',
    organization: 'Cairo University',
    period: '2016 — 2020',
    description: 'Graduated with honors. Focused on software engineering, algorithms, and data structures. Final project: AI-powered code review system.',
    tags: ['Computer Science', 'Algorithms', 'AI'],
    icon: '🎓',
    color: '#10b981',
  },
  {
    type: 'certification',
    title: 'Meta Frontend Developer',
    organization: 'Meta / Coursera',
    period: '2021',
    description: 'Advanced React patterns, performance optimization, testing strategies, and accessibility best practices.',
    tags: ['React', 'Testing', 'Accessibility'],
    icon: '📜',
    color: '#06B6D4',
  },
  {
    type: 'experience',
    title: 'Junior Developer',
    organization: 'StartUp Hub',
    period: '2019 — 2020',
    description: 'Built responsive web applications and contributed to open-source projects. Mastered modern JavaScript fundamentals.',
    tags: ['JavaScript', 'HTML/CSS', 'jQuery'],
    icon: '💡',
    color: '#8b5cf6',
  },
];

type FilterType = 'all' | 'experience' | 'education' | 'certification';

const filters: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'certification', label: 'Certifications' },
];

const Spark8Icon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30 mx-4 flex-shrink-0 animate-pulse">
    <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
  </svg>
);

function TimelineItem({ item, index }: { item: typeof defaultTimelineData[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.1, duration: 0.6 }}
      className={`flex items-center gap-4 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Card */}
      <div className="flex-1">
        <div
          className="glass-card p-5 hover:border-opacity-60 transition-all group"
          style={{ borderColor: `${item.color}30` }}
        >
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">{item.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="font-bold text-white group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded-full"
                  style={{
                    background: `${item.color}20`,
                    border: `1px solid ${item.color}40`,
                    color: item.color,
                  }}
                >
                  {item.period}
                </span>
              </div>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(0,191,255,0.7)' }}>
                {item.organization}
              </p>
            </div>
          </div>
          <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
            {item.description}
          </p>
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-md font-mono"
                  style={{
                    background: `${item.color}10`,
                    border: `1px solid ${item.color}25`,
                    color: `${item.color}cc`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center dot (desktop) */}
      <div className="hidden md:flex flex-col items-center flex-shrink-0">
        <div
          className="w-4 h-4 rounded-full border-2"
          style={{
            background: item.color,
            borderColor: '#050816',
            boxShadow: `0 0 15px ${item.color}80, 0 0 30px ${item.color}40`,
          }}
        />
      </div>

      {/* Spacer */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  );
}

const Experience = memo(function Experience() {
  const [filter, setFilter] = useState<FilterType>('all');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const { data: dbEntries = [] } = useQuery({
    queryKey: ['experience'],
    queryFn: () => experienceAPI.getAll().then((r) => r.data as ExperienceEntry[]),
    staleTime: 120_000,
  });

  const timelineData = dbEntries.length > 0
    ? dbEntries.sort((a, b) => a.order - b.order)
    : defaultTimelineData;

  const filtered = filter === 'all'
    ? timelineData
    : timelineData.filter((item) => item.type === filter);

  return (
    <section id="experience" className="py-4 px-6">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-mono"
            style={{ background: 'rgba(0,191,255,0.08)', border: '1px solid rgba(0,191,255,0.2)', color: '#00BFFF' }}
          >
            ◫ TIMELINE
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit' }}>
            My <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Education, experience, and certifications
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {filters.map((f) => (
            <motion.button
              key={f.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f.id)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: filter === f.id ? 'rgba(0,191,255,0.2)' : 'rgba(255,255,255,0.05)',
                border: filter === f.id ? '1px solid rgba(0,191,255,0.5)' : '1px solid rgba(255,255,255,0.08)',
                color: filter === f.id ? '#00BFFF' : 'rgba(255,255,255,0.5)',
              }}
            >
              {f.label}
            </motion.button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line (desktop) */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: 'linear-gradient(180deg, #00BFFF, #4F46E5, transparent)', opacity: 0.3 }}
          />

          <div className="flex flex-col gap-6">
            {filtered.map((item, i) => (
              <TimelineItem key={`${item.title}-${i}`} item={item} index={i} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
});

export default Experience;
