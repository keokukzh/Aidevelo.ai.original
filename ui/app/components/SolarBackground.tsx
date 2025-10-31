"use client";

import { useEffect, useRef, useState } from "react";

export default function SolarBackground(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting || entry.intersectionRatio > 0);
      },
      { threshold: 0 }
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

  return (
    <>
      <div ref={containerRef} className={`solar-bg ${isVisible ? "visible" : "paused"}`} aria-hidden="true">
        {/* Background solar system animation */}
        <div className="solar">
          <div className="orbit orbit-1"><span className="planet p1" /></div>
          <div className="orbit orbit-2"><span className="planet p2" /></div>
          <div className="orbit orbit-3"><span className="planet p3" /></div>
          <div className="orbit orbit-4"><span className="planet p4" /></div>
          <div className="orbit orbit-5"><span className="planet p5" /></div>
        </div>
        {/* Starfields - Enhanced */}
        <div className="stars s1" aria-hidden="true" />
        <div className="stars s2" aria-hidden="true" />
        <div className="stars s3" aria-hidden="true" />
        <div className="stars s4" aria-hidden="true" />
        {/* Shooting stars / Meteors */}
        <div className="shooting-star ss1" aria-hidden="true" />
        <div className="shooting-star ss2" aria-hidden="true" />
        <div className="shooting-star ss3" aria-hidden="true" />
        <div className="shooting-star ss4" aria-hidden="true" />
        {/* Supernovae flashes */}
        <div className="supernova sn1" aria-hidden="true" />
        <div className="supernova sn2" aria-hidden="true" />
        <div className="supernova sn3" aria-hidden="true" />
        {/* Random comets with varying paths - Enhanced */}
        <div className="comet c1" aria-hidden="true">
          <div className="comet-tail comet-tail-1" />
          <div className="comet-trail" />
        </div>
        <div className="comet c2" aria-hidden="true">
          <div className="comet-tail comet-tail-2" />
          <div className="comet-trail" />
        </div>
        <div className="comet c3" aria-hidden="true">
          <div className="comet-tail comet-tail-3" />
          <div className="comet-trail" />
        </div>
        <div className="comet c4" aria-hidden="true">
          <div className="comet-tail comet-tail-4" />
          <div className="comet-trail" />
        </div>
        <div className="comet c5" aria-hidden="true">
          <div className="comet-tail comet-tail-5" />
          <div className="comet-trail" />
        </div>
        <div className="comet c6" aria-hidden="true">
          <div className="comet-tail comet-tail-6" />
          <div className="comet-trail" />
        </div>
        <div className="comet c7" aria-hidden="true">
          <div className="comet-tail comet-tail-7" />
          <div className="comet-trail" />
        </div>
        {/* Space debris/particles */}
        <div className="debris d1" aria-hidden="true" />
        <div className="debris d2" aria-hidden="true" />
        <div className="debris d3" aria-hidden="true" />
        <div className="debris d4" aria-hidden="true" />
        <div className="debris d5" aria-hidden="true" />
        {/* Rotating Galaxy Spirals - Enhanced */}
        <div className="galaxy galaxy-1" aria-hidden="true">
          <div className="galaxy-arm galaxy-arm-1" />
          <div className="galaxy-arm galaxy-arm-2" />
        </div>
        <div className="galaxy galaxy-2" aria-hidden="true">
          <div className="galaxy-arm galaxy-arm-3" />
          <div className="galaxy-arm galaxy-arm-4" />
        </div>
        <div className="galaxy galaxy-3" aria-hidden="true" />
        {/* Animated Nebula Clouds */}
        <div className="nebula nebula-1" aria-hidden="true" />
        <div className="nebula nebula-2" aria-hidden="true" />
        <div className="nebula nebula-3" aria-hidden="true" />
        {/* Gas Clouds */}
        <div className="gas-cloud gc1" aria-hidden="true" />
        <div className="gas-cloud gc2" aria-hidden="true" />
        <div className="gas-cloud gc3" aria-hidden="true" />
        {/* Additional Particle Layers */}
        <div className="particle-layer pl1" aria-hidden="true" />
        <div className="particle-layer pl2" aria-hidden="true" />
        <div className="particle-layer pl3" aria-hidden="true" />
        {/* Additional small debris particles */}
        <div className="micro-debris md1" aria-hidden="true" />
        <div className="micro-debris md2" aria-hidden="true" />
        <div className="micro-debris md3" aria-hidden="true" />
        <div className="micro-debris md4" aria-hidden="true" />
        <div className="micro-debris md5" aria-hidden="true" />
        <div className="micro-debris md6" aria-hidden="true" />
        <div className="micro-debris md7" aria-hidden="true" />
        <div className="micro-debris md8" aria-hidden="true" />
      </div>

      <style jsx>{`
        :root {
          --stars-opacity: 0.22;
          --stars1-duration: 140s;
          --stars2-duration: 200s;
          --stars3-duration: 280s;
          --comet1-duration: 16s;
          --comet2-duration: 22s;
          --comet3-duration: 19s;
          --comet4-duration: 25s;
          --comet5-duration: 21s;
          --galaxy1-duration: 180s;
          --galaxy2-duration: 240s;
          --galaxy3-duration: 200s;
          --shooting-star-duration: 3s;
          --supernova-duration: 4s;
          --nebula1-duration: 120s;
          --nebula2-duration: 160s;
          --nebula3-duration: 200s;
          --gas-cloud-duration: 100s;
        }

        .solar-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          background: 
            radial-gradient(1800px 1200px at 15% 8%, rgba(99,102,241,0.02), transparent 50%),
            radial-gradient(1600px 1000px at 85% 92%, rgba(236,72,153,0.02), transparent 50%),
            radial-gradient(1400px 900px at 50% 50%, rgba(139,92,246,0.01), transparent 60%),
            linear-gradient(135deg, #000000 0%, #000000 30%, #000000 50%, #000000 70%, #000000 100%);
          contain: strict;
          animation: bgPulse 20s ease-in-out infinite;
          backface-visibility: hidden;
          perspective: 1000px;
          /* Optimize for compositing - prevent layout shifts */
          transform: translateZ(0);
          will-change: filter; /* Only animate filter, not layout properties */
        }

        .solar-bg.paused * {
          animation-play-state: paused !important;
        }

        @keyframes bgPulse {
          0%, 100% {
            filter: brightness(1) contrast(1);
          }
          50% {
            filter: brightness(1.02) contrast(1.01);
          }
        }

        /* Solar system */
        .solar {
          position: absolute;
          inset: -10% -10% -10% -10%;
          z-index: 0;
          opacity: 0.35;
          pointer-events: none;
          filter: blur(0.3px);
          contain: strict;
          transform: translateZ(0);
          animation: solarSystemFloat 60s ease-in-out infinite;
          backface-visibility: hidden;
        }

        @keyframes solarSystemFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -15px) scale(1.01);
          }
          50% {
            transform: translate(-10px, 20px) scale(0.99);
          }
          75% {
            transform: translate(15px, -10px) scale(1.01);
          }
        }
        .orbit {
          position: absolute;
          left: 50%;
          top: 50%;
          border: 1px dashed rgba(148,163,184,0.08);
          border-radius: 50%;
          transform: translate(-50%, -50%) translateZ(0);
          animation: orbitRotate linear infinite;
          contain: strict;
          transform-origin: center center;
          backface-visibility: hidden;
          box-shadow: 
            inset 0 0 20px rgba(99,102,241,0.02),
            0 0 40px rgba(236,72,153,0.015);
        }
        /* Realistic elliptical orbits with varying speeds */
        .orbit-1 { 
          width: 340px; 
          height: 320px; /* Slightly elliptical */
          animation-duration: 32s;
          animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        .orbit-2 { 
          width: 520px; 
          height: 490px; /* Elliptical */
          animation-duration: 48s;
          animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
        }
        .orbit-3 { 
          width: 720px; 
          height: 680px; /* More elliptical */
          animation-duration: 64s;
          animation-timing-function: cubic-bezier(0.15, 0, 0.45, 1);
        }
        .orbit-4 { 
          width: 980px; 
          height: 920px; /* Elliptical */
          animation-duration: 88s;
          animation-timing-function: cubic-bezier(0.1, 0, 0.5, 1);
        }
        .orbit-5 { 
          width: 1260px; 
          height: 1180px; /* Most elliptical */
          animation-duration: 116s;
          animation-timing-function: cubic-bezier(0.05, 0, 0.55, 1);
        }

        .planet {
          position: absolute;
          top: 50%;
          left: -6px; /* start at leftmost */
          transform: translateY(-50%) translateZ(0);
          width: 6px; height: 6px; border-radius: 50%;
          background: radial-gradient(closest-side, #fff, #a78bfa 60%, rgba(167,139,250,0) 70%);
          box-shadow: 
            0 0 12px rgba(167,139,250,0.6), 
            0 0 24px rgba(236,72,153,0.35),
            0 0 40px rgba(167,139,250,0.25),
            inset 0 0 8px rgba(255,255,255,0.3);
          animation: 
            planetGlow 4s ease-in-out infinite,
            planetRotate 8s linear infinite;
          transform-origin: center center;
          contain: strict;
          backface-visibility: hidden;
        }
        .p1 { 
          width: 6px; 
          height: 6px; 
          background: radial-gradient(closest-side, #fff, #60a5fa 60%, rgba(96,165,250,0) 70%);
          box-shadow: 
            0 0 14px rgba(96,165,250,0.7), 
            0 0 28px rgba(99,102,241,0.4),
            0 0 45px rgba(96,165,250,0.3),
            inset 0 0 10px rgba(255,255,255,0.35);
          animation-delay: 0s, 0s;
          animation-duration: 3.5s, 7s;
        }
        .p2 { 
          width: 8px; 
          height: 8px; 
          background: radial-gradient(closest-side, #fff, #f472b6 60%, rgba(244,114,182,0) 70%);
          box-shadow: 
            0 0 16px rgba(244,114,182,0.8), 
            0 0 32px rgba(236,72,153,0.45),
            0 0 50px rgba(244,114,182,0.3),
            inset 0 0 12px rgba(255,255,255,0.4);
          animation-delay: 0.8s, 0.5s;
          animation-duration: 4s, 9s;
        }
        .p3 { 
          width: 10px; 
          height: 10px; 
          background: radial-gradient(closest-side, #fff, #a78bfa 60%, rgba(167,139,250,0) 70%);
          box-shadow: 
            0 0 18px rgba(167,139,250,0.7), 
            0 0 36px rgba(139,92,246,0.4),
            0 0 55px rgba(167,139,250,0.3),
            inset 0 0 14px rgba(255,255,255,0.35);
          animation-delay: 1.6s, 1s;
          animation-duration: 4.5s, 10s;
        }
        .p4 { 
          width: 12px; 
          height: 12px; 
          background: radial-gradient(closest-side, #fff, #fb7185 60%, rgba(251,113,133,0) 70%);
          box-shadow: 
            0 0 20px rgba(251,113,133,0.8), 
            0 0 40px rgba(236,72,153,0.5),
            0 0 60px rgba(251,113,133,0.35),
            inset 0 0 16px rgba(255,255,255,0.4);
          animation-delay: 2.4s, 1.5s;
          animation-duration: 5s, 11s;
        }
        .p5 { 
          width: 7px; 
          height: 7px; 
          background: radial-gradient(closest-side, #fff, #34d399 60%, rgba(52,211,153,0) 70%);
          box-shadow: 
            0 0 15px rgba(52,211,153,0.7), 
            0 0 30px rgba(34,197,94,0.4),
            0 0 48px rgba(52,211,153,0.3),
            inset 0 0 11px rgba(255,255,255,0.35);
          animation-delay: 3.2s, 2s;
          animation-duration: 3.8s, 8.5s;
        }

        @keyframes planetGlow {
          0%, 100% { 
            opacity: 1; 
            filter: brightness(1) drop-shadow(0 0 8px currentColor);
            transform: translateY(-50%) scale(1);
          }
          50% { 
            opacity: 0.9; 
            filter: brightness(1.3) drop-shadow(0 0 16px currentColor);
            transform: translateY(-50%) scale(1.15);
          }
        }

        @keyframes planetRotate {
          0% { transform: translateY(-50%) rotate(0deg); }
          100% { transform: translateY(-50%) rotate(360deg); }
        }

        @keyframes orbitRotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* Starfields (3 parallax layers) - Optimized */
        .stars { 
          position: absolute; 
          inset: -20% -20% -20% -20%; 
          z-index: 0; 
          pointer-events: none; 
          opacity: var(--stars-opacity); 
          contain: strict;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        .s1 {
          background-image:
            radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.5) 50%, transparent 51%),
            radial-gradient(2px 2px at 120px 80px, rgba(167,139,250,0.55) 50%, transparent 51%),
            radial-gradient(1.5px 1.5px at 260px 140px, rgba(255,255,255,0.48) 50%, transparent 51%),
            radial-gradient(1.5px 1.5px at 340px 40px, rgba(236,72,153,0.48) 50%, transparent 51%),
            radial-gradient(1px 1px at 180px 200px, rgba(255,255,255,0.4) 50%, transparent 51%),
            radial-gradient(1px 1px at 320px 280px, rgba(139,92,246,0.42) 50%, transparent 51%);
          background-repeat: repeat;
          background-size: 400px 400px;
          animation: drift1 var(--stars1-duration) linear infinite, twinkle 10s ease-in-out infinite alternate;
        }
        .s2 {
          opacity: calc(var(--stars-opacity) - 0.15);
          background-image:
            radial-gradient(2px 2px at 60px 120px, rgba(255,255,255,0.48) 50%, transparent 51%),
            radial-gradient(1.5px 1.5px at 180px 200px, rgba(99,102,241,0.48) 50%, transparent 51%),
            radial-gradient(1.5px 1.5px at 300px 40px, rgba(255,255,255,0.48) 50%, transparent 51%),
            radial-gradient(1px 1px at 420px 160px, rgba(236,72,153,0.42) 50%, transparent 51%),
            radial-gradient(1px 1px at 500px 320px, rgba(139,92,246,0.38) 50%, transparent 51%);
          background-repeat: repeat;
          background-size: 600px 600px;
          animation: drift2 var(--stars2-duration) linear infinite, twinkle 12s ease-in-out infinite alternate;
        }
        .s3 {
          opacity: calc(var(--stars-opacity) - 0.2);
          background-image:
            radial-gradient(1.5px 1.5px at 40px 60px, rgba(255,255,255,0.42) 50%, transparent 51%),
            radial-gradient(1.5px 1.5px at 220px 100px, rgba(168,85,247,0.42) 50%, transparent 51%),
            radial-gradient(1px 1px at 340px 200px, rgba(255,255,255,0.42) 50%, transparent 51%),
            radial-gradient(1px 1px at 500px 350px, rgba(99,102,241,0.38) 50%, transparent 51%),
            radial-gradient(1px 1px at 680px 150px, rgba(236,72,153,0.35) 50%, transparent 51%),
            radial-gradient(1px 1px at 800px 450px, rgba(139,92,246,0.35) 50%, transparent 51%);
          background-repeat: repeat;
          background-size: 900px 900px;
          animation: drift3 var(--stars3-duration) linear infinite, twinkle 14s ease-in-out infinite alternate;
        }
        .s4 {
          opacity: calc(var(--stars-opacity) - 0.18);
          background-image:
            radial-gradient(1px 1px at 60px 140px, rgba(255,255,255,0.4) 50%, transparent 51%),
            radial-gradient(1px 1px at 180px 280px, rgba(167,139,250,0.38) 50%, transparent 51%),
            radial-gradient(1px 1px at 320px 120px, rgba(236,72,153,0.36) 50%, transparent 51%),
            radial-gradient(1px 1px at 480px 340px, rgba(99,102,241,0.34) 50%, transparent 51%),
            radial-gradient(1px 1px at 640px 200px, rgba(139,92,246,0.32) 50%, transparent 51%),
            radial-gradient(1px 1px at 780px 380px, rgba(236,72,153,0.3) 50%, transparent 51%);
          background-repeat: repeat;
          background-size: 1000px 1000px;
          animation: drift4 320s linear infinite, twinkle 16s ease-in-out infinite alternate;
        }

        /* Shooting Stars / Meteors */
        .shooting-star {
          position: absolute;
          width: 200px;
          height: 2px;
          background: linear-gradient(90deg,
            rgba(255,255,255,0.95) 0%,
            rgba(255,255,255,0.8) 30%,
            rgba(167,139,250,0.6) 60%,
            transparent 100%);
          border-radius: 2px;
          filter: drop-shadow(0 0 8px rgba(255,255,255,0.8))
                  drop-shadow(0 0 16px rgba(167,139,250,0.6));
          pointer-events: none;
          z-index: 0;
          opacity: 0;
          contain: strict;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        .ss1 {
          top: 15%;
          left: -150px;
          transform: rotate(-35deg);
          animation: shootingStar1 var(--shooting-star-duration) ease-out infinite;
          animation-delay: 2s;
        }

        .ss2 {
          top: 45%;
          left: -180px;
          transform: rotate(-28deg);
          animation: shootingStar2 calc(var(--shooting-star-duration) + 1s) ease-out infinite;
          animation-delay: 8s;
        }

        .ss3 {
          top: 75%;
          left: -160px;
          transform: rotate(-32deg);
          animation: shootingStar3 calc(var(--shooting-star-duration) - 0.5s) ease-out infinite;
          animation-delay: 15s;
        }

        .ss4 {
          top: 30%;
          left: -200px;
          transform: rotate(-40deg);
          animation: shootingStar4 calc(var(--shooting-star-duration) + 0.5s) ease-out infinite;
          animation-delay: 22s;
        }

        @keyframes shootingStar1 {
          0% {
            transform: translateX(0) translateY(0) rotate(-35deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateX(400%) translateY(150%) rotate(-35deg);
            opacity: 0;
          }
        }

        @keyframes shootingStar2 {
          0% {
            transform: translateX(0) translateY(0) rotate(-28deg);
            opacity: 0;
          }
          4% {
            opacity: 1;
          }
          96% {
            opacity: 1;
          }
          100% {
            transform: translateX(420%) translateY(-120%) rotate(-28deg);
            opacity: 0;
          }
        }

        @keyframes shootingStar3 {
          0% {
            transform: translateX(0) translateY(0) rotate(-32deg);
            opacity: 0;
          }
          6% {
            opacity: 1;
          }
          94% {
            opacity: 1;
          }
          100% {
            transform: translateX(380%) translateY(140%) rotate(-32deg);
            opacity: 0;
          }
        }

        @keyframes shootingStar4 {
          0% {
            transform: translateX(0) translateY(0) rotate(-40deg);
            opacity: 0;
          }
          3% {
            opacity: 1;
          }
          97% {
            opacity: 1;
          }
          100% {
            transform: translateX(450%) translateY(-180%) rotate(-40deg);
            opacity: 0;
          }
        }

        /* Supernovae Flashes */
        .supernova {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle at center,
            rgba(255,255,255,0.4) 0%,
            rgba(236,72,153,0.3) 20%,
            rgba(139,92,246,0.2) 35%,
            rgba(99,102,241,0.15) 50%,
            transparent 70%);
          filter: blur(20px);
          pointer-events: none;
          z-index: 0;
          opacity: 0;
          contain: strict;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        .sn1 {
          top: 25%;
          left: 30%;
          animation: supernovaFlash1 var(--supernova-duration) ease-out infinite;
          animation-delay: 5s;
        }

        .sn2 {
          top: 60%;
          right: 25%;
          animation: supernovaFlash2 calc(var(--supernova-duration) + 1s) ease-out infinite;
          animation-delay: 18s;
        }

        .sn3 {
          top: 40%;
          left: 65%;
          animation: supernovaFlash3 calc(var(--supernova-duration) - 0.5s) ease-out infinite;
          animation-delay: 32s;
        }

        @keyframes supernovaFlash1 {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
            filter: blur(20px) brightness(1);
          }
          10% {
            transform: scale(1) rotate(45deg);
            opacity: 0.8;
            filter: blur(25px) brightness(2);
          }
          30% {
            transform: scale(1.5) rotate(90deg);
            opacity: 0.6;
            filter: blur(30px) brightness(1.5);
          }
          60% {
            transform: scale(2) rotate(180deg);
            opacity: 0.3;
            filter: blur(40px) brightness(1);
          }
          100% {
            transform: scale(2.5) rotate(360deg);
            opacity: 0;
            filter: blur(50px) brightness(0.5);
          }
        }

        @keyframes supernovaFlash2 {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
            filter: blur(20px) brightness(1);
          }
          8% {
            transform: scale(1.2) rotate(60deg);
            opacity: 0.75;
            filter: blur(28px) brightness(2.2);
          }
          35% {
            transform: scale(1.8) rotate(120deg);
            opacity: 0.5;
            filter: blur(35px) brightness(1.6);
          }
          70% {
            transform: scale(2.2) rotate(240deg);
            opacity: 0.25;
            filter: blur(45px) brightness(1);
          }
          100% {
            transform: scale(2.8) rotate(360deg);
            opacity: 0;
            filter: blur(55px) brightness(0.4);
          }
        }

        @keyframes supernovaFlash3 {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
            filter: blur(20px) brightness(1);
          }
          12% {
            transform: scale(1.1) rotate(30deg);
            opacity: 0.85;
            filter: blur(26px) brightness(2.5);
          }
          40% {
            transform: scale(1.6) rotate(150deg);
            opacity: 0.55;
            filter: blur(32px) brightness(1.8);
          }
          65% {
            transform: scale(2) rotate(270deg);
            opacity: 0.28;
            filter: blur(42px) brightness(1.2);
          }
          100% {
            transform: scale(2.6) rotate(360deg);
            opacity: 0;
            filter: blur(52px) brightness(0.6);
          }
        }

        /* Realistic Comets with enhanced trails - Dramatically Improved */
        .comet {
          position: absolute;
          width: 500px; 
          height: 5px;
          border-radius: 5px;
          background: linear-gradient(90deg, 
            rgba(255,255,255,1) 0%,
            rgba(255,255,255,0.98) 5%,
            rgba(255,255,255,0.92) 10%,
            rgba(255,255,255,0.85) 18%,
            rgba(167,139,250,0.78) 32%,
            rgba(236,72,153,0.65) 48%,
            rgba(139,92,246,0.5) 62%,
            rgba(255,255,255,0.3) 75%,
            rgba(255,255,255,0.15) 85%,
            rgba(255,255,255,0) 100%);
          filter: 
            drop-shadow(0 0 16px rgba(255,255,255,1)) 
            drop-shadow(0 0 24px rgba(167,139,250,0.75))
            drop-shadow(0 0 32px rgba(236,72,153,0.55))
            drop-shadow(0 0 40px rgba(139,92,246,0.35))
            drop-shadow(0 0 48px rgba(99,102,241,0.2));
          pointer-events: none; 
          z-index: 0;
          opacity: 0;
          transform-origin: left center;
          contain: strict;
          backface-visibility: hidden;
          transform: translateZ(0);
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .comet::before {
          content: "";
          position: absolute;
          left: -10px;
          top: 50%;
          transform: translateY(-50%);
          width: 10px;
          height: 10px;
          background: radial-gradient(circle, 
            rgba(255,255,255,1) 0%,
            rgba(255,255,255,0.9) 30%,
            rgba(255,255,255,0.75) 50%,
            transparent 75%);
          border-radius: 50%;
          box-shadow: 
            0 0 20px rgba(255,255,255,1),
            0 0 40px rgba(167,139,250,0.9),
            0 0 60px rgba(236,72,153,0.75),
            0 0 80px rgba(139,92,246,0.5);
          animation: cometCore 1.8s ease-in-out infinite;
        }

        .comet-trail {
          position: absolute;
          left: -120px;
          top: 50%;
          transform: translateY(-50%);
          width: 480px;
          height: 3px;
          background: linear-gradient(90deg,
            rgba(255,255,255,0.3) 0%,
            rgba(167,139,250,0.2) 30%,
            rgba(236,72,153,0.15) 60%,
            transparent 100%);
          border-radius: 3px;
          filter: blur(8px);
          animation: trailPulse 2s ease-in-out infinite;
        }

        .comet-tail {
          position: absolute;
          left: -100px;
          top: 50%;
          transform: translateY(-50%);
          width: 100px;
          height: 100px;
          background: radial-gradient(ellipse 70px 100px at center, 
            rgba(255,255,255,0.6) 0%,
            rgba(167,139,250,0.4) 20%,
            rgba(236,72,153,0.3) 35%,
            rgba(139,92,246,0.2) 50%,
            rgba(99,102,241,0.15) 65%,
            transparent 85%);
          border-radius: 50%;
          filter: blur(16px);
          animation: tailPulse 1.5s ease-in-out infinite;
        }

        .comet-tail-1 { animation-delay: 0s; }
        .comet-tail-2 { animation-delay: 0.3s; }
        .comet-tail-3 { animation-delay: 0.6s; }
        .comet-tail-4 { animation-delay: 0.9s; }
        .comet-tail-5 { animation-delay: 1.2s; }
        .comet-tail-6 { animation-delay: 0.45s; }
        .comet-tail-7 { animation-delay: 1.05s; }

        @keyframes cometCore {
          0%, 100% {
            opacity: 1;
            transform: translateY(-50%) scale(1);
            filter: brightness(1);
          }
          33% {
            opacity: 0.95;
            transform: translateY(-50%) scale(1.25);
            filter: brightness(1.3);
          }
          66% {
            opacity: 0.92;
            transform: translateY(-50%) scale(1.15);
            filter: brightness(1.15);
          }
        }

        @keyframes tailPulse {
          0%, 100% {
            opacity: 0.65;
            transform: translateY(-50%) scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.95;
            transform: translateY(-50%) scale(1.2) rotate(5deg);
          }
        }

        @keyframes trailPulse {
          0%, 100% {
            opacity: 0.5;
            transform: translateY(-50%) scaleX(1);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-50%) scaleX(1.1);
          }
        }

        /* Varied comet paths and timings - Enhanced */
        .c1 { 
          top: 8%; 
          left: -25%; 
          transform: rotate(-25deg) translateZ(0); 
          animation: cometFly1 var(--comet1-duration) cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: 1.5s;
        }
        .c2 { 
          top: 65%; 
          left: -30%; 
          transform: rotate(-15deg) translateZ(0); 
          animation: cometFly2 var(--comet2-duration) cubic-bezier(0.3, 0, 0.7, 1) infinite;
          animation-delay: 6s;
        }
        .c3 { 
          top: 35%; 
          left: -28%; 
          transform: rotate(-30deg) translateZ(0); 
          animation: cometFly3 var(--comet3-duration) cubic-bezier(0.5, 0, 0.5, 1) infinite;
          animation-delay: 3s;
        }
        .c4 { 
          top: 80%; 
          left: -20%; 
          transform: rotate(-10deg) translateZ(0); 
          animation: cometFly4 var(--comet4-duration) cubic-bezier(0.25, 0, 0.75, 1) infinite;
          animation-delay: 10s;
        }
        .c5 { 
          top: 20%; 
          left: -35%; 
          transform: rotate(-20deg) translateZ(0); 
          animation: cometFly5 var(--comet5-duration) cubic-bezier(0.35, 0, 0.65, 1) infinite;
          animation-delay: 4.5s;
        }
        .c6 { 
          top: 50%; 
          left: -32%; 
          transform: rotate(-18deg) translateZ(0); 
          animation: cometFly6 20s cubic-bezier(0.28, 0, 0.72, 1) infinite;
          animation-delay: 8s;
        }
        .c7 { 
          top: 72%; 
          left: -38%; 
          transform: rotate(-22deg) translateZ(0); 
          animation: cometFly7 18s cubic-bezier(0.32, 0, 0.68, 1) infinite;
          animation-delay: 13s;
        }

        /* Space debris - small particles - Optimized */
        .debris {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255,255,255,0.6);
          border-radius: 50%;
          box-shadow: 0 0 4px rgba(255,255,255,0.8);
          pointer-events: none;
          z-index: 0;
          opacity: 0;
          contain: strict;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        .d1 {
          top: 15%;
          left: 20%;
          animation: debrisFloat1 25s ease-in-out infinite;
          animation-delay: 0s;
        }
        .d2 {
          top: 45%;
          left: 75%;
          animation: debrisFloat2 30s ease-in-out infinite;
          animation-delay: 5s;
        }
        .d3 {
          top: 70%;
          left: 30%;
          animation: debrisFloat3 28s ease-in-out infinite;
          animation-delay: 8s;
        }
        .d4 {
          top: 25%;
          left: 60%;
          animation: debrisFloat4 32s ease-in-out infinite;
          animation-delay: 12s;
        }
        .d5 {
          top: 85%;
          left: 50%;
          animation: debrisFloat5 27s ease-in-out infinite;
          animation-delay: 3s;
        }

        /* Starfield drift */
        @keyframes drift1 { 0% { background-position: 0 0; } 100% { background-position: 400px 400px; } }
        @keyframes drift2 { 0% { background-position: 0 0; } 100% { background-position: 600px 300px; } }
        @keyframes drift3 { 0% { background-position: 0 0; } 100% { background-position: 900px 450px; } }
        @keyframes twinkle { 0% { opacity: 0.25; } 50% { opacity: 0.5; } 100% { opacity: 0.28; } }

        /* Enhanced realistic comet flight paths with curves */
        @keyframes cometFly1 {
          0% { 
            transform: translateX(0) translateY(0) rotate(-25deg) scale(0.7); 
            opacity: 0;
            filter: brightness(1);
          }
          3% { 
            opacity: 0.8;
            filter: brightness(1.2);
          }
          8% { 
            opacity: 1;
            filter: brightness(1.5);
          }
          45% { 
            transform: translateX(135%) translateY(32%) rotate(-25deg) scale(1.05); 
            opacity: 1;
            filter: brightness(1.3);
          }
          50% { 
            transform: translateX(140%) translateY(35%) rotate(-25deg) scale(1); 
            opacity: 0.98;
            filter: brightness(1.2);
          }
          90% { 
            opacity: 0.75;
            filter: brightness(0.9);
          }
          100% { 
            transform: translateX(210%) translateY(52%) rotate(-25deg) scale(0.6); 
            opacity: 0;
            filter: brightness(0.7);
          }
        }
        @keyframes cometFly2 {
          0% { 
            transform: translateX(0) translateY(0) rotate(-15deg) scale(0.75); 
            opacity: 0;
            filter: brightness(1);
          }
          2% { 
            opacity: 0.75;
            filter: brightness(1.15);
          }
          6% { 
            opacity: 1;
            filter: brightness(1.4);
          }
          48% { 
            transform: translateX(145%) translateY(-22%) rotate(-15deg) scale(1.08); 
            opacity: 1;
            filter: brightness(1.25);
          }
          55% { 
            transform: translateX(150%) translateY(-25%) rotate(-15deg) scale(1); 
            opacity: 0.96;
            filter: brightness(1.15);
          }
          92% { 
            opacity: 0.7;
            filter: brightness(0.85);
          }
          100% { 
            transform: translateX(230%) translateY(-38%) rotate(-15deg) scale(0.55); 
            opacity: 0;
            filter: brightness(0.65);
          }
        }
        @keyframes cometFly3 {
          0% { 
            transform: translateX(0) translateY(0) rotate(-30deg) scale(0.72); 
            opacity: 0;
            filter: brightness(1);
          }
          4% { 
            opacity: 0.85;
            filter: brightness(1.25);
          }
          8% { 
            opacity: 1;
            filter: brightness(1.45);
          }
          42% { 
            transform: translateX(125%) translateY(25%) rotate(-30deg) scale(1.1); 
            opacity: 1;
            filter: brightness(1.3);
          }
          48% { 
            transform: translateX(130%) translateY(28%) rotate(-30deg) scale(1); 
            opacity: 0.97;
            filter: brightness(1.2);
          }
          92% { 
            opacity: 0.7;
            filter: brightness(0.88);
          }
          100% { 
            transform: translateX(200%) translateY(48%) rotate(-30deg) scale(0.62); 
            opacity: 0;
            filter: brightness(0.68);
          }
        }
        @keyframes cometFly4 {
          0% { 
            transform: translateX(0) translateY(0) rotate(-10deg) scale(0.8); 
            opacity: 0;
            filter: brightness(1);
          }
          2% { 
            opacity: 0.7;
            filter: brightness(1.1);
          }
          5% { 
            opacity: 1;
            filter: brightness(1.35);
          }
          46% { 
            transform: translateX(155%) translateY(-15%) rotate(-10deg) scale(1.12); 
            opacity: 1;
            filter: brightness(1.28);
          }
          52% { 
            transform: translateX(160%) translateY(-18%) rotate(-10deg) scale(1); 
            opacity: 0.94;
            filter: brightness(1.18);
          }
          94% { 
            opacity: 0.65;
            filter: brightness(0.82);
          }
          100% { 
            transform: translateX(220%) translateY(-32%) rotate(-10deg) scale(0.58); 
            opacity: 0;
            filter: brightness(0.6);
          }
        }
        @keyframes cometFly5 {
          0% { 
            transform: translateX(0) translateY(0) rotate(-20deg) scale(0.74); 
            opacity: 0;
            filter: brightness(1);
          }
          3% { 
            opacity: 0.8;
            filter: brightness(1.18);
          }
          7% { 
            opacity: 1;
            filter: brightness(1.42);
          }
          44% { 
            transform: translateX(140%) translateY(30%) rotate(-20deg) scale(1.06); 
            opacity: 1;
            filter: brightness(1.32);
          }
          50% { 
            transform: translateX(145%) translateY(32%) rotate(-20deg) scale(1); 
            opacity: 0.99;
            filter: brightness(1.22);
          }
          93% { 
            opacity: 0.72;
            filter: brightness(0.87);
          }
          100% { 
            transform: translateX(205%) translateY(50%) rotate(-20deg) scale(0.61); 
            opacity: 0;
            filter: brightness(0.66);
          }
        }
        @keyframes cometFly6 {
          0% { 
            transform: translateX(0) translateY(0) rotate(-18deg) scale(0.73); 
            opacity: 0;
            filter: brightness(1);
          }
          3% { 
            opacity: 0.75;
            filter: brightness(1.2);
          }
          7% { 
            opacity: 1;
            filter: brightness(1.45);
          }
          45% { 
            transform: translateX(138%) translateY(28%) rotate(-18deg) scale(1.08); 
            opacity: 1;
            filter: brightness(1.35);
          }
          50% { 
            transform: translateX(142%) translateY(30%) rotate(-18deg) scale(1); 
            opacity: 0.98;
            filter: brightness(1.25);
          }
          93% { 
            opacity: 0.71;
            filter: brightness(0.86);
          }
          100% { 
            transform: translateX(208%) translateY(48%) rotate(-18deg) scale(0.6); 
            opacity: 0;
            filter: brightness(0.64);
          }
        }
        @keyframes cometFly7 {
          0% { 
            transform: translateX(0) translateY(0) rotate(-22deg) scale(0.71); 
            opacity: 0;
            filter: brightness(1);
          }
          4% { 
            opacity: 0.82;
            filter: brightness(1.22);
          }
          8% { 
            opacity: 1;
            filter: brightness(1.48);
          }
          43% { 
            transform: translateX(137%) translateY(27%) rotate(-22deg) scale(1.09); 
            opacity: 1;
            filter: brightness(1.38);
          }
          51% { 
            transform: translateX(143%) translateY(31%) rotate(-22deg) scale(1); 
            opacity: 0.97;
            filter: brightness(1.26);
          }
          92% { 
            opacity: 0.73;
            filter: brightness(0.84);
          }
          100% { 
            transform: translateX(212%) translateY(51%) rotate(-22deg) scale(0.59); 
            opacity: 0;
            filter: brightness(0.62);
          }
        }

        /* Debris floating animations */
        @keyframes debrisFloat1 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% { 
            transform: translate(15px, -20px) scale(1.2);
            opacity: 0.7;
          }
          50% { 
            transform: translate(30px, -10px) scale(1);
            opacity: 0.5;
          }
          75% { 
            transform: translate(20px, -25px) scale(1.1);
            opacity: 0.6;
          }
        }
        @keyframes debrisFloat2 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.25;
          }
          30% { 
            transform: translate(-18px, 15px) scale(1.15);
            opacity: 0.65;
          }
          60% { 
            transform: translate(-25px, 20px) scale(1);
            opacity: 0.45;
          }
          90% { 
            transform: translate(-15px, 12px) scale(1.1);
            opacity: 0.55;
          }
        }
        @keyframes debrisFloat3 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.35;
          }
          20% { 
            transform: translate(12px, 18px) scale(1.2);
            opacity: 0.75;
          }
          50% { 
            transform: translate(25px, 15px) scale(1);
            opacity: 0.5;
          }
          80% { 
            transform: translate(18px, 22px) scale(1.1);
            opacity: 0.6;
          }
        }
        @keyframes debrisFloat4 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.28;
          }
          35% { 
            transform: translate(-20px, -15px) scale(1.18);
            opacity: 0.68;
          }
          55% { 
            transform: translate(-28px, -12px) scale(1);
            opacity: 0.48;
          }
          85% { 
            transform: translate(-22px, -18px) scale(1.08);
            opacity: 0.58;
          }
        }
        @keyframes debrisFloat5 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.32;
          }
          25% { 
            transform: translate(22px, 12px) scale(1.22);
            opacity: 0.72;
          }
          50% { 
            transform: translate(30px, 18px) scale(1);
            opacity: 0.52;
          }
          75% { 
            transform: translate(25px, 15px) scale(1.12);
            opacity: 0.62;
          }
        }

        /* Rotating Galaxy Spirals with enhanced effects - Dramatically Improved */
        .galaxy {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          opacity: 0.08;
          filter: blur(3px);
          transform-origin: center center;
          contain: strict;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        .galaxy-arm {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          pointer-events: none;
          transform-origin: center center;
          contain: strict;
          backface-visibility: hidden;
        }

        .galaxy-arm-1 {
          background: conic-gradient(from 45deg at 50% 50%,
            transparent 0deg,
            rgba(236,72,153,0.12) 40deg,
            rgba(139,92,246,0.15) 80deg,
            rgba(99,102,241,0.12) 120deg,
            transparent 160deg);
          animation: armRotate1 90s linear infinite;
          filter: blur(2px);
        }

        .galaxy-arm-2 {
          background: conic-gradient(from 225deg at 50% 50%,
            transparent 0deg,
            rgba(139,92,246,0.1) 50deg,
            rgba(236,72,153,0.13) 100deg,
            transparent 150deg);
          animation: armRotate2 110s linear infinite reverse;
          filter: blur(2px);
        }

        .galaxy-arm-3 {
          background: conic-gradient(from 135deg at 50% 50%,
            transparent 0deg,
            rgba(99,102,241,0.11) 45deg,
            rgba(236,72,153,0.14) 90deg,
            transparent 135deg);
          animation: armRotate3 95s linear infinite;
          filter: blur(2px);
        }

        .galaxy-arm-4 {
          background: conic-gradient(from 315deg at 50% 50%,
            transparent 0deg,
            rgba(236,72,153,0.09) 55deg,
            rgba(139,92,246,0.12) 110deg,
            transparent 165deg);
          animation: armRotate4 105s linear infinite reverse;
          filter: blur(2px);
        }

        @keyframes armRotate1 {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes armRotate2 {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(-360deg) scale(1); }
        }

        @keyframes armRotate3 {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes armRotate4 {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(-360deg) scale(1); }
        }

        .galaxy-1 {
          width: 2000px;
          height: 2000px;
          top: -300px;
          left: -500px;
          background: 
            conic-gradient(from 0deg at 50% 50%,
              transparent 0deg,
              rgba(99,102,241,0.1) 45deg,
              rgba(236,72,153,0.12) 90deg,
              rgba(139,92,246,0.11) 135deg,
              rgba(99,102,241,0.09) 180deg,
              rgba(236,72,153,0.1) 225deg,
              rgba(139,92,246,0.08) 270deg,
              rgba(99,102,241,0.07) 315deg,
              transparent 360deg);
          animation: 
            galaxyRotate1 var(--galaxy1-duration) linear infinite,
            galaxyPulse1 15s ease-in-out infinite;
          mask: 
            radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.3) 38%, black 42%, black 62%, rgba(0,0,0,0.3) 68%, transparent 75%);
          -webkit-mask: 
            radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.3) 38%, black 42%, black 62%, rgba(0,0,0,0.3) 68%, transparent 75%);
        }

        .galaxy-1::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle at center, 
            rgba(236,72,153,0.15) 0%,
            rgba(139,92,246,0.1) 15%,
            transparent 30%);
          animation: galaxyCore1 8s ease-in-out infinite;
        }

        .galaxy-2 {
          width: 2400px;
          height: 2400px;
          bottom: -400px;
          right: -600px;
          background: 
            conic-gradient(from 180deg at 50% 50%,
              transparent 0deg,
              rgba(236,72,153,0.08) 40deg,
              rgba(139,92,246,0.1) 80deg,
              rgba(99,102,241,0.09) 120deg,
              rgba(236,72,153,0.08) 160deg,
              rgba(139,92,246,0.07) 200deg,
              rgba(99,102,241,0.06) 240deg,
              rgba(236,72,153,0.05) 280deg,
              rgba(139,92,246,0.04) 320deg,
              transparent 360deg);
          animation: 
            galaxyRotate2 var(--galaxy2-duration) linear infinite reverse,
            galaxyPulse2 18s ease-in-out infinite;
          mask: 
            radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.2) 42%, black 48%, black 68%, rgba(0,0,0,0.2) 75%, transparent 82%);
          -webkit-mask: 
            radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.2) 42%, black 48%, black 68%, rgba(0,0,0,0.2) 75%, transparent 82%);
        }

        .galaxy-2::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle at center, 
            rgba(139,92,246,0.14) 0%,
            rgba(99,102,241,0.09) 18%,
            transparent 35%);
          animation: galaxyCore2 10s ease-in-out infinite;
        }

        .galaxy-3 {
          width: 1800px;
          height: 1800px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: 
            conic-gradient(from 90deg at 50% 50%,
              transparent 0deg,
              rgba(236,72,153,0.07) 35deg,
              rgba(139,92,246,0.09) 70deg,
              rgba(99,102,241,0.08) 105deg,
              rgba(236,72,153,0.07) 140deg,
              rgba(139,92,246,0.06) 175deg,
              rgba(99,102,241,0.05) 210deg,
              rgba(236,72,153,0.04) 245deg,
              rgba(139,92,246,0.03) 280deg,
              transparent 360deg);
          animation: 
            galaxyRotate3 var(--galaxy3-duration) linear infinite,
            galaxyPulse3 20s ease-in-out infinite;
          mask: 
            radial-gradient(circle at center, transparent 32%, rgba(0,0,0,0.25) 40%, black 44%, black 58%, rgba(0,0,0,0.25) 66%, transparent 72%);
          -webkit-mask: 
            radial-gradient(circle at center, transparent 32%, rgba(0,0,0,0.25) 40%, black 44%, black 58%, rgba(0,0,0,0.25) 66%, transparent 72%);
        }

        .galaxy-3::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle at center, 
            rgba(236,72,153,0.12) 0%,
            rgba(139,92,246,0.08) 16%,
            transparent 32%);
          animation: galaxyCore3 9s ease-in-out infinite;
        }

        @keyframes galaxyRotate3 {
          0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
          100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); }
        }

        @keyframes galaxyPulse3 {
          0%, 100% {
            opacity: 0.06;
            filter: blur(3px) brightness(1);
          }
          50% {
            opacity: 0.1;
            filter: blur(2px) brightness(1.12);
          }
        }

        @keyframes galaxyCore3 {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.12);
          }
        }

        @keyframes galaxyRotate1 {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes galaxyRotate2 {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(-360deg) scale(1); }
        }

        @keyframes galaxyPulse1 {
          0%, 100% {
            opacity: 0.08;
            filter: blur(3px) brightness(1);
          }
          50% {
            opacity: 0.12;
            filter: blur(2px) brightness(1.1);
          }
        }

        @keyframes galaxyPulse2 {
          0%, 100% {
            opacity: 0.07;
            filter: blur(3px) brightness(1);
          }
          50% {
            opacity: 0.11;
            filter: blur(2.5px) brightness(1.1);
          }
        }

        @keyframes galaxyCore1 {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.1);
          }
        }

        @keyframes galaxyCore2 {
          0%, 100% {
            opacity: 0.55;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.15);
          }
        }

        /* Animated Nebula Clouds - Optimized */
        .nebula {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          filter: blur(40px);
          mix-blend-mode: screen;
          contain: strict;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        .nebula-1 {
          width: 1200px;
          height: 800px;
          top: 10%;
          left: -200px;
          background: radial-gradient(ellipse at 30% 40%,
            rgba(236,72,153,0.12) 0%,
            rgba(139,92,246,0.1) 30%,
            rgba(99,102,241,0.08) 50%,
            transparent 70%);
          animation: nebulaFloat1 var(--nebula1-duration) ease-in-out infinite;
        }

        .nebula-2 {
          width: 1400px;
          height: 1000px;
          bottom: 15%;
          right: -300px;
          background: radial-gradient(ellipse at 70% 60%,
            rgba(99,102,241,0.11) 0%,
            rgba(139,92,246,0.09) 35%,
            rgba(236,72,153,0.07) 55%,
            transparent 75%);
          animation: nebulaFloat2 var(--nebula2-duration) ease-in-out infinite;
        }

        .nebula-3 {
          width: 1000px;
          height: 1200px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(ellipse at 50% 50%,
            rgba(139,92,246,0.1) 0%,
            rgba(99,102,241,0.08) 40%,
            rgba(236,72,153,0.06) 60%,
            transparent 80%);
          animation: nebulaFloat3 var(--nebula3-duration) ease-in-out infinite;
        }

        @keyframes nebulaFloat1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          33% {
            transform: translate(80px, -60px) scale(1.1);
            opacity: 0.5;
          }
          66% {
            transform: translate(-40px, 40px) scale(0.95);
            opacity: 0.45;
          }
        }

        @keyframes nebulaFloat2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.35;
          }
          40% {
            transform: translate(-100px, 80px) scale(1.15);
            opacity: 0.45;
          }
          70% {
            transform: translate(60px, -50px) scale(0.9);
            opacity: 0.4;
          }
        }

        @keyframes nebulaFloat3 {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2) rotate(5deg);
            opacity: 0.4;
          }
        }

        /* Gas Clouds - Optimized */
        .gas-cloud {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          filter: blur(60px);
          mix-blend-mode: color-dodge;
          contain: strict;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        .gc1 {
          width: 800px;
          height: 600px;
          top: 25%;
          left: 15%;
          background: radial-gradient(circle at 40% 50%,
            rgba(167,139,250,0.15) 0%,
            rgba(236,72,153,0.1) 40%,
            transparent 70%);
          animation: gasCloud1 var(--gas-cloud-duration) ease-in-out infinite;
        }

        .gc2 {
          width: 900px;
          height: 700px;
          bottom: 30%;
          right: 20%;
          background: radial-gradient(circle at 60% 40%,
            rgba(99,102,241,0.14) 0%,
            rgba(139,92,246,0.09) 45%,
            transparent 75%);
          animation: gasCloud2 calc(var(--gas-cloud-duration) + 20s) ease-in-out infinite;
        }

        .gc3 {
          width: 700px;
          height: 500px;
          top: 60%;
          left: 70%;
          background: radial-gradient(circle at 50% 50%,
            rgba(236,72,153,0.12) 0%,
            rgba(167,139,250,0.08) 50%,
            transparent 80%);
          animation: gasCloud3 calc(var(--gas-cloud-duration) - 10s) ease-in-out infinite;
        }

        @keyframes gasCloud1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.25;
          }
          25% {
            transform: translate(100px, -80px) scale(1.2);
            opacity: 0.35;
          }
          50% {
            transform: translate(-60px, 100px) scale(0.9);
            opacity: 0.3;
          }
          75% {
            transform: translate(80px, -40px) scale(1.1);
            opacity: 0.32;
          }
        }

        @keyframes gasCloud2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.22;
          }
          30% {
            transform: translate(-120px, 90px) scale(1.25);
            opacity: 0.32;
          }
          60% {
            transform: translate(70px, -70px) scale(0.85);
            opacity: 0.28;
          }
        }

        @keyframes gasCloud3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.24;
          }
          35% {
            transform: translate(90px, 120px) scale(1.3);
            opacity: 0.34;
          }
          65% {
            transform: translate(-80px, -90px) scale(0.88);
            opacity: 0.28;
          }
        }

        /* Additional Particle Layers - Optimized */
        .particle-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.25;
          contain: strict;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        .pl1 {
          background-image:
            radial-gradient(1px 1px at 50px 100px, rgba(255,255,255,0.5) 50%, transparent 51%),
            radial-gradient(1px 1px at 200px 300px, rgba(167,139,250,0.45) 50%, transparent 51%),
            radial-gradient(1px 1px at 400px 150px, rgba(236,72,153,0.45) 50%, transparent 51%),
            radial-gradient(1px 1px at 600px 400px, rgba(255,255,255,0.4) 50%, transparent 51%),
            radial-gradient(1px 1px at 800px 200px, rgba(99,102,241,0.45) 50%, transparent 51%);
          background-repeat: repeat;
          background-size: 1000px 800px;
          animation: particleDrift1 80s linear infinite;
        }

        .pl2 {
          background-image:
            radial-gradient(1.5px 1.5px at 150px 250px, rgba(255,255,255,0.4) 50%, transparent 51%),
            radial-gradient(1px 1px at 350px 500px, rgba(139,92,246,0.4) 50%, transparent 51%),
            radial-gradient(1px 1px at 550px 300px, rgba(236,72,153,0.4) 50%, transparent 51%),
            radial-gradient(1.5px 1.5px at 750px 100px, rgba(255,255,255,0.35) 50%, transparent 51%);
          background-repeat: repeat;
          background-size: 1200px 900px;
          animation: particleDrift2 100s linear infinite reverse;
        }

        .pl3 {
          background-image:
            radial-gradient(1px 1px at 80px 180px, rgba(255,255,255,0.3) 50%, transparent 51%),
            radial-gradient(1px 1px at 250px 380px, rgba(167,139,250,0.3) 50%, transparent 51%),
            radial-gradient(1px 1px at 450px 220px, rgba(236,72,153,0.3) 50%, transparent 51%),
            radial-gradient(1px 1px at 650px 480px, rgba(99,102,241,0.28) 50%, transparent 51%),
            radial-gradient(1px 1px at 850px 120px, rgba(139,92,246,0.28) 50%, transparent 51%);
          background-repeat: repeat;
          background-size: 1100px 850px;
          animation: particleDrift3 90s linear infinite;
          opacity: 0.22;
        }

        /* Micro debris - tiny particles */
        .micro-debris {
          position: absolute;
          width: 1px;
          height: 1px;
          background: rgba(255,255,255,0.5);
          border-radius: 50%;
          box-shadow: 0 0 2px rgba(255,255,255,0.7);
          pointer-events: none;
          z-index: 0;
          opacity: 0;
          contain: strict;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        .md1 {
          top: 12%;
          left: 25%;
          animation: microFloat1 35s ease-in-out infinite;
          animation-delay: 0s;
        }
        .md2 {
          top: 38%;
          left: 65%;
          animation: microFloat2 42s ease-in-out infinite;
          animation-delay: 4s;
        }
        .md3 {
          top: 62%;
          left: 22%;
          animation: microFloat3 38s ease-in-out infinite;
          animation-delay: 8s;
        }
        .md4 {
          top: 28%;
          left: 78%;
          animation: microFloat4 40s ease-in-out infinite;
          animation-delay: 12s;
        }
        .md5 {
          top: 75%;
          left: 45%;
          animation: microFloat5 36s ease-in-out infinite;
          animation-delay: 6s;
        }
        .md6 {
          top: 45%;
          left: 15%;
          animation: microFloat6 44s ease-in-out infinite;
          animation-delay: 10s;
        }
        .md7 {
          top: 18%;
          left: 52%;
          animation: microFloat7 39s ease-in-out infinite;
          animation-delay: 14s;
        }
        .md8 {
          top: 82%;
          left: 68%;
          animation: microFloat8 41s ease-in-out infinite;
          animation-delay: 3s;
        }

        @keyframes particleDrift1 {
          0% { background-position: 0 0; }
          100% { background-position: 1000px 800px; }
        }

        @keyframes particleDrift2 {
          0% { background-position: 0 0; }
          100% { background-position: -1200px -900px; }
        }

        @keyframes particleDrift3 {
          0% { background-position: 0 0; }
          100% { background-position: 1100px 850px; }
        }

        @keyframes drift4 {
          0% { background-position: 0 0; }
          100% { background-position: -1000px -1000px; }
        }

        /* Micro debris animations */
        @keyframes microFloat1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          33% {
            transform: translate(25px, -30px) scale(1.3);
            opacity: 0.6;
          }
          66% {
            transform: translate(40px, -15px) scale(1);
            opacity: 0.4;
          }
        }

        @keyframes microFloat2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.28;
          }
          40% {
            transform: translate(-30px, 22px) scale(1.4);
            opacity: 0.58;
          }
          70% {
            transform: translate(-40px, 30px) scale(1);
            opacity: 0.38;
          }
        }

        @keyframes microFloat3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.32;
          }
          35% {
            transform: translate(20px, 28px) scale(1.35);
            opacity: 0.62;
          }
          65% {
            transform: translate(35px, 20px) scale(1);
            opacity: 0.42;
          }
        }

        @keyframes microFloat4 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.26;
          }
          30% {
            transform: translate(-25px, -20px) scale(1.38);
            opacity: 0.56;
          }
          60% {
            transform: translate(-35px, -25px) scale(1);
            opacity: 0.36;
          }
        }

        @keyframes microFloat5 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.31;
          }
          38% {
            transform: translate(28px, 25px) scale(1.32);
            opacity: 0.61;
          }
          68% {
            transform: translate(38px, 18px) scale(1);
            opacity: 0.41;
          }
        }

        @keyframes microFloat6 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.29;
          }
          42% {
            transform: translate(-22px, 32px) scale(1.36);
            opacity: 0.59;
          }
          72% {
            transform: translate(-32px, 25px) scale(1);
            opacity: 0.39;
          }
        }

        @keyframes microFloat7 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.33;
          }
          36% {
            transform: translate(32px, -22px) scale(1.34);
            opacity: 0.63;
          }
          66% {
            transform: translate(42px, -18px) scale(1);
            opacity: 0.43;
          }
        }

        @keyframes microFloat8 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.27;
          }
          44% {
            transform: translate(-28px, 30px) scale(1.37);
            opacity: 0.57;
          }
          74% {
            transform: translate(-38px, 22px) scale(1);
            opacity: 0.37;
          }
        }

        /* Optimized will-change - only when animating */
        .solar-bg.visible .orbit,
        .solar-bg.visible .planet,
        .solar-bg.visible .stars,
        .solar-bg.visible .comet,
        .solar-bg.visible .galaxy,
        .solar-bg.visible .galaxy-arm,
        .solar-bg.visible .nebula,
        .solar-bg.visible .gas-cloud,
        .solar-bg.visible .particle-layer,
        .solar-bg.visible .debris,
        .solar-bg.visible .micro-debris,
        .solar-bg.visible .shooting-star,
        .solar-bg.visible .supernova {
          will-change: transform, opacity, background-position, filter;
        }

        .solar-bg.paused .orbit,
        .solar-bg.paused .planet,
        .solar-bg.paused .stars,
        .solar-bg.paused .comet,
        .solar-bg.paused .galaxy,
        .solar-bg.paused .galaxy-arm,
        .solar-bg.paused .nebula,
        .solar-bg.paused .gas-cloud,
        .solar-bg.paused .particle-layer,
        .solar-bg.paused .debris,
        .solar-bg.paused .micro-debris,
        .solar-bg.paused .shooting-star,
        .solar-bg.paused .supernova {
          will-change: auto;
        }

        /* Motion accessibility */
        @media (prefers-reduced-motion: reduce) {
          .orbit, .stars, .comet, .debris, .planet, .galaxy, .nebula, .gas-cloud, .particle-layer, .micro-debris, .shooting-star, .supernova, .solar-bg { 
            animation: none !important; 
          }
        }
      `}</style>
    </>
  );
}


