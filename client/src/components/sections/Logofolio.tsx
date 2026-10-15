import { memo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { clientLogosAPI } from '../../lib/api';

type Logo = { id: string; name: string; src: string; order: number };

function LogoImage({ logo }: { logo: Logo }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);

  return (
    <div className="flex aspect-[4/3] min-w-0 items-center justify-center border-b border-white/10 p-5 sm:p-8 lg:p-10">
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

  return (
    <section id="logofolio" aria-labelledby="logofolio-title" className="relative w-full px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 id="logofolio-title" className="mb-10 text-center text-4xl font-bold text-primary md:mb-14 md:text-5xl" dir="ltr">
          Logofolio
        </h2>
        <div className="grid grid-cols-2 gap-x-4 border-t border-white/10 sm:gap-x-8 lg:grid-cols-3">
          {[...logos].sort((a, b) => a.order - b.order).map((logo) => (
            <LogoImage key={logo.id} logo={logo} />
          ))}
        </div>
      </div>
    </section>
  );
});
