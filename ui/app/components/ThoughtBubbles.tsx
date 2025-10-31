"use client";

import { useEffect, useState, useRef } from "react";
import type { CSSProperties } from "react";

interface ThoughtBubble {
  id: number;
  text: string;
  top: string;
  left: string;
  delay: number;
}

const appIdeas: string[] = [
  "Create me a task management app...",
  "Build a fitness tracking app...",
  "Make a recipe finder app...",
  "Create a weather dashboard...",
  "Build a note-taking app...",
  "Make a habit tracker app...",
  "Create a budget planner...",
  "Build a social media scheduler...",
  "Make a language learning app...",
  "Create a music discovery app...",
  "Build a meal planning app...",
  "Make a workout planner...",
];

export default function ThoughtBubbles(): JSX.Element {
  const [bubbles, setBubbles] = useState<ThoughtBubble[]>([]);
  const [visibleBubbles, setVisibleBubbles] = useState<Set<number>>(new Set());
  const [isInView, setIsInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to pause animations when not visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Generate random bubble positions with better spacing
    const generateBubbles = (shuffled: string[]) => {
      const positions: Array<{ top: number; left: number }> = [];
      const maxAttempts = 50;

      const getValidPosition = (): { top: number; left: number } => {
        for (let i = 0; i < maxAttempts; i++) {
          const top = 10 + Math.random() * 70;
          const left = 5 + Math.random() * 85;
          const minDistance = 12; // percentage-based distance

          const isValid = positions.every((pos) => {
            const distance = Math.sqrt(
              Math.pow(top - pos.top, 2) + Math.pow(left - pos.left, 2)
            );
            return distance >= minDistance;
          });

          if (isValid) {
            return { top, left };
          }
        }
        return { top: 15 + Math.random() * 60, left: 10 + Math.random() * 80 };
      };

      return shuffled.slice(0, 6).map((idea, index) => {
        const pos = getValidPosition();
        positions.push(pos);
        return {
          id: Date.now() + index,
          text: idea,
          top: `${pos.top}%`,
          left: `${pos.left}%`,
          delay: index * 600 + Math.random() * 400,
        };
      });
    };

    // Initial bubbles
    const shuffled = [...appIdeas].sort(() => Math.random() - 0.5);
    const initialBubbles = generateBubbles(shuffled);
    setBubbles(initialBubbles);

    // Show bubbles with staggered delays
    initialBubbles.forEach((bubble) => {
      setTimeout(() => {
        setVisibleBubbles((prev) => new Set(prev).add(bubble.id));
      }, bubble.delay);
    });

    // Rotate bubbles - smooth transition (only when in view)
    const interval = setInterval(() => {
      if (!isInView) return; // Pause when not visible
      
      // Fade out current bubbles
      setVisibleBubbles(new Set());
      
      setTimeout(() => {
        if (!isInView) return; // Check again after timeout
        const newShuffled = [...appIdeas].sort(() => Math.random() - 0.5);
        const newBubbles = generateBubbles(newShuffled);
        setBubbles(newBubbles);

        // Show new bubbles with stagger
        newBubbles.forEach((bubble) => {
          setTimeout(() => {
            if (isInView) {
              setVisibleBubbles((prev) => new Set(prev).add(bubble.id));
            }
          }, bubble.delay);
        });
      }, 600);
    }, 10000);

    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <div ref={containerRef} className="thought-bubbles-container" aria-hidden="true">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={`thought-bubble ${visibleBubbles.has(bubble.id) ? "visible" : ""}`}
          style={{ 
            top: bubble.top, 
            left: bubble.left,
            // Use CSS variables to avoid recalculation
            '--bubble-top': bubble.top,
            '--bubble-left': bubble.left
          } as CSSProperties & { '--bubble-top': string; '--bubble-left': string }}
        >
          <div className="bubble-tail" />
          <div className="bubble-content">
            <span className="bubble-text">{bubble.text}</span>
          </div>
        </div>
      ))}

      <style jsx>{`
        .thought-bubbles-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 2;
          contain: layout paint;
        }

        .thought-bubble {
          position: absolute;
          opacity: 0;
          /* Use transform for positioning to avoid layout shifts */
          transform: translateY(24px) scale(0.88) translateZ(0);
          /* Only set will-change when element is visible */
          transition: opacity 800ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 800ms cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
          backface-visibility: hidden;
          perspective: 1000px;
          contain: layout style paint;
          /* Reserve space to prevent layout shifts */
          min-width: 220px;
          min-height: 60px;
        }

        .thought-bubble.visible {
          opacity: 1;
          transform: translateY(0) scale(1) translateZ(0);
          /* Only set will-change when actually visible */
          will-change: transform, opacity;
        }
        
        .thought-bubble:not(.visible) {
          will-change: auto;
        }

        .bubble-content {
          position: relative;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.98) 0%,
            rgba(255, 255, 255, 0.95) 100%);
          border-radius: 24px;
          padding: 14px 20px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.25),
            0 4px 16px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(236, 72, 153, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          min-width: 220px;
          max-width: 300px;
          backdrop-filter: blur(16px) saturate(180%);
          transform: translateZ(0);
          will-change: transform;
          overflow: hidden;
        }

        .bubble-content::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 30%, 
            rgba(236, 72, 153, 0.08), 
            transparent 60%);
          pointer-events: none;
          border-radius: 24px;
        }

        .bubble-tail {
          position: absolute;
          bottom: -14px;
          left: 36px;
          width: 0;
          height: 0;
          border-left: 14px solid transparent;
          border-right: 14px solid transparent;
          border-top: 18px solid rgba(255, 255, 255, 0.98);
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.2));
          transform: translateZ(0);
        }

        .bubble-tail::before {
          content: "";
          position: absolute;
          bottom: 1px;
          left: -12px;
          width: 0;
          height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-top: 15px solid rgba(255, 255, 255, 0.95);
          filter: blur(2px);
        }

        .bubble-text {
          display: block;
          color: #111827;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.5;
          text-align: left;
          letter-spacing: -0.01em;
          position: relative;
          z-index: 1;
        }

        /* Professional floating animation - optimized for performance */
        .thought-bubble.visible {
          animation: floatBubble 10s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .thought-bubble.visible:nth-child(1) {
          animation-delay: 0s;
          animation-duration: 9.5s;
        }
        .thought-bubble.visible:nth-child(2) {
          animation-delay: 0.6s;
          animation-duration: 10.2s;
        }
        .thought-bubble.visible:nth-child(3) {
          animation-delay: 1.2s;
          animation-duration: 9.8s;
        }
        .thought-bubble.visible:nth-child(4) {
          animation-delay: 1.8s;
          animation-duration: 10.5s;
        }
        .thought-bubble.visible:nth-child(5) {
          animation-delay: 2.4s;
          animation-duration: 9.6s;
        }
        .thought-bubble.visible:nth-child(6) {
          animation-delay: 3s;
          animation-duration: 10.1s;
        }

        @keyframes floatBubble {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1) rotateZ(0deg) translateZ(0);
          }
          20% {
            transform: translateY(-4px) translateX(1.5px) scale(1.008) rotateZ(0.3deg) translateZ(0);
          }
          40% {
            transform: translateY(-7px) translateX(0) scale(1.012) rotateZ(0deg) translateZ(0);
          }
          60% {
            transform: translateY(-4px) translateX(-1.5px) scale(1.008) rotateZ(-0.3deg) translateZ(0);
          }
          80% {
            transform: translateY(-2px) translateX(0.5px) scale(1.004) rotateZ(0.15deg) translateZ(0);
          }
        }

        /* Fade out before disappearing - smoother */
        .thought-bubble:not(.visible) {
          opacity: 0;
          transform: translateY(12px) scale(0.9) translateZ(0);
          transition: opacity 600ms cubic-bezier(0.4, 0, 0.6, 1),
            transform 600ms cubic-bezier(0.4, 0, 0.6, 1);
        }

        @media (max-width: 768px) {
          .bubble-content {
            min-width: 180px;
            max-width: 240px;
            padding: 12px 16px;
            border-radius: 16px; /* 8px * 2 = 16px (medium) */
          }

          .bubble-text {
            font-size: 13px;
          }

          .bubble-tail {
            bottom: -12px;
            left: 32px;
            border-left-width: 12px;
            border-right-width: 12px;
            border-top-width: 16px;
          }

          .thought-bubble {
            max-width: 85%;
          }
        }

        @media (max-width: 480px) {
          .bubble-content {
            min-width: 150px;
            max-width: 200px;
            padding: 10px 14px;
          }

          .bubble-text {
            font-size: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .thought-bubble,
          .thought-bubble.visible {
            animation: none;
            transition: opacity 400ms ease, transform 400ms ease;
          }
        }
      `}</style>
    </div>
  );
}


