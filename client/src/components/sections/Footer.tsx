import { memo } from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../../store';
import type { ReactNode } from 'react';

const SOCIAL_ICONS: Record<string, ReactNode> = {
  facebook: (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2.5" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
  tiktok: (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.73 4.12 1.12 1.09 2.63 1.63 4.17 1.7v3.86c-1.78-.02-3.52-.52-5-1.47v7.41c.01 1.61-.43 3.2-1.33 4.51-.97 1.37-2.42 2.33-4.04 2.67-1.73.34-3.55.08-5.12-.76-1.57-.88-2.77-2.34-3.34-4.07-.6-1.84-.46-3.89.43-5.61.94-1.76 2.58-3.03 4.52-3.48 1.19-.26 2.44-.19 3.59.21V3.97c-1.39-.41-2.61-1.33-3.36-2.58C9.53.48 9.38.25 9.25 0c1.09.01 2.19.01 3.275.02z" />
    </svg>
  ),
  behance: (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.644-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
    </svg>
  ),
  dribbble: (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.1h4.52V24H.24V8.1zm7.32 0h4.33v2.16h.06c.6-1.14 2.08-2.34 4.28-2.34 4.58 0 5.42 3.01 5.42 6.93V24h-4.52v-7.89c0-1.88-.03-4.3-2.62-4.3-2.62 0-3.02 2.05-3.02 4.17V24H7.56V8.1z" />
    </svg>
  ),
  x: (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  youtube: (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  whatsapp: (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  pinterest: (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
    </svg>
  ),
  github: (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  telegram: (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
  other: (
    <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  ),
};

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

  const socialLinks = (settings?.social_links || [])
    .filter((link) => link.enabled !== false && link.url)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((link) => ({
      name: link.platform,
      url: link.url,
      icon: SOCIAL_ICONS[link.platform] || SOCIAL_ICONS.other,
    }));

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
                {settings?.name || ''}
              </h3>
              {settings?.title && (
                <p 
                  className="text-sm font-black opacity-70 mb-6"
                  style={{ fontFamily: "'Sahara Bold', 'Inter', sans-serif" }}
                >
                  {settings.title}
                </p>
              )}
            </div>
            
            {/* Social Icons */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 mt-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name + social.url}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000000] transition-all text-black"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
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
              {settings?.email && (
                <p className="ltr:text-left rtl:text-right">
                  <a href={`mailto:${settings.email}`} className="hover:underline">
                    {settings.email}
                  </a>
                </p>
              )}
              {settings?.phone && (
                <p className="ltr:text-left rtl:text-right">
                  <a href={`tel:${settings.phone}`} className="hover:underline">
                    {settings.phone}
                  </a>
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Copyright Footer */}
        <div className="w-full pt-8 border-t border-black/10 flex flex-col md:flex-row gap-4 items-center justify-between text-xs font-black opacity-70" style={{ fontFamily: "'Sahara Bold', 'Inter', sans-serif" }}>
          <span>معتز جمعة. جميع الحقوق محفوظة</span>
          <span>تطوير و تصميم شركة 3m techs</span>
        </div>

      </div>
    </footer>
  );
});

export default Footer;
