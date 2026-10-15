import { memo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pause, Play } from 'lucide-react';
import { clientLogosAPI } from '../../lib/api';
import './Logofolio.css';

type Logo = { id: string; name: string; src: string; order: number };

function LogoImage({ logo }: { logo: Logo }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);

  return (
    <div className="flex h-[210px] w-[240px] shrink-0 items-center justify-center p-6 sm:h-[280px] sm:w-[320px] sm:p-8">
      {logo.src && failedSource !== logo.src ? (
        <img
          src={logo.src}
          alt={logo.name || 'Client logo'}
          className="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
          onError={() => setFailedSource(logo.src)}
        />
      ) : (
        <span className="max-w-full break-words text-center text-xl font-bold text-white sm:text-2xl">
          {logo.name}
        </span>
      )}
    </div>
  );
}

export default memo(function Logofolio() {
  const [paused, setPaused] = useState(false);
  const { data: logos = [] } = useQuery({
    queryKey: ['client-logos'],
    queryFn: () => clientLogosAPI.getAll().then((response) => response.data as Logo[]),
    staleTime: 120_000,
  });

  if (!logos.length) return null;

  const sortedLogos = [...logos].sort((a, b) => a.order - b.order);
  const slides = Array.from({ length: Math.max(1, Math.ceil(6 / logos.length)) }, () => sortedLogos).flat();

  return (
    <section id="logofolio" aria-labelledby="logofolio-title" className="relative w-full px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 id="logofolio-title" className="mb-8 text-center text-3xl font-bold text-primary sm:text-4xl md:text-5xl" dir="rtl">
          لوجوفوليو | <bdi>Logofolio</bdi>
        </h2>
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? 'تشغيل حركة الشعارات' : 'إيقاف حركة الشعارات'}
            title={paused ? 'تشغيل حركة الشعارات' : 'إيقاف حركة الشعارات'}
            aria-pressed={paused}
            className="flex h-10 w-10 items-center justify-center rounded border border-white/20 text-white transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {paused ? <Play size={18} /> : <Pause size={18} />}
          </button>
        </div>
        <div className="logofolio-carousel overflow-hidden border-y border-white/10" dir="ltr" role="region" aria-label="شعارات العملاء">
          <div className="logofolio-track" style={{ animationDuration: `${slides.length * 5}s`, animationPlayState: paused ? 'paused' : undefined }}>
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0" aria-hidden={copy === 1 ? true : undefined}>
                {slides.map((logo, index) => (
                  <div key={`${logo.id}-${index}`} aria-hidden={index >= sortedLogos.length ? true : undefined}>
                    <LogoImage logo={logo} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
