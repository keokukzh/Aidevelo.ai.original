"use client";

import { useEffect, useRef, useState } from "react";

interface Product {
  title: string;
  description: string;
  useCases: string[];
  icon: string;
}

const products: Product[] = [
  {
    title: "Chat Agents",
    description: "Intelligente Chatbots für Kundensupport, Lead-Generierung und Automatisierung von Anfragen",
    useCases: [
      "24/7 Kunden-Support",
      "Lead-Qualifizierung",
      "FAQ-Automatisierung",
      "Multi-Channel Integration",
    ],
    icon: "💬",
  },
  {
    title: "Voice Agents",
    description: "Sprachassistenten für Telefonie, IVR-Systeme und Voice-basierte Interaktionen",
    useCases: [
      "Call-Center Automatisierung",
      "IVR-Ersatz",
      "Voice-to-Text Services",
      "Natural Language Understanding",
    ],
    icon: "🎙️",
  },
  {
    title: "Automation Agents",
    description: "KI-Agents zur Automatisierung von Geschäftsprozessen und Workflows",
    useCases: [
      "Datenverarbeitung",
      "Workflow-Optimierung",
      "API-Integration",
      "Prozess-Monitoring",
    ],
    icon: "⚡",
  },
  {
    title: "Custom Agents",
    description: "Maßgeschneiderte Agent-Lösungen für spezifische Unternehmensanforderungen",
    useCases: [
      "Individuelle Anforderungen",
      "Branchenspezifische Lösungen",
      "Integration in bestehende Systeme",
      "Skalierbare Architektur",
    ],
    icon: "🔧",
  },
];

export default function ProductsSection(): JSX.Element {
  const [visibleProducts, setVisibleProducts] = useState<boolean[]>(
    new Array(products.length).fill(false)
  );
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let timeoutIds: NodeJS.Timeout[] = [];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          products.forEach((_, index) => {
            const timeoutId = setTimeout(() => {
              setVisibleProducts((prev) => {
                const next = [...prev];
                next[index] = true;
                return next;
              });
            }, index * 80);
            timeoutIds.push(timeoutId);
          });
          
          // Unobserve after all animations started to save resources
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      { 
        threshold: 0.1,
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
      className="products-section" 
      id="products"
      aria-labelledby="products-title"
    >
      <div className="products-container">
        <h2 id="products-title" className="products-title">Unsere Agents & Produkte</h2>
        <p className="products-subtitle" id="products-subtitle">
          Intelligente Lösungen für Ihre Geschäftsprozesse
        </p>
        <div className="products-grid" role="list" aria-label="Unsere Agents und Produkte">
          {products.map((product, index) => (
            <article
              key={index}
              className={`product-card ${visibleProducts[index] ? "visible" : ""}`}
              role="listitem"
              aria-labelledby={`product-title-${index}`}
            >
              <div className="product-overlay" />
              <div className="product-content">
                <div className="product-icon">{product.icon}</div>
                <h3 id={`product-title-${index}`} className="product-title">{product.title}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-usecases">
                  <h4 className="usecases-title">Anwendungsbereiche:</h4>
                  <ul className="usecases-list">
                    {product.useCases.map((useCase, idx) => (
                      <li key={idx} className="usecase-item">
                        <span className="usecase-dot">●</span>
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="product-cta" aria-label={`Mehr über ${product.title} erfahren`}>
                  Demo ansehen
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .products-section {
          position: relative;
          z-index: 1;
          padding: 96px 24px; /* 8px * 12 = 96px, 8px * 3 = 24px */
          background: transparent;
          overflow: hidden;
        }

        .products-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .products-title {
          margin: 0 0 16px 0; /* 8px * 2 = 16px */
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 600;
          color: #fff;
          text-align: center;
          letter-spacing: -0.02em;
          text-shadow: 0 0 24px rgba(99,102,241,0.5); /* 8px * 3 = 24px */
        }

        .products-subtitle {
          margin: 0 0 64px 0; /* 8px * 8 = 64px */
          font-size: clamp(16px, 2vw, 20px);
          color: rgba(255,255,255,0.7);
          text-align: center;
        }

        .products-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px; /* 8px * 3 = 24px */
        }

        @media (min-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px; /* 8px * 4 = 32px */
          }
        }

        @media (min-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px; /* 8px * 4 = 32px */
          }
        }

        .product-card {
          position: relative;
          border-radius: 24px; /* 8px * 3 = 24px */
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(10,10,15,0.4);
          backdrop-filter: blur(16px);
          box-shadow: 
            0 8px 24px rgba(0,0,0,0.4), /* Base shadow */
            0 16px 48px rgba(0,0,0,0.5), /* Medium shadow */
            0 24px 64px rgba(0,0,0,0.6), /* Deep shadow */
            0 0 0 1px rgba(236,72,153,0.08), /* Pink glow */
            inset 0 1px 0 rgba(255,255,255,0.05); /* Inner highlight */
          overflow: hidden;
          /* Reserve space to prevent layout shift */
          min-height: 400px;
          opacity: 0;
          transform: translateY(40px); /* 8px * 5 = 40px */
          transition: opacity 600ms cubic-bezier(.4,0,.2,1), transform 600ms cubic-bezier(.4,0,.2,1),
            box-shadow 300ms ease;
          contain: layout style paint;
        }

        .product-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .product-card:hover {
          transform: translateY(-8px); /* 8px * 1 = 8px */
          box-shadow: 
            0 8px 24px rgba(236,72,153,0.2), /* Base glow */
            0 24px 64px rgba(236,72,153,0.25), /* Medium glow */
            0 32px 80px rgba(236,72,153,0.3), /* Deep glow */
            0 0 0 1px rgba(236,72,153,0.3), /* Border glow */
            0 0 0 2px rgba(99,102,241,0.1); /* Outer glow */
        }

        .product-overlay {
          pointer-events: none;
          position: absolute;
          inset: 0;
          background: radial-gradient(400px 400px at 50% 30%, rgba(236,72,153,0.05), transparent 60%);
          transition: opacity 300ms ease;
        }

        .product-card::after {
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: 24px;
          background: linear-gradient(135deg, 
            rgba(236,72,153,0.3), 
            rgba(99,102,241,0.3),
            rgba(236,72,153,0.25));
          opacity: 0;
          transition: opacity 500ms cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          z-index: -1;
          filter: blur(20px);
        }

        .product-card:hover::after {
          opacity: 0.6;
        }

        .product-card:hover .product-overlay {
          opacity: 0.8;
        }

        .product-content {
          position: relative;
          z-index: 1;
          padding: 40px 24px; /* 8px * 5 = 40px, 8px * 3 = 24px */
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .product-icon {
          font-size: 56px;
          margin-bottom: 16px; /* 8px * 2 = 16px */
          filter: drop-shadow(0 8px 24px rgba(99,102,241,0.5)); /* 8px * 1 = 8px, 8px * 3 = 24px */
          transform: translateZ(0);
        }

        .product-title {
          margin: 0 0 16px 0; /* 8px * 2 = 16px */
          font-size: clamp(22px, 3vw, 28px);
          font-weight: 600;
          color: #fff;
          letter-spacing: -0.01em;
        }

        .product-description {
          margin: 0 0 24px 0; /* 8px * 3 = 24px */
          font-size: 15px;
          line-height: 1.6;
          color: rgba(255,255,255,0.75);
          max-width: 480px;
        }

        .product-usecases {
          width: 100%;
          margin-bottom: 24px; /* 8px * 3 = 24px */
        }

        .usecases-title {
          margin: 0 0 16px 0; /* 8px * 2 = 16px */
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .usecases-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px; /* 8px * 1 = 8px */
        }

        .usecase-item {
          display: flex;
          align-items: center;
          gap: 8px; /* 8px * 1 = 8px */
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          text-align: left;
          padding: 8px 0; /* 8px * 1 = 8px */
        }

        .usecase-dot {
          color: #ec4899;
          font-size: 8px;
          flex-shrink: 0;
        }

        .product-cta {
          padding: 12px 24px; /* 8px * 1.5 = 12px, 8px * 3 = 24px */
          border: none;
          border-radius: 12px; /* 8px * 1.5 = 12px */
          font-size: 15px;
          font-weight: 500;
          color: white;
          background: linear-gradient(92deg, #6366f1 0%, #a78bfa 60%, #ec4899 120%);
          box-shadow: 
            0 4px 16px rgba(99,102,241,0.3), /* Base shadow */
            0 8px 32px rgba(99,102,241,0.4), /* Medium shadow */
            0 0 0 1px rgba(255,255,255,0.1) inset; /* Inner highlight */
          cursor: pointer;
          transition: box-shadow 200ms ease, transform 120ms ease;
        }

        .product-cta:focus-visible {
          outline: 3px solid rgba(99, 102, 241, 0.6);
          outline-offset: 2px;
        }

        .product-cta:hover {
          box-shadow: 
            0 8px 32px rgba(99,102,241,0.5), /* Base glow */
            0 12px 48px rgba(99,102,241,0.55), /* Medium glow */
            0 0 0 1px rgba(255,255,255,0.15) inset; /* Inner highlight */
          transform: translateY(-2px);
        }

        .product-cta:active {
          transform: translateY(0);
        }

        @media (min-width: 768px) {
          .products-section { padding: 112px 32px; } /* 8px * 14 = 112px, 8px * 4 = 32px */
          .product-content { padding: 48px 32px; } /* 8px * 6 = 48px, 8px * 4 = 32px */
        }

        @media (prefers-reduced-motion: reduce) {
          .product-card, .product-cta { transition: none; }
          .product-card.visible { transform: none; }
          .product-card:hover { transform: none; }
        }
      `}</style>
    </section>
  );
}


