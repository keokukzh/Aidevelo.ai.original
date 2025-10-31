"use client";

import { useEffect, useRef, useState } from "react";

export default function IntroductionSection(): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Unobserve after visible to save resources
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      { 
        threshold: 0.2,
        rootMargin: "50px"
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="intro-section" 
      id="introduction"
      aria-labelledby="intro-title"
    >
      <div className="intro-container">
        <div className={`intro-card ${isVisible ? "visible" : ""}`}>
          <div className="intro-overlay" />
          <div className="intro-content">
            <h2 id="intro-title" className="intro-title">Was wir machen</h2>
            <p className="intro-text">
              Wir entwickeln intelligente Lösungen, die Unternehmen dabei helfen,
              ihre Prozesse zu automatisieren und ihre digitale Präsenz zu stärken.
              Mit modernster KI-Technologie erstellen wir maßgeschneiderte Agenten,
              Websites und Automatisierungssysteme, die nicht nur funktional,
              sondern auch benutzerfreundlich sind.
            </p>
            <div className="intro-highlights" role="list" aria-label="Unsere Hauptmerkmale">
              <div className="highlight" role="listitem">
                <span className="highlight-icon" aria-hidden="true">🤖</span>
                <span className="highlight-text">KI-gestützte Automatisierung</span>
              </div>
              <div className="highlight" role="listitem">
                <span className="highlight-icon" aria-hidden="true">🎨</span>
                <span className="highlight-text">Modernes Design</span>
              </div>
              <div className="highlight" role="listitem">
                <span className="highlight-icon" aria-hidden="true">⚡</span>
                <span className="highlight-text">Performance-optimiert</span>
              </div>
              <div className="highlight" role="listitem">
                <span className="highlight-icon" aria-hidden="true">🔒</span>
                <span className="highlight-text">Sicher & Skalierbar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .intro-section {
          position: relative;
          z-index: 1;
          padding: 80px 24px; /* 8px * 10 = 80px, 8px * 3 = 24px */
          background: transparent;
          overflow: hidden;
        }

        .intro-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .intro-card {
          position: relative;
          border-radius: 24px; /* 8px * 3 = 24px */
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(10,10,15,0.4);
          backdrop-filter: blur(16px);
          box-shadow: 
            0 8px 24px rgba(0,0,0,0.5), /* Base shadow */
            0 16px 48px rgba(0,0,0,0.6), /* Medium shadow */
            0 24px 88px rgba(0,0,0,0.7), /* Deep shadow */
            0 0 0 1px rgba(99,102,241,0.1), /* Indigo glow */
            inset 0 1px 0 rgba(255,255,255,0.05); /* Inner highlight */
          overflow: hidden;
          /* Reserve space to prevent layout shift */
          min-height: 400px;
          opacity: 0;
          transform: translateY(32px); /* 8px * 4 = 32px */
          transition: opacity 700ms cubic-bezier(.4,0,.2,1), transform 700ms cubic-bezier(.4,0,.2,1);
          contain: layout style paint;
        }

        .intro-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .intro-overlay {
          pointer-events: none;
          position: absolute;
          inset: 0;
          background: radial-gradient(800px 800px at 30% 20%, rgba(99,102,241,0.06), transparent 50%),
            radial-gradient(800px 800px at 70% 80%, rgba(236,72,153,0.06), transparent 50%);
          transition: opacity 400ms ease;
        }

        .intro-card::after {
          content: "";
          position: absolute;
          inset: -3px;
          border-radius: 24px;
          background: linear-gradient(135deg, 
            rgba(99,102,241,0.2), 
            rgba(236,72,153,0.2),
            rgba(99,102,241,0.15));
          opacity: 0;
          transition: opacity 500ms cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          z-index: -1;
          filter: blur(18px);
        }

        .intro-card:hover::after {
          opacity: 0.5;
        }

        .intro-card:hover .intro-overlay {
          opacity: 1;
        }

        .intro-content {
          position: relative;
          z-index: 1;
          padding: 56px 40px; /* 8px * 7 = 56px, 8px * 5 = 40px */
        }

        .intro-title {
          margin: 0 0 24px 0; /* 8px * 3 = 24px */
          font-size: clamp(32px, 4.5vw, 48px);
          font-weight: 600;
          color: #fff;
          text-align: center;
          letter-spacing: -0.02em;
          text-shadow: 0 0 24px rgba(99,102,241,0.4); /* 8px * 3 = 24px */
        }

        .intro-text {
          margin: 0 0 40px 0; /* 8px * 5 = 40px */
          font-size: clamp(16px, 2vw, 18px);
          line-height: 1.7;
          color: rgba(255,255,255,0.85);
          text-align: center;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .intro-highlights {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px; /* 8px * 3 = 24px */
          margin-top: 40px; /* 8px * 5 = 40px */
        }

        .highlight {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px; /* 8px * 1.5 = 12px (acceptable deviation) */
          padding: 24px 16px; /* 8px * 3 = 24px, 8px * 2 = 16px */
          border-radius: 16px; /* 8px * 2 = 16px */
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(10,10,15,0.3);
          transition: transform 200ms ease, box-shadow 200ms ease;
        }

        .highlight:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 4px 16px rgba(236,72,153,0.15), /* Base glow */
            0 12px 32px rgba(236,72,153,0.2), /* Medium glow */
            0 0 0 1px rgba(236,72,153,0.25); /* Border glow */
        }

        .highlight-icon {
          font-size: 36px;
          filter: drop-shadow(0 4px 12px rgba(236,72,153,0.4)); /* 8px * 0.5 = 4px, 8px * 1.5 = 12px */
        }

        .highlight-text {
          font-size: 15px;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          text-align: center;
        }

        @media (min-width: 768px) {
          .intro-section { padding: 96px 32px; } /* 8px * 12 = 96px, 8px * 4 = 32px */
          .intro-content { padding: 72px 56px; } /* 8px * 9 = 72px, 8px * 7 = 56px */
        }

        @media (prefers-reduced-motion: reduce) {
          .intro-card { transition: none; }
          .highlight { transition: none; }
          .intro-card.visible { transform: none; }
        }
      `}</style>
    </section>
  );
}


