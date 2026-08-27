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
  const isInView = useInView(ref, { once: true, margin: '100px' });

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
        transition={{ duration: 0.35 }}
        className="max-w-5xl mx-auto"
      >
        <div className="p-8" style={{
          background: '#00E5FF',
          border: '2px solid #000000',
          borderRadius: '24px',
          color: '#000000',
          boxShadow: '6px 6px 0px #000000',
        }}>
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: '#000000' }}
            >
              🌐
            </div>
            <div>
              <h3 className="font-black text-black">
                Language <span className="text-black">Proficiency</span>
              </h3>
              <p className="text-xs font-bold text-black/70">
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
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="p-5 transition-all duration-150 group"
                style={{
                  background: '#000000',
                  border: '2px solid #00E5FF',
                  borderRadius: '24px',
                  color: '#00E5FF',
                  boxShadow: '4px 4px 0px #00E5FF',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{lang.flag}</span>
                    <div>
                      <div className="font-bold text-white">{lang.name}</div>
                      <div className="text-xs font-black text-[#00E5FF]">
                        {lang.level}
                      </div>
                    </div>
                  </div>
                  <div
                    className="text-2xl font-black font-mono text-[#00E5FF]"
                  >
                    {lang.proficiency}%
                  </div>
                </div>

                <div className="relative w-full h-3 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(0,229,255,0.2)' }}>
                  <motion.div
                    className="h-full rounded-full relative"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${lang.proficiency}%` } : { width: 0 }}
                    transition={{ delay: i * 0.2 + 0.4, duration: 1.5, ease: 'easeOut' }}
                    style={{
                      background: '#00E5FF',
                    }}
                  />
                </div>

                <p className="text-xs font-medium text-white/60">
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
