import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { useQuery } from '@tanstack/react-query';
import { settingsAPI } from '../lib/api';
import { useSettingsStore } from '../store';
import type { SiteSettings } from '../types';
import ThreeCanvas from '../components/three/ThreeCanvas';
import FloatingNav from '../components/navigation/FloatingNav';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import PortfolioSection from '../components/sections/Portfolio';
import Stats from '../components/sections/Stats';
import Services from '../components/sections/Services';
import Contact from '../components/sections/Contact';
import Footer from '../components/sections/Footer';

export default function Portfolio() {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsAPI.get().then((r) => r.data as SiteSettings),
  });

  const setSettings = useSettingsStore((state) => state.setSettings);

  useEffect(() => {
    if (settings) {
      setSettings(settings);
      document.title = settings.seo_title || `${settings.name} | ${settings.title}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', settings.seo_description || '');
      }
    }
  }, [settings, setSettings]);

  useEffect(() => {
    // Initialize Lenis Smooth Scroll with ultra-smooth lerp settings
    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1.0,
      smoothWheel: true,
      infinite: false,
    });

    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      (window as any).lenis = undefined;
    };
  }, []);

  return (
    <div className="relative min-h-screen text-white select-none bg-[#050816]">

      {/* Floating navigation bar */}
      <FloatingNav />

      {/* Main layout wrapper */}
      <main className="relative z-20 w-full flex flex-col gap-1 pt-[70px] md:pt-0">
        <Hero />
        <About />
        <Services />
        <Skills />
        <PortfolioSection />
        <Stats />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
