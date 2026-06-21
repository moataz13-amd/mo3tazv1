import { useState, useEffect, useCallback } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const finishLoading = useCallback(() => {
    setProgress(100);
    setTimeout(() => setFadeOut(true), 400);
    setTimeout(() => onComplete(), 1000);
  }, [onComplete]);

  useEffect(() => {
    let progressInterval: ReturnType<typeof setInterval>;
    let completed = false;

    // Track real resource loading
    const trackLoading = () => {
      // Phase 1: Quick jump to ~30% (DOM ready)
      setProgress(15);

      // Phase 2: Incrementally increase based on time + resource checks
      let current = 15;
      progressInterval = setInterval(() => {
        if (completed) return;

        // Accelerate progress based on document state
        const docReady = document.readyState === 'complete';
        const increment = docReady ? 8 : 3;

        current = Math.min(current + increment + Math.random() * 4, docReady ? 98 : 75);
        setProgress(Math.round(current));

        if (current >= 98 && docReady) {
          completed = true;
          clearInterval(progressInterval);
          finishLoading();
        }
      }, 120);

      // Listen for full page load
      if (document.readyState === 'complete') {
        setTimeout(() => {
          if (!completed) {
            completed = true;
            clearInterval(progressInterval);
            finishLoading();
          }
        }, 800);
      } else {
        window.addEventListener('load', () => {
          setTimeout(() => {
            if (!completed) {
              completed = true;
              clearInterval(progressInterval);
              finishLoading();
            }
          }, 600);
        });
      }

      // Safety timeout - max 4 seconds
      setTimeout(() => {
        if (!completed) {
          completed = true;
          clearInterval(progressInterval);
          finishLoading();
        }
      }, 4000);
    };

    trackLoading();

    return () => {
      clearInterval(progressInterval);
    };
  }, [finishLoading]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-600 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ background: '#050816' }}
    >
      {/* Subtle ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(38,239,253,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Logo */}
      <div className="relative mb-8">
        <img
          src="/Mo3taz..svg"
          alt="MO3TAZ."
          style={{
            height: '44px',
            filter:
              'brightness(0) saturate(100%) invert(75%) sepia(60%) saturate(500%) hue-rotate(145deg) brightness(1.1)',
            animation: 'splashLogoGlow 2s ease-in-out infinite',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        {/* Fallback text logo */}
        <span
          className="font-bold text-3xl tracking-tight"
          style={{
            display: 'none',
            fontFamily: 'Outfit, sans-serif',
            color: '#26EFFD',
            textShadow: '0 0 30px rgba(38,239,253,0.5)',
          }}
        >
          MO3TAZ.
        </span>
      </div>

      {/* Progress bar container */}
      <div
        style={{
          width: '180px',
          height: '3px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Progress fill */}
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            borderRadius: '10px',
            background: 'linear-gradient(90deg, #26EFFD, #4F46E5)',
            boxShadow: '0 0 12px rgba(38,239,253,0.5), 0 0 4px rgba(38,239,253,0.8)',
            transition: 'width 0.25s ease-out',
          }}
        />
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes splashLogoGlow {
          0%, 100% { filter: brightness(0) saturate(100%) invert(75%) sepia(60%) saturate(500%) hue-rotate(145deg) brightness(1.1) drop-shadow(0 0 8px rgba(38,239,253,0.3)); }
          50% { filter: brightness(0) saturate(100%) invert(75%) sepia(60%) saturate(500%) hue-rotate(145deg) brightness(1.3) drop-shadow(0 0 20px rgba(38,239,253,0.6)); }
        }
      `}</style>
    </div>
  );
}
