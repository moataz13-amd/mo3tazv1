import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { servicesAPI } from '../../lib/api';
import type { Service } from '../../types';

const defaultServices: Service[] = [
  {
    id: '1',
    title: 'الهوية البصرية',
    description: 'أبني هويات بصرية متكاملة تؤسس شخصية العلامة التجارية وتترك انطباعاً قوياً لدى العملاء، بدءاً من الشعار وحتى أدق العناصر البصرية المرتبطة بالعلامة.',
    icon: '/services/branding.png',
    features: [],
    order: 1,
  },
  {
    id: '2',
    title: 'تصميم السوشيال ميديا',
    description: 'إنشاء تصاميم إبداعية وجذابة لمنصات التواصل الاجتماعي تساعد على زيادة التفاعل وتعزز حضور العلامة التجارية بشكل احترافي ومبتكر.',
    icon: '/services/social_media.png',
    features: [],
    order: 2,
  },
  {
    id: '3',
    title: 'تصميم المطبوعات',
    description: 'تصميم مواد تسويقية ومطبوعات احترافية تعزز هوية العلامة التجارية وتساعد على إيصال الرسائل التسويقية بشكل فعال ومميز.',
    icon: '/services/print.png',
    features: [],
    order: 3,
  },
  {
    id: '4',
    title: 'تصميم واجهات المستخدم',
    description: 'تصميم واجهات رقمية حديثة تجمع بين الجمال وسهولة الاستخدام لتقديم تجربة مستخدم مميزة وتحقق أهداف المشروع بكفاءة.',
    icon: '/services/ui_ux.png',
    features: [],
    order: 4,
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesAPI.getAll().then((r) => r.data as Service[]),
  });

  const allServices = (services && services.length > 0 ? services : defaultServices)
    .sort((a, b) => a.order - b.order);

  return (
    <section id="services" className="py-8 px-6" dir="rtl">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto flex flex-col gap-12"
      >
        {/* Services Cards Stack */}
        <div className="flex flex-col gap-16 md:gap-24 w-full">
          {allServices.map((service, i) => {
            const isOdd = i % 2 === 0; // 0, 2 are odd index physically (1st, 3rd card)
            const isImage = service.icon.startsWith('/') || service.icon.startsWith('http');
            const cardNumber = String(i + 1).padStart(2, '0');

            return (
              <div
                key={service.id}
                className="services-card-sticky w-full"
                style={{
                  '--card-index': i,
                } as React.CSSProperties}
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="relative overflow-hidden rounded-[40px] md:rounded-[50px] p-10 md:py-8 md:px-14 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 min-h-[340px] md:h-[440px] transition-all duration-300 hover:scale-[1.01]"
                  style={{
                    background: isOdd ? '#26EFFD' : '#FFFFFF',
                    boxShadow: isOdd ? '0 10px 30px rgba(38,239,253,0.15)' : '0 10px 30px rgba(255,255,255,0.08)',
                  }}
                >
                  {/* Large semi-transparent background number */}
                  <div
                    className="absolute top-[-10px] left-[-5px] md:top-[-25px] md:left-[-15px] text-[6rem] md:text-[9rem] lg:text-[11rem] select-none pointer-events-none leading-none"
                    style={{
                      fontFamily: "'Milan Display', sans-serif",
                      fontWeight: 900,
                      color: isOdd ? 'rgba(0, 0, 0, 0.07)' : 'rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    {cardNumber}
                  </div>

                  {/* Right Area: Text Info */}
                  <div className="w-full md:w-[60%] flex flex-col justify-center text-right z-10 select-text">
                    <h3
                      className="text-3xl md:text-4xl lg:text-5xl font-black mb-3"
                      style={{
                        fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif",
                        color: '#000000',
                      }}
                    >
                      {service.title}
                    </h3>
                    <p
                      className="text-sm md:text-base leading-[1.8] font-medium"
                      style={{
                        fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                        color: isOdd ? '#111827' : '#374151',
                      }}
                    >
                      {service.description}
                    </p>
                  </div>

                  {/* Left Area: Illustration */}
                  <div className="w-full md:w-[35%] flex justify-center items-center z-10">
                    {isImage ? (
                      <img
                        src={service.icon}
                        alt={service.title}
                        className="max-h-[180px] md:max-h-[240px] w-auto object-contain transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <span className="text-7xl md:text-8xl select-none">{service.icon}</span>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
