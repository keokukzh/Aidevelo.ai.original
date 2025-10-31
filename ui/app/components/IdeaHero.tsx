"use client";

import { useState } from "react";
import type { ChangeEvent, KeyboardEvent, FormEvent } from "react";
import dynamic from "next/dynamic";

const ThoughtBubbles = dynamic(() => import("./ThoughtBubbles"), {
  ssr: false,
});

export type IdeaHeroProps = {
  videoUrl?: string;
};

export default function IdeaHero({
  videoUrl,
}: IdeaHeroProps): JSX.Element {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const maxLength = 500;

  const validateInput = (value: string): boolean => {
    const trimmed = value.trim();
    return trimmed.length >= 10 && trimmed.length <= maxLength;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdea(value);
    setError(null);
    setSuccess(false);
    
    if (value.length === 0) {
      setIsValid(null);
    } else {
      setIsValid(validateInput(value));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIdea("");
      setError(null);
      setIsValid(null);
      setSuccess(false);
      e.currentTarget.blur();
    }
  };

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    setError(null);
    setSuccess(false);
    
    if (!idea.trim()) {
      setError("Bitte geben Sie Ihre App-Idee ein.");
      setIsValid(false);
      return;
    }
    
    if (!validateInput(idea)) {
      if (idea.trim().length < 10) {
        setError("Bitte geben Sie mindestens 10 Zeichen ein.");
      } else {
        setError(`Bitte maximal ${maxLength} Zeichen eingeben.`);
      }
      setIsValid(false);
      return;
    }
    
    setLoading(true);
    setIsValid(true);
    
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { checkoutUrl, projectId } = await res.json();
      
      setSuccess(true);
      
      // Delay redirect to show success state
      setTimeout(() => {
        if (checkoutUrl) {
          window.location.href = checkoutUrl as string;
        } else if (projectId) {
          window.location.href = `/projects/${projectId}`;
        } else {
          setError("Unerwartete Antwort. Bitte versuchen Sie es erneut.");
          setSuccess(false);
        }
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError(err?.message || "Fehler beim Absenden der Idee");
      setIsValid(false);
      setSuccess(false);
      setLoading(false);
    }
  }

  return (
    <div className="hero-root" id="hero">
      <ThoughtBubbles />
      <div className="hero-content">
        {/* Card */}
        <div className="hero-card">
        {videoUrl ? (
          <video className="hero-video" autoPlay muted loop playsInline src={videoUrl} />
        ) : null}
        <div className="hero-overlay" />

        <header className="hero-header">
          <div className="tagline">No Code, Endless Possibilities</div>
          </header>

        <main className="hero-main">
          <h1 className="hero-title">Build Your App Idea</h1>
          <form onSubmit={handleSubmit} className="form" aria-label="App idea submission form">
            <label htmlFor="app-idea-input" className="visually-hidden">
              Enter your app concept
            </label>
            <div className="input-wrapper">
              <input
                id="app-idea-input"
                value={idea}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Geben Sie hier Ihre App-Idee ein..."
                className={`input ${isValid === true ? "valid" : isValid === false ? "invalid" : ""} ${loading ? "loading" : ""} ${success ? "success" : ""}`}
                aria-label="App-Idee Eingabe"
                aria-describedby={error ? "error-message" : idea.length > 0 ? "char-count" : undefined}
                {...(isValid === false && { 'aria-invalid': true })}
                aria-required
                maxLength={maxLength}
                disabled={loading}
              />
              {idea.length > 0 && (
                <div className="input-feedback">
                  <span id="char-count" className="char-count" aria-live="polite">
                    {idea.length} / {maxLength}
                  </span>
                  {isValid === true && !loading && (
                    <span className="validation-icon valid-icon" aria-hidden="true">
                      ✓
                    </span>
                  )}
                  {isValid === false && (
                    <span className="validation-icon invalid-icon" aria-hidden="true">
                      ✕
                    </span>
                  )}
                </div>
              )}
            </div>
            <button 
              type="submit" 
              disabled={loading || !validateInput(idea)} 
              className={`cta ${success ? "success" : ""} ${loading ? "loading" : ""}`}
              aria-label={loading ? "Idee wird gesendet..." : success ? "Erfolgreich gesendet!" : "Projekt starten"}
              {...(loading && { 'aria-busy': true })}
            >
              {loading ? (
                <>
                  <span className="cta-loading" aria-hidden="true" />
                  <span>Wird gesendet...</span>
                </>
              ) : success ? (
                <>
                  <span className="cta-success-icon" aria-hidden="true">✓</span>
                  <span>Erfolgreich gesendet!</span>
                </>
              ) : (
                "Projekt starten"
              )}
            </button>
          </form>
          {error ? (
            <div 
              id="error-message"
              className="error" 
              role="alert"
              aria-live="assertive"
            >
              <span className="error-icon" aria-hidden="true">⚠</span>
              <span>{error}</span>
            </div>
          ) : null}
          {success && !error && (
            <div 
              className="success-message" 
              role="status"
              aria-live="polite"
            >
              <span className="success-icon" aria-hidden="true">✓</span>
              <span>Ihre Idee wurde erfolgreich übermittelt! Sie werden weitergeleitet...</span>
            </div>
          )}
        </main>

        <footer className="hero-footer">
          <p className="subcopy">Drag & Drop. Customize. Deploy.</p>
          <div className="pills">
            <span className="pill">Fast Setup</span>
            <span className="pill">Secure</span>
            <span className="pill">1-Click Deploy</span>
          </div>
        </footer>
        </div>
      </div>

      <style jsx>{`
        :root {
        }

        .hero-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: transparent;
          position: relative;
          overflow: hidden;
          contain: layout paint;
        }


        .hero-content {
          width: 100%;
          max-width: 980px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          position: relative;
          z-index: 1;
        }


        .hero-card {
          position: relative;
          width: 100%;
          max-width: 920px;
          /* Reserve minimum height to prevent layout shift */
          min-height: 500px;
          border-radius: 24px; /* 8px * 3 = 24px (large) */
          border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(135deg, 
            rgba(15,15,20,0.75) 0%,
            rgba(10,10,18,0.85) 100%);
          backdrop-filter: blur(20px) saturate(180%);
          box-shadow: 
            0 8px 24px rgba(0,0,0,0.4), /* Base shadow */
            0 16px 48px rgba(0,0,0,0.6), /* Medium shadow */
            0 32px 96px rgba(0,0,0,0.8), /* Deep shadow */
            0 0 0 1px rgba(236,72,153,0.15), /* Pink glow border */
            0 0 0 2px rgba(139,92,246,0.08), /* Purple outer glow */
            inset 0 1px 0 rgba(255,255,255,0.08), /* Inner highlight */
            inset 0 -1px 0 rgba(0,0,0,0.1); /* Inner bottom shadow */
          overflow: hidden;
          animation: cardIn 800ms cubic-bezier(0.16, 1, 0.3, 1) both;
          transform: translateZ(0);
          /* Only set will-change during animation */
          contain: layout style paint;
        }
        
        .hero-card[style*="animation"] {
          will-change: transform, opacity;
        }
        
        /* Remove will-change after animation completes */
        .hero-card:not([style*="animation"]) {
          will-change: auto;
        }

        .hero-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 25%, 
            rgba(236,72,153,0.12) 0%,
            transparent 50%),
            radial-gradient(circle at 70% 75%, 
            rgba(139,92,246,0.12) 0%,
            transparent 50%);
          pointer-events: none;
          opacity: 0.6;
        }

        .hero-card::after {
          content: "";
          position: absolute;
          inset: -3px;
          border-radius: 24px;
          background: linear-gradient(135deg, 
            rgba(236,72,153,0.25), 
            rgba(139,92,246,0.25),
            rgba(236,72,153,0.2));
          opacity: 0;
          transition: opacity 500ms cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          z-index: -1;
          filter: blur(16px);
        }

        .hero-card:hover::after {
          opacity: 0.5;
        }

        /* Subtle parallax on scroll */
        @media (prefers-reduced-motion: no-preference) {
          .hero-card {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
        }

        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.28;
        }

        .hero-overlay {
          pointer-events: none;
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(800px 800px at 25% 20%, rgba(236,72,153,0.1), transparent 45%),
            radial-gradient(800px 800px at 75% 80%, rgba(139,92,246,0.1), transparent 45%);
          opacity: 0.8;
        }

        .hero-header {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 24px 32px 0 32px; /* 8px * 3 = 24px, 8px * 4 = 32px */
        }

        .tagline {
          color: rgba(255,255,255,0.75);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          animation: fadeUp 700ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both;
        }

        .hero-main {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px; /* 8px * 3 = 24px */
          padding: 40px 32px 32px 32px; /* 8px * 5 = 40px, 8px * 4 = 32px */
        }

        .hero-title {
          margin: 0;
          text-align: center;
          background: linear-gradient(135deg, 
            #ffffff 0%, 
            rgba(255,255,255,0.98) 40%,
            rgba(236,72,153,0.9) 60%,
            rgba(139,92,246,0.95) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: #ffffff; /* Fallback */
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.1;
          text-shadow: 
            0 4px 16px rgba(0,0,0,0.4),
            0 0 40px rgba(236,72,153,0.3),
            0 0 80px rgba(139,92,246,0.2);
          animation: fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }

        .form {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px; /* 8px * 2 = 16px */
          margin-top: 0;
          animation: fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 300ms both;
        }

        .input {
          width: 100%;
          max-width: 680px;
          padding: 16px 20px; /* 8px * 2 = 16px, 8px * 2.5 = 20px (acceptable) */
          border-radius: 16px; /* 8px * 2 = 16px */
          border: 2px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.98);
          color: #111827;
          font-size: 15px;
          font-weight: 500;
          box-shadow: 
            0 8px 24px rgba(0,0,0,0.08), /* 8px * 1 = 8px, 8px * 3 = 24px */
            0 0 0 1px rgba(0,0,0,0.03) inset;
          outline: none;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateZ(0);
        }

        .input::placeholder { 
          color: #6b7280;
          font-weight: 400;
        }
        
        .input:focus { 
          border-color: rgba(236,72,153,0.5); 
          box-shadow: 
            0 0 0 4px rgba(236,72,153,0.15), /* 8px * 0.5 = 4px */
            0 8px 32px rgba(236,72,153,0.2), /* 8px * 1 = 8px, 8px * 4 = 32px */
            0 0 0 1px rgba(236,72,153,0.3) inset;
          transform: translateY(-2px) scale(1.01) translateZ(0); /* 8px * 0.25 = 2px */
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input:hover:not(:focus):not(:disabled) {
          border-color: rgba(255,255,255,0.25);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1); /* 8px * 1 = 8px, 8px * 3 = 24px */
        }

        .input-wrapper {
          position: relative;
          width: 100%;
          max-width: 680px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          /* Reserve space for feedback elements */
          min-height: 60px;
        }

        .input-feedback {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }

        .char-count {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
        }

        .validation-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          font-size: 12px;
          font-weight: 700;
          line-height: 1;
        }

        .valid-icon {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .invalid-icon {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .input.valid {
          border-color: rgba(34, 197, 94, 0.5);
          box-shadow: 
            0 0 0 4px rgba(34, 197, 94, 0.1),
            0 8px 32px rgba(34, 197, 94, 0.15);
        }

        .input.valid:focus {
          border-color: rgba(34, 197, 94, 0.7);
          box-shadow: 
            0 0 0 4px rgba(34, 197, 94, 0.2),
            0 8px 32px rgba(34, 197, 94, 0.25);
        }

        .input.invalid {
          border-color: rgba(239, 68, 68, 0.5);
          box-shadow: 
            0 0 0 4px rgba(239, 68, 68, 0.1),
            0 8px 32px rgba(239, 68, 68, 0.15);
        }

        .input.invalid:focus {
          border-color: rgba(239, 68, 68, 0.7);
          box-shadow: 
            0 0 0 4px rgba(239, 68, 68, 0.2),
            0 8px 32px rgba(239, 68, 68, 0.25);
        }

        .input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: rgba(255, 255, 255, 0.85);
        }

        .cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px; /* 8px * 1 = 8px */
          padding: 16px 32px; /* 8px * 2 = 16px, 8px * 4 = 32px */
          min-width: 224px; /* 8px * 28 = 224px */
          border: none;
          border-radius: 16px; /* 8px * 2 = 16px */
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.01em;
          background: linear-gradient(95deg, 
            #fb7185 0%, 
            #ec4899 50%, 
            #a78bfa 100%);
          background-size: 200% 100%;
          box-shadow: 
            0 16px 48px rgba(236,72,153,0.5), /* 8px * 2 = 16px, 8px * 6 = 48px */
            0 0 0 1px rgba(255,255,255,0.1) inset,
            0 2px 4px rgba(0,0,0,0.2) inset;
          cursor: pointer;
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateZ(0);
          will-change: transform, box-shadow, background-position;
          position: relative;
          overflow: hidden;
        }

        .cta::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(95deg, 
            transparent 0%,
            rgba(255,255,255,0.2) 40%,
            rgba(255,255,255,0.25) 50%,
            rgba(255,255,255,0.2) 60%,
            transparent 100%);
          transform: translateX(-100%) skewX(-12deg);
          transition: transform 800ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cta:hover { 
          box-shadow: 
            0 16px 64px rgba(236,72,153,0.65), /* 8px * 2 = 16px, 8px * 8 = 64px */
            0 0 0 1px rgba(255,255,255,0.15) inset;
          transform: translateY(-2px) scale(1.02) translateZ(0); /* 8px * 0.25 = 2px */
          background-position: 100% 0;
        }

        .cta:hover::before {
          transform: translateX(150%) skewX(-12deg);
        }

        /* Pulse animation for loading state */
        .cta:disabled {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.65;
          }
          50% {
            opacity: 0.75;
          }
        }

        .cta:active { 
          transform: translateY(0) translateZ(0); 
          box-shadow: 
            0 8px 32px rgba(236,72,153,0.45), /* 8px * 1 = 8px, 8px * 4 = 32px */
            0 0 0 1px rgba(255,255,255,0.1) inset;
        }

        .cta:disabled { 
          opacity: 0.65; 
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 8px 32px rgba(236,72,153,0.3); /* 8px * 1 = 8px, 8px * 4 = 32px */
        }

        .cta.loading {
          cursor: wait;
        }

        .cta.success {
          background: linear-gradient(95deg, #22c55e 0%, #16a34a 50%, #15803d 100%);
          box-shadow: 
            0 16px 48px rgba(34, 197, 94, 0.5),
            0 0 0 1px rgba(255,255,255,0.1) inset;
        }

        .cta.success:hover {
          box-shadow: 
            0 16px 64px rgba(34, 197, 94, 0.6),
            0 0 0 1px rgba(255,255,255,0.15) inset;
        }

        .cta-loading {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .cta-success-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          animation: successPop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes successPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .error { 
          display: flex;
          align-items: center;
          gap: 12px;
          color: #fca5a5; 
          font-size: 14px;
          font-weight: 500;
          padding: 12px 16px; /* 8px * 1.5 = 12px, 8px * 2 = 16px */
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 12px; /* 8px * 1.5 = 12px */
          animation: fadeUp 400ms ease both;
          width: 100%;
          max-width: 680px;
        }

        .error-icon {
          font-size: 18px;
          line-height: 1;
          flex-shrink: 0;
        }

        .success-message {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #86efac;
          font-size: 14px;
          font-weight: 500;
          padding: 12px 16px;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 12px;
          animation: fadeUp 400ms ease both;
          width: 100%;
          max-width: 680px;
        }

        .success-icon {
          font-size: 18px;
          line-height: 1;
          flex-shrink: 0;
          animation: successPop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .hero-footer {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 0 32px 0; /* 8px * 4 = 32px */
          gap: 16px; /* 8px * 2 = 16px */
          animation: fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 400ms both;
        }

        .subcopy { 
          color: rgba(255,255,255,0.8); 
          font-size: 14px;
          font-weight: 500;
          margin: 0;
          letter-spacing: 0.01em;
        }

        .pills { 
          display: flex; 
          gap: 12px; /* 8px * 1.5 = 12px */
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .pill {
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(8px);
          padding: 8px 16px; /* 8px * 1 = 8px, 8px * 2 = 16px */
          border-radius: 9999px;
          color: rgba(255,255,255,0.85);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.02em;
          transition: all 200ms ease;
          transform: translateZ(0);
        }

        .pill:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.25);
          transform: translateY(-1px) translateZ(0);
        }

        @media (min-width: 768px) {
          .hero-header { padding: 32px 40px 0 40px; } /* 8px * 4 = 32px, 8px * 5 = 40px */
          .hero-main { padding: 56px 40px 40px 40px; } /* 8px * 7 = 56px, 8px * 5 = 40px */
          .hero-footer { padding: 0 0 32px 0; } /* 8px * 4 = 32px */
        }

        @media (min-width: 1024px) {
          .hero-card {
            max-width: 960px;
          }
          
          .hero-title {
            font-size: clamp(40px, 4.5vw, 56px);
          }
        }


        /* Higher contrast preference */
        @media (prefers-contrast: more) {
          .tagline { color: rgba(255,255,255,0.85); }
          .hero-card { border-color: rgba(255,255,255,0.12); Box-shadow: 0 26px 96px rgba(2,6,23,0.65); }
          .input { border-color: rgba(0,0,0,0.08); }
        }

        /* Backdrop filter fallback */
        @supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
          .hero-card { background: rgba(17,25,40,0.72); }
        }

        /* Animations */
        @keyframes cardIn {
          0% { 
            opacity: 0; 
            transform: translateY(16px) scale(0.96) translateZ(0);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1) translateZ(0);
          }
        }
        
        @keyframes fadeUp {
          0% { 
            opacity: 0; 
            transform: translateY(12px) translateZ(0);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) translateZ(0);
          }
        }

        /* Motion accessibility */
        /* Visually hidden label for screen readers */
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        /* Enhanced focus indicators for accessibility */
        .input:focus-visible,
        .cta:focus-visible {
          outline: 3px solid rgba(236, 72, 153, 0.6);
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-card, .hero-title, .form, .hero-footer, .orbit, .stars, .comet { animation: none !important; }
        }
      `}</style>
    </div>
  );
}



