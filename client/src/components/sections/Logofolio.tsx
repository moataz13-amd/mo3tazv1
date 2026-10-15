import { memo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  const { data: logos = [] } = useQuery({
    queryKey: ['client-logos'],
    queryFn: () => clientLogosAPI.getAll().then((response) => response.data as Logo[]),
    staleTime: 120_000,
  });

  if (!logos.length) return null;

  const sortedLogos = [...logos].sort((a, b) => a.order - b.order);
  const slides = Array.from({ length: Math.max(1, Math.ceil(6 / logos.length)) }, () => sortedLogos).flat();

  return (
    <section id="logofolio" aria-labelledby="logofolio-title" className="relative w-full py-16 md:py-24">
      <div className="w-full">
        <h2 id="logofolio-title" className="mb-8 px-6 text-center text-3xl font-bold text-primary sm:text-4xl md:text-5xl" dir="rtl">
          لوجوفوليو | <bdi>Logofolio</bdi>
        </h2>
        <div className="logofolio-carousel overflow-hidden" dir="ltr" role="region" aria-label="شعارات العملاء">
          <div className="logofolio-track" style={{ animationDuration: `${slides.length * 5}s` }}>
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
