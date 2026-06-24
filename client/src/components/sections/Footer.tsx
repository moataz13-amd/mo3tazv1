import { memo } from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../../store';

const Footer = memo(function Footer() {
  const settings = useSettingsStore((state) => state.settings);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(element, { offset: -20, duration: 1.2 });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const socialLinks = [
    {
      name: 'Facebook',
      url: settings?.facebook_url || 'https://facebook.com',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: settings?.instagram_url || 'https://instagram.com',
      icon: (
        <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2.5" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
    },
    {
      name: 'TikTok',
      url: settings?.tiktok_url || 'https://tiktok.com',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.73 4.12 1.12 1.09 2.63 1.63 4.17 1.7v3.86c-1.78-.02-3.52-.52-5-1.47v7.41c.01 1.61-.43 3.2-1.33 4.51-.97 1.37-2.42 2.33-4.04 2.67-1.73.34-3.55.08-5.12-.76-1.57-.88-2.77-2.34-3.34-4.07-.6-1.84-.46-3.89.43-5.61.94-1.76 2.58-3.03 4.52-3.48 1.19-.26 2.44-.19 3.59.21V3.97c-1.39-.41-2.61-1.33-3.36-2.58C9.53.48 9.38.25 9.25 0c1.09.01 2.19.01 3.275.02z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="w-full bg-[#26EFFD] text-black pt-20 pb-8 px-6 md:px-12 relative z-20" dir="rtl">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Top CTA Area */}
        <div className="text-center mb-16">
          <h4 
            className="text-lg md:text-xl font-black mb-2 opacity-80"
            style={{ fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif" }}
          >
            جاهز للبداية..؟
          </h4>
          <h2 
            className="text-4xl md:text-6xl font-black mb-4 tracking-tight"
            style={{ fontFamily: "'Milan Display', 'Sahara Bold', 'Inter', sans-serif" }}
          >
            إصنع أثرك اليوم...
          </h2>
          <p 
            className="text-sm md:text-base font-black opacity-60 mb-8"
            style={{ fontFamily: "'Sahara Bold', 'Inter', sans-serif" }}
          >
            حول فكرتك الآن...تواصل الآن
          </p>
          
          {/* Scroll to contact button */}
          <motion.button
            onClick={() => handleScroll('contact')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-3 bg-white text-black border-2 border-black rounded-full font-black text-xl shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] transition-all cursor-pointer"
            style={{ fontFamily: "'Milan Display', 'Sahara Bold', sans-serif" }}
          >
            تواصل
          </motion.button>
        </div>

        {/* Separator Line */}
        <div className="w-full flex items-center gap-2 mb-16 opacity-30">
          <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
          <div className="flex-1 h-[1.5px] bg-black"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
        </div>

        {/* Info Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16 text-right">
          
          {/* Right Column: Logo & Socials */}
          <div className="flex flex-col items-start justify-between">
            <div>
              <h3 
                className="text-3xl md:text-4xl font-black mb-1"
                style={{ fontFamily: "'Milan Display', 'Sahara Bold', sans-serif" }}
              >
                معتز جمعة.
              </h3>
              <p 
                className="text-sm font-black opacity-70 mb-6"
                style={{ fontFamily: "'Sahara Bold', 'Inter', sans-serif" }}
              >
                جونيور جرافيك ديزاينر
              </p>
            </div>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000000] transition-all text-black"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Middle Column: Quick Links */}
          <div className="flex flex-col">
            <h4 
              className="text-lg font-black mb-4"
              style={{ fontFamily: "'Sahara Bold', sans-serif" }}
            >
              روابط سريعة
            </h4>
            <ul 
              className="space-y-2 text-sm font-black opacity-80"
              style={{ fontFamily: "'Sahara Bold', sans-serif" }}
            >
              <li>
                <button onClick={() => handleScroll('about')} className="hover:underline text-right block cursor-pointer">
                  عني
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll('services')} className="hover:underline text-right block cursor-pointer">
                  الخدمات
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll('skills')} className="hover:underline text-right block cursor-pointer">
                  منهجية العمل
                </button>
              </li>
              {/* <li>
                <button onClick={() => handleScroll('testimonials')} className="hover:underline text-right block cursor-pointer">
                  الشهادات
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll('experience')} className="hover:underline text-right block cursor-pointer">
                  الخبرات
                </button>
              </li> */}
              <li>
                <button onClick={() => handleScroll('contact')} className="hover:underline text-right block cursor-pointer">
                  التواصل
                </button>
              </li>
            </ul>
          </div>

          {/* Left Column: Contact info */}
          <div className="flex flex-col">
            <h4 
              className="text-lg font-black mb-4"
              style={{ fontFamily: "'Sahara Bold', sans-serif" }}
            >
              تواصل معي
            </h4>
            <div 
              className="space-y-2 text-sm font-black opacity-80"
              style={{ fontFamily: "'Sahara Bold', sans-serif" }}
            >
              <p className="ltr:text-left rtl:text-right">
                <a href={`mailto:${settings?.email || 'mizoelzyat@gmail.com'}`} className="hover:underline">
                  {settings?.email || 'mizoelzyat@gmail.com'}
                </a>
              </p>
              <p className="ltr:text-left rtl:text-right">
                <a href={`tel:${settings?.phone || '+20 1271946126'}`} className="hover:underline">
                  {settings?.phone || '+20 1271946126'}
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Copyright Footer */}
        <div className="w-full pt-8 border-t border-black/10 flex flex-col md:flex-row gap-4 items-center justify-between text-xs font-black opacity-70" style={{ fontFamily: "'Sahara Bold', 'Inter', sans-serif" }}>
          <span>معتز جمعة. جميع الحقوق محفوظة</span>
          <span>تصميم و تطوير... معتز جمعة</span>
        </div>

      </div>
    </footer>
  );
});

export default Footer;
