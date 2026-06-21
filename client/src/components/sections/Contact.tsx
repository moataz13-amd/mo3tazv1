import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { messagesAPI } from '../../lib/api';
import { useSettingsStore } from '../../store';

const schema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون ثنائي على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  subject: z.string().min(3, 'يرجى كتابة موضوع الرسالة'),
  message: z.string().min(10, 'الرسالة يجب أن تحتوي على 10 أحرف على الأقل'),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const settings = useSettingsStore((state) => state.settings);
  
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await messagesAPI.send(data);
      toast.success('تم إرسال الرسالة بنجاح!');
      setSubmittedName(data.name);
      setIsSubmitSuccess(true);
      reset();
    } catch {
      toast.error('فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    }
  };

  const contactTabs = [
    {
      label: 'البريد الإلكتروني',
      value: settings?.email || 'mizoelzyat@gmail.com',
      href: `mailto:${settings?.email || 'mizoelzyat@gmail.com'}`,
      icon: <Mail className="text-[#26EFFD]" size={20} />,
      bgClass: 'bg-[#26EFFD] text-black',
      iconBgClass: 'bg-white',
      arrowColor: 'text-black/50',
    },
    {
      label: 'الهاتف',
      value: settings?.phone || '+20 1271948128',
      href: `tel:${settings?.phone || '+20 1271948128'}`,
      icon: <Phone className="text-white" size={20} />,
      bgClass: 'bg-white text-black',
      iconBgClass: 'bg-[#26EFFD]',
      arrowColor: 'text-black/30',
    },
    {
      label: 'تواصل معنا',
      value: 'واتساب',
      href: `https://wa.me/${
        settings?.phone?.replace(/[^0-9]/g, '') || '201271948128'
      }`,
      icon: (
        <svg className="text-white w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.45 5.416 1.451 5.408 0 9.807-4.394 9.811-9.808.002-2.624-1.018-5.09-2.868-6.944-1.85-1.855-4.318-2.876-6.944-2.878-5.412 0-9.81 4.396-9.814 9.812-.001 1.914.501 3.784 1.455 5.394L2.617 21.39l4.03-.636z" />
        </svg>
      ),
      bgClass: 'bg-white text-black',
      iconBgClass: 'bg-[#26EFFD]',
      arrowColor: 'text-black/30',
    },
  ];

  return (
    <section id="contact" className="py-16 md:py-24 px-6 relative z-10" dir="rtl">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="mb-3 text-base md:text-lg font-bold tracking-wider"
            style={{
              color: '#26EFFD',
              fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif",
            }}
          >
            تواصل
          </div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight"
            style={{
              fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif",
              fontWeight: 900,
            }}
          >
            لنبدأ الإبداع...
          </h2>
        </div>

        {/* 3 Overlapping Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-20 -mb-10 px-4">
          {contactTabs.map((tab, idx) => (
            <a
              key={idx}
              href={tab.href}
              target={tab.href.startsWith('http') ? '_blank' : undefined}
              rel={
                tab.href.startsWith('http') ? 'noopener noreferrer' : undefined
              }
              className="flex items-stretch rounded-2xl border-2 border-black overflow-hidden shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-y-[2px] transition-all duration-150 cursor-pointer bg-white"
            >
              {/* Text Column */}
              <div
                className={`flex-1 p-3.5 flex flex-col justify-center relative ${tab.bgClass}`}
                style={{ minHeight: '76px' }}
              >
                {/* Diagonal Arrow Icon */}
                <span className={`absolute top-2.5 left-2.5 ${tab.arrowColor}`}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="17" y1="7" x2="7" y2="17"></line>
                    <polyline points="17 17 7 17 7 7"></polyline>
                  </svg>
                </span>

                <span
                  className="text-[10px] opacity-60 font-black mb-0.5"
                  style={{ fontFamily: "'Sahara Bold', sans-serif" }}
                >
                  {tab.label}
                </span>
                <span
                  className="text-xs md:text-sm font-black truncate"
                  style={{ fontFamily: "'Sahara Bold', sans-serif" }}
                >
                  {tab.value}
                </span>
              </div>

              {/* Icon Column */}
              <div
                className={`w-14 flex items-center justify-center border-r-2 border-black ${tab.iconBgClass}`}
              >
                {tab.icon}
              </div>
            </a>
          ))}
        </div>

        {/* Main Form White Card */}
        <div className="bg-white rounded-[32px] border-2 border-black p-8 md:p-12 pt-20 md:pt-24 shadow-[8px_8px_0px_#000000] relative z-10">
          {!isSubmitSuccess ? (
            <>
              {/* Internal Title */}
              <div className="mb-8 text-right text-black">
                <h3
                  className="text-3xl md:text-4xl font-black mb-2"
                  style={{
                    fontFamily:
                      "'Milan Display', 'Sahara Bold', 'Inter', sans-serif",
                    fontWeight: 900,
                  }}
                >
                  تواصل الآن
                </h3>
                <p
                  className="text-sm font-black opacity-80"
                  style={{
                    fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                  }}
                >
                  نقوم بالرد في خلال أقل من 12 ساعة
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 text-right"
              >
                {/* Name + Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="flex flex-col">
                    <input
                      {...register('name')}
                      placeholder="إسمك"
                      className="w-full bg-[#F3F4F6] text-black placeholder-black/50 border-2 border-transparent focus:border-black rounded-2xl px-5 py-4 text-sm font-black transition-all outline-none"
                      style={{
                        fontFamily: "'Sahara Bold', sans-serif",
                        direction: 'rtl',
                      }}
                    />
                    {errors.name && (
                      <p
                        className="text-red-600 text-xs mt-1.5 font-black pr-2"
                        style={{ fontFamily: "'Sahara Bold', sans-serif" }}
                      >
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <input
                      {...register('email')}
                      placeholder="بريدك الإلكتروني"
                      type="email"
                      className="w-full bg-[#F3F4F6] text-black placeholder-black/50 border-2 border-transparent focus:border-black rounded-2xl px-5 py-4 text-sm font-black transition-all outline-none"
                      style={{
                        fontFamily: "'Sahara Bold', sans-serif",
                        direction: 'rtl',
                      }}
                    />
                    {errors.email && (
                      <p
                        className="text-red-600 text-xs mt-1.5 font-black pr-2"
                        style={{ fontFamily: "'Sahara Bold', sans-serif" }}
                      >
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div className="flex flex-col">
                  <input
                    {...register('subject')}
                    placeholder="ما هو موضوع رسالتك..؟"
                    className="w-full bg-[#F3F4F6] text-black placeholder-black/50 border-2 border-transparent focus:border-black rounded-2xl px-5 py-4 text-sm font-black transition-all outline-none"
                    style={{
                      fontFamily: "'Sahara Bold', sans-serif",
                      direction: 'rtl',
                    }}
                  />
                  {errors.subject && (
                    <p
                      className="text-red-600 text-xs mt-1.5 font-black pr-2"
                      style={{ fontFamily: "'Sahara Bold', sans-serif" }}
                    >
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="flex flex-col">
                  <textarea
                    {...register('message')}
                    placeholder="رسالتك"
                    rows={5}
                    className="w-full bg-[#F3F4F6] text-black placeholder-black/50 border-2 border-transparent focus:border-black rounded-2xl px-5 py-4 text-sm font-black transition-all outline-none resize-none"
                    style={{
                      fontFamily: "'Sahara Bold', sans-serif",
                      direction: 'rtl',
                    }}
                  />
                  {errors.message && (
                    <p
                      className="text-red-600 text-xs mt-1.5 font-black pr-2"
                      style={{ fontFamily: "'Sahara Bold', sans-serif" }}
                    >
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01, y: 1 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-5 inline-flex items-center justify-center gap-3 bg-[#00E5FF] text-black border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] transition-all duration-150 select-none whitespace-nowrap cursor-pointer text-lg font-black"
                    style={{
                      borderRadius: '9999px',
                      fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        <span>جاري الإرسال...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>أرسل الرسالة</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 text-black flex flex-col items-center"
            >
              {/* Animated checkmark container */}
              <div className="w-20 h-20 rounded-full border-2 border-black bg-[#26EFFD] flex items-center justify-center shadow-[4px_4px_0px_#000000] mb-8">
                <svg
                  className="w-10 h-10 text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3
                className="text-3xl md:text-4xl font-black mb-4"
                style={{
                  fontFamily:
                    "'Milan Display', 'Sahara Bold', 'Inter', sans-serif",
                  fontWeight: 900,
                }}
              >
                شكراً لتواصلك، {submittedName}!
              </h3>

              {/* Message */}
              <p
                className="text-base md:text-lg leading-[1.8] max-w-md opacity-85"
                style={{
                  fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                }}
              >
                لقد استلمت رسالتك بنجاح. سأقوم بمراجعة التفاصيل والرد عليك في أسرع وقت ممكن (غالباً في خلال ساعات قليلة).
              </p>

              {/* Back to Form Button */}
              <motion.button
                onClick={() => setIsSubmitSuccess(false)}
                whileHover={{ scale: 1.03, y: 1 }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 px-8 py-3 bg-[#F3F4F6] text-black border-2 border-black rounded-full font-black text-sm shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] transition-all cursor-pointer"
                style={{
                  fontFamily: "'Sahara Bold', 'Inter', sans-serif",
                }}
              >
                أرسل رسالة أخرى
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
