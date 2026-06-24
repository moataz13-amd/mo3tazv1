import { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { languagesAPI } from '../../lib/api';
import type { Language } from '../../types';

const defaultLanguages = [
  {
    name: 'Arabic',
    level: 'Native',
    proficiency: 100,
    flag: '🇸🇦',
    color: '#00BFFF',
    description: 'Mother tongue — full professional & personal fluency',
  },
  {
    name: 'English',
    level: 'Professional',
    proficiency: 90,
    flag: '🇬🇧',
    color: '#4F46E5',
    description: 'Advanced written and spoken communication for global business',
  },
];

const Languages = memo(function Languages() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const { data: dbLanguages = [] } = useQuery({
    queryKey: ['languages'],
    queryFn: () => languagesAPI.getAll().then((r) => r.data as Language[]),
    staleTime: 120_000,
  });

  const languages = dbLanguages.length > 0
    ? dbLanguages.sort((a, b) => a.order - b.order)
    : defaultLanguages;

  return (
    <section id="languages" className="py-4 px-6">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto"
      >
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'rgba(0,191,255,0.15)', border: '1px solid rgba(0,191,255,0.3)' }}
            >
              🌐
            </div>
            <div>
              <h3 className="font-bold text-white" style={{ fontFamily: 'Outfit' }}>
                Language <span className="gradient-text">Proficiency</span>
              </h3>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Communication capabilities
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {languages.map((lang, i) => (
              <motion.div
                key={lang.name}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="p-5 rounded-2xl group hover:border-opacity-60 transition-all"
                style={{
                  background: `${lang.color}08`,
                  border: `1px solid ${lang.color}25`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{lang.flag}</span>
                    <div>
                      <div className="font-bold text-white">{lang.name}</div>
                      <div className="text-xs" style={{ color: lang.color }}>
                        {lang.level}
                      </div>
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold font-mono"
                    style={{ color: lang.color }}
                  >
                    {lang.proficiency}%
                  </div>
                </div>

                <div className="progress-bar-track mb-3">
                  <motion.div
                    className="h-full rounded-full relative"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${lang.proficiency}%` } : { width: 0 }}
                    transition={{ delay: i * 0.2 + 0.4, duration: 1.5, ease: 'easeOut' }}
                    style={{
                      background: `linear-gradient(90deg, ${lang.color}, ${lang.color}80)`,
                      boxShadow: `0 0 10px ${lang.color}60`,
                    }}
                  />
                </div>

                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {lang.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
});

export default Languages;
