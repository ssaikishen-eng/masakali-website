import React, { useEffect, useState, useRef } from 'react';
import './HeroSection.css';

// Dynamically import all images from ../assets/images using Vite's glob
const images = import.meta.glob('../assets/images/*.{png,jpg,jpeg,svg}', { eager: true, as: 'url' });
const imageList = Object.values(images);

const SLIDE_INTERVAL = 5000;

const HeroSection = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef(null);
  const slideshowRef = useRef(null);
  const [showMobileCtas, setShowMobileCtas] = useState(false);
  const count = imageList.length;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const check = () => setIsMobile(mq.matches);
    check();
    mq.addEventListener?.('change', check);
    window.addEventListener('resize', check);
    return () => {
      mq.removeEventListener?.('change', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  useEffect(() => {
    // Show mobile CTAs only while slideshow is visible in viewport
    const el = slideshowRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => setShowMobileCtas(e.isIntersecting));
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    // Desktop/tablet auto-advance (index-based)
    if (isMobile) return;
    if (paused || count === 0) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % count);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [paused, count, isMobile]);

  useEffect(() => {
    // Mobile: auto-scroll the slideshow container every SLIDE_INTERVAL
    if (!isMobile) return;
    const el = slideshowRef.current;
    if (!el) return;
    clearInterval(timerRef.current);
    let running = true;

    const scrollStep = () => {
      const slideEl = el.querySelector('.slide');
      const slideW = (slideEl && slideEl.clientWidth) || el.clientWidth;
      // if at end, wrap to start
      if (el.scrollLeft + slideW >= el.scrollWidth - 2) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: slideW, behavior: 'smooth' });
      }
    };

    const start = () => {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        if (running) scrollStep();
      }, SLIDE_INTERVAL);
    };

    const stop = () => {
      running = false;
      clearInterval(timerRef.current);
    };

    // pause while user touches (allow manual swipe)
    const onTouchStart = () => { running = false; clearInterval(timerRef.current); };
    const onTouchEnd = () => { running = true; start(); };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('pointerdown', onTouchStart);
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('pointerup', onTouchEnd);

    start();
    return () => {
      stop();
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('pointerdown', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('pointerup', onTouchEnd);
    };
  }, [isMobile, imageList.length]);

  const prev = () => setIndex(i => (i - 1 + count) % count);
  const next = () => setIndex(i => (i + 1) % count);

  return (
    <section className="hero-section">
      <div
        ref={slideshowRef}
        className={`hero-slideshow ${isMobile ? 'mobile' : ''}`}
        onMouseEnter={() => !isMobile && setPaused(true)}
        onMouseLeave={() => !isMobile && setPaused(false)}
      >
        {imageList.map((img, idx) => (
          <div key={idx} className={`slide ${!isMobile && idx === index ? 'active' : ''}`}>
            <img
              src={img}
              alt={"Masakali food " + (idx + 1)}
            />
            <div className="video-hero-text">
              <span className="video-hero-subtitle">Premium Dining Experience</span>
              <h1 className="video-hero-title">@ Masakali California</h1>
              <p className="video-hero-description">
                Discover our carefully crafted menu featuring seasonal ingredients and innovative culinary techniques.
              </p>
              <div className="video-hero-buttons">
                <a href="/menu" className="video-hero-btn primary-btn">Order Online</a>
                <a href="/reservation" className="video-hero-btn primary-btn">Make Reservation</a>
              </div>
            </div>
          </div>
        ))}


        {!isMobile && (
          <>
            <button aria-label="Previous" onClick={prev} className="hero-slide-btn prev">‹</button>
            <button aria-label="Next" onClick={next} className="hero-slide-btn next">›</button>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
