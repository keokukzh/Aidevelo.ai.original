"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop(): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;
    let lastVisible = false;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const visible = window.scrollY > 400;
        if (visible !== lastVisible) {
          setIsVisible(visible);
          lastVisible = visible;
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <button
        className={`scroll-to-top ${isVisible ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        <span className="scroll-icon" aria-hidden="true">↑</span>
      </button>

      <style jsx>{`
        .scroll-to-top {
          position: fixed;
          bottom: 32px;
          right: 32px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #a78bfa);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 8px 24px rgba(236, 72, 153, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
          opacity: 0;
          transform: translateY(20px) scale(0.8);
          pointer-events: none;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 90;
          color: #ffffff;
          font-size: 20px;
          font-weight: 600;
          line-height: 1;
        }

        .scroll-to-top.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .scroll-to-top:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 
            0 12px 32px rgba(236, 72, 153, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.15) inset;
        }

        .scroll-to-top:active {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 
            0 8px 24px rgba(236, 72, 153, 0.45),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        }

        .scroll-to-top:focus-visible {
          outline: 3px solid rgba(236, 72, 153, 0.6);
          outline-offset: 2px;
        }

        .scroll-icon {
          display: block;
          margin-top: -2px;
        }

        @media (max-width: 767px) {
          .scroll-to-top {
            bottom: 24px;
            right: 24px;
            width: 44px;
            height: 44px;
            font-size: 18px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-to-top {
            transition: opacity 200ms ease;
          }
        }
      `}</style>
    </>
  );
}


