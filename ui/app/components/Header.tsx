"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navigation from "./Navigation";

export type HeaderProps = {
  logoUrl?: string;
};

export default function Header({ logoUrl = "/assets/images/IMG_0948_1758859719318-optimized.png" }: HeaderProps): JSX.Element {
  const [activeSection, setActiveSection] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;
    let lastScrollTop = 0;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        
        setScrollProgress(Math.min(progress, 100));
        setScrolled(scrollTop > 50);

        // Debounce section detection - only check if scroll change is significant
        if (Math.abs(scrollTop - lastScrollTop) > 10) {
          const sections = ["hero", "introduction", "services", "products"];
          let current = "";

          for (const sectionId of sections) {
            const element = document.getElementById(sectionId);
            if (element) {
              const rect = element.getBoundingClientRect();
              if (rect.top <= 150 && rect.bottom >= 150) {
                current = sectionId;
                break;
              }
            }
          }

          if (!current && scrollTop < 100) {
            current = "hero";
          }

          setActiveSection(current);
          lastScrollTop = scrollTop;
        }

        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <header className={`fixed-header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-progress" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />
      <div className="header-container">
        {logoUrl ? (
          <div className="header-logo-wrap">
            <a href="#hero" aria-label="Go to homepage" className="header-logo-link">
              <Image
                src={logoUrl}
                alt="AIDEVELO.AI Brand Logo"
                width={360}
                height={120}
                className="header-logo"
                priority
                quality={90}
              />
            </a>
          </div>
        ) : null}
        <Navigation activeSection={activeSection} onNavClick={setActiveSection} />
      </div>

      <style jsx>{`
        .fixed-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          pointer-events: none;
          padding: 20px 24px;
          background: transparent;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .fixed-header.scrolled {
          background: rgba(10, 10, 15, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
          padding: 16px 24px;
        }

        .header-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background: linear-gradient(90deg, #ec4899, #a78bfa);
          transform-origin: left;
          transition: width 100ms ease-out;
          z-index: 101;
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          pointer-events: auto;
          gap: 32px;
        }

        .header-logo-wrap {
          position: relative;
          display: inline-block;
        }

        .header-logo-link {
          display: inline-block;
          text-decoration: none;
          transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .header-logo-link:hover {
          transform: scale(1.02);
        }

        .header-logo-link:focus-visible {
          outline: 2px solid rgba(236, 72, 153, 0.6);
          outline-offset: 4px;
          border-radius: 8px;
        }

        .header-logo {
          width: clamp(180px, 22vw, 360px);
          height: auto;
          filter: drop-shadow(0 8px 24px rgba(0,0,0,0.35)) drop-shadow(0 0 22px rgba(168,85,247,0.3));
          transform: translateZ(0);
          object-fit: contain;
        }

        @media (min-width: 768px) {
          .fixed-header {
            padding: 24px 32px;
          }

          .fixed-header.scrolled {
            padding: 20px 32px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fixed-header,
          .header-logo-link,
          .header-progress {
            transition: none;
          }
        }
      `}</style>
    </header>
  );
}


