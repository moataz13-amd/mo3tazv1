import { memo } from 'react';
import heroArtwork from '../../assets/hero-portfolio.svg';
import mobileHeroArtwork from '../../assets/hero-portfolio-mobile.svg';
import './Hero.css';

export default memo(function Hero() {
  return (
    <section id="home" className="portfolio-artwork-hero" aria-label="Portfolio">
      <h1 className="sr-only">Portfolio</h1>
      <picture className="portfolio-hero-picture">
        <source media="(max-width: 767px)" srcSet={mobileHeroArtwork} />
        <img src={heroArtwork} alt="Portfolio" className="portfolio-hero-artwork" fetchPriority="high" />
      </picture>
    </section>
  );
});
