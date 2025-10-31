"use client";

import { useEffect, useRef, useState } from "react";

interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

const services: Service[] = [
  {
    icon: "🎨",
    title: "Website Design & Entwicklung",
    description: "Moderne, responsive Websites mit Fokus auf UX und Performance",
    features: ["Responsive Design", "Performance-optimiert", "SEO-ready", "Moderne UI/UX"],
  },
  {
    icon: "⚙️",
    title: "KI-gestützte Prozessautomatisierung",
    description: "Personalisierte Automatisierungslösungen für Unternehmen",
    features: ["Workflow-Optimierung", "ROI-Messung", "Skalierbar", "Maßgeschneidert"],
  },
  {
    icon: "🎤",
    title: "Voice Agents & Sprachassistenten",
    description: "Intelligente Sprachlösungen für Kundeninteraktion",
    features: ["Natural Language Understanding", "Multi-Language", "Integration", "24/7 Verfügbar"],
  },
  {
    icon: "🤖",
    title: "Intelligent Agents & Automatisierung",
    description: "KI-Agents für Chat, Support und Automatisierung",
    features: ["Customizable", "API-Integration", "Analytics", "Multi-Channel"],
  },
];

export default function ServicesSection(): JSX.Element {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(services.length).fill(false));
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let timeoutIds: NodeJS.Timeout[] = [];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          services.forEach((_, index) => {
            const timeoutId = setTimeout(() => {
              setVisibleCards((prev) => {
                const next = [...prev];
                next[index] = true;
                return next;
              });
            }, index * 100);
            timeoutIds.push(timeoutId);
          });
          
          // Unobserve after all animations started to save resources
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      { 
        threshold: 0.15,
        rootMargin: "50px"
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="services-section" 
      id="services"
      aria-labelledby="services-title"
    >
      <div className="services-container">
        <h2 id="services-title" className="services-title">Unsere Dienstleistungen</h2>
        <p className="services-subtitle" id="services-subtitle">
          Professionelle Lösungen für Ihre digitalen Anforderungen
        </p>
        <div className="services-grid" role="list" aria-label="Unsere Dienstleistungen">
          {services.map((service, index) => (
            <article
              key={index}
              className={`service-card ${visibleCards[index] ? "visible" : ""}`}
              role="listitem"
              aria-labelledby={`service-title-${index}`}
            >
              <div className="service-overlay" />
              <div className="service-content">
                <div className="service-icon">{service.icon}</div>
                <h3 id={`service-title-${index}`} className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="feature-item">
                      <span className="feature-check">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="service-cta" aria-label={`Mehr erfahren über ${service.title}`}>
                  Mehr erfahren
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .services-section {
          position: relative;
          z-index: 1;
          padding: 96px 24px; /* 8px * 12 = 96px, 8px * 3 = 24px */
          background: transparent;
          overflow: hidden;
        }

        .services-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .services-title {
          margin: 0 0 16px 0; /* 8px * 2 = 16px */
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 600;
          color: #fff;
          text-align: center;
          letter-spacing: -0.02em;
          text-shadow: 0 0 24px rgba(99,102,241,0.5); /* 8px * 3 = 24px */
        }

        .services-subtitle {
          margin: 0 0 64px 0; /* 8px * 8 = 64px */
          font-size: clamp(16px, 2vw, 20px);
          color: rgba(255,255,255,0.7);
          text-align: center;
        }

        .services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px; /* 8px * 3 = 24px */
        }

        @media (min-width: 768px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px; /* 8px * 4 = 32px */
          }
        }

        @media (min-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px; /* 8px * 4 = 32px */
          }
        }

        .service-card {
          position: relative;
          border-radius: 24px; /* 8px * 3 = 24px */
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(10,10,15,0.4);
          backdrop-filter: blur(16px);
          box-shadow: 
            0 8px 24px rgba(0,0,0,0.4), /* Base shadow */
            0 16px 48px rgba(0,0,0,0.5), /* Medium shadow */
            0 24px 64px rgba(0,0,0,0.6), /* Deep shadow */
            0 0 0 1px rgba(99,102,241,0.08), /* Indigo glow */
            inset 0 1px 0 rgba(255,255,255,0.05); /* Inner highlight */
          overflow: hidden;
          /* Reserve space to prevent layout shift */
          min-height: 350px;
          opacity: 0;
          transform: translateY(40px); /* 8px * 5 = 40px */
          transition: opacity 600ms cubic-bezier(.4,0,.2,1), transform 600ms cubic-bezier(.4,0,.2,1),
            box-shadow 300ms ease;
          contain: layout style paint;
        }

        .service-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .service-card:hover {
          transform: translateY(-8px); /* 8px * 1 = 8px */
          box-shadow: 
            0 8px 24px rgba(236,72,153,0.2), /* Base glow */
            0 24px 64px rgba(236,72,153,0.25), /* Medium glow */
            0 32px 80px rgba(236,72,153,0.3), /* Deep glow */
            0 0 0 1px rgba(236,72,153,0.3), /* Border glow */
            0 0 0 2px rgba(139,92,246,0.1); /* Outer glow */
        }

        .service-overlay {
          pointer-events: none;
          position: absolute;
          inset: 0;
          background: radial-gradient(400px 400px at 50% 30%, rgba(99,102,241,0.05), transparent 60%);
          transition: opacity 300ms ease;
        }

        .service-card::after {
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: 24px;
          background: linear-gradient(135deg, 
            rgba(236,72,153,0.3), 
            rgba(139,92,246,0.3),
            rgba(236,72,153,0.25));
          opacity: 0;
          transition: opacity 500ms cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          z-index: -1;
          filter: blur(20px);
        }

        .service-card:hover::after {
          opacity: 0.6;
        }

        .service-card:hover .service-overlay {
          opacity: 0.8;
        }

        .service-content {
          position: relative;
          z-index: 1;
          padding: 40px 24px; /* 8px * 5 = 40px, 8px * 3 = 24px */
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .service-icon {
          font-size: 56px;
          margin-bottom: 16px; /* 8px * 2 = 16px */
          filter: drop-shadow(0 8px 24px rgba(236,72,153,0.5)); /* 8px * 1 = 8px, 8px * 3 = 24px */
          transform: translateZ(0);
        }

        .service-title {
          margin: 0 0 16px 0; /* 8px * 2 = 16px */
          font-size: clamp(22px, 3vw, 28px);
          font-weight: 600;
          color: #fff;
          letter-spacing: -0.01em;
        }

        .service-description {
          margin: 0 0 24px 0; /* 8px * 3 = 24px */
          font-size: 15px;
          line-height: 1.6;
          color: rgba(255,255,255,0.75);
          max-width: 480px;
        }

        .service-features {
          list-style: none;
          margin: 0 0 24px 0; /* 8px * 3 = 24px */
          padding: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px; /* 8px * 1.5 = 12px (acceptable) */
          width: 100%;
          max-width: 380px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px; /* 8px * 1 = 8px */
          font-size: 14px;
          color: rgba(255,255,255,0.85);
        }

        .feature-check {
          color: #34d399;
          font-weight: 600;
          font-size: 16px;
        }

        .service-cta {
          padding: 12px 24px; /* 8px * 1.5 = 12px, 8px * 3 = 24px */
          border: none;
          border-radius: 12px; /* 8px * 1.5 = 12px */
          font-size: 15px;
          font-weight: 500;
          color: white;
          background: linear-gradient(92deg, #fb7185 0%, #ec4899 60%, #a78bfa 120%);
          box-shadow: 
            0 4px 16px rgba(236,72,153,0.3), /* Base shadow */
            0 8px 32px rgba(236,72,153,0.4), /* Medium shadow */
            0 0 0 1px rgba(255,255,255,0.1) inset; /* Inner highlight */
          cursor: pointer;
          transition: box-shadow 200ms ease, transform 120ms ease;
        }

        .service-cta:focus-visible {
          outline: 3px solid rgba(236, 72, 153, 0.6);
          outline-offset: 2px;
        }

        .service-cta:hover {
          box-shadow: 
            0 8px 32px rgba(236,72,153,0.5), /* Base glow */
            0 12px 48px rgba(236,72,153,0.55), /* Medium glow */
            0 0 0 1px rgba(255,255,255,0.15) inset; /* Inner highlight */
          transform: translateY(-2px);
        }

        .service-cta:active {
          transform: translateY(0);
        }

        @media (min-width: 768px) {
          .services-section { padding: 112px 32px; } /* 8px * 14 = 112px, 8px * 4 = 32px */
          .service-content { padding: 48px 32px; } /* 8px * 6 = 48px, 8px * 4 = 32px */
        }

        @media (prefers-reduced-motion: reduce) {
          .service-card, .service-cta { transition: none; }
          .service-card.visible { transform: none; }
          .service-card:hover { transform: none; }
        }
      `}</style>
    </section>
  );
}


