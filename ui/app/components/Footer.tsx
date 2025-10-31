"use client";

import Image from "next/image";
import type { MouseEvent } from "react";

export default function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "#hero" },
    { label: "Über uns", href: "#introduction" },
    { label: "Dienstleistungen", href: "#services" },
    { label: "Produkte", href: "#products" },
  ];

  const legalLinks = [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
    { label: "AGB", href: "/agb" },
  ];

  const socialLinks = [
    { label: "LinkedIn", href: "https://linkedin.com", icon: "💼" },
    { label: "Twitter", href: "https://twitter.com", icon: "🐦" },
    { label: "GitHub", href: "https://github.com", icon: "💻" },
  ];

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);
      
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo-wrap">
              <a 
                href="#hero" 
                aria-label="Go to homepage" 
                className="footer-logo-link"
                onClick={(e) => handleClick(e, "#hero")}
              >
                <Image
                  src="/assets/images/footerlogo.png"
                  alt="AIDEVELO.AI Footer Logo"
                  width={280}
                  height={100}
                  className="footer-logo"
                  quality={90}
                />
              </a>
            </div>
            <p className="footer-description">
              Intelligente Lösungen für Ihre digitalen Anforderungen.
              KI-gestützte Automatisierung und moderne Webentwicklung.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href)}
                    className="footer-link"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Rechtliches</h4>
            <ul className="footer-links">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="footer-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Social Media</h4>
            <div className="footer-social">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="footer-social-link"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="footer-social-icon" aria-hidden="true">
                    {social.icon}
                  </span>
                  <span className="footer-social-label">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} AIDEVELO.AI. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          position: relative;
          z-index: 1;
          background: rgba(10, 10, 15, 0.6);
          backdrop-filter: blur(20px) saturate(180%);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 64px 24px 32px 24px;
          margin-top: 96px;
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }

        .footer-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-logo-wrap {
          position: relative;
          display: inline-block;
          margin-bottom: 16px;
        }

        .footer-logo-link {
          display: inline-block;
          text-decoration: none;
          transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .footer-logo-link:hover {
          transform: scale(1.02);
        }

        .footer-logo-link:focus-visible {
          outline: 2px solid rgba(236, 72, 153, 0.6);
          outline-offset: 4px;
          border-radius: 8px;
        }

        .footer-logo {
          width: clamp(180px, 20vw, 280px);
          height: auto;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3)) drop-shadow(0 0 16px rgba(168,85,247,0.25));
          transform: translateZ(0);
          object-fit: contain;
        }

        .footer-heading {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        .footer-description {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          max-width: 320px;
        }

        .footer-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.75);
          text-decoration: none;
          font-size: 14px;
          transition: all 200ms ease;
          display: inline-block;
          position: relative;
          padding-left: 0;
        }

        .footer-link::before {
          content: "→";
          position: absolute;
          left: -16px;
          opacity: 0;
          transition: all 200ms ease;
          color: #ec4899;
        }

        .footer-link:hover {
          color: #ffffff;
          padding-left: 16px;
        }

        .footer-link:hover::before {
          opacity: 1;
          left: -12px;
        }

        .footer-link:focus-visible {
          outline: 2px solid rgba(236, 72, 153, 0.6);
          outline-offset: 2px;
          border-radius: 4px;
        }

        .footer-social {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-social-link {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 0.75);
          text-decoration: none;
          font-size: 14px;
          transition: all 200ms ease;
          padding: 8px 12px;
          border-radius: 8px;
          width: fit-content;
        }

        .footer-social-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(4px);
        }

        .footer-social-link:focus-visible {
          outline: 2px solid rgba(236, 72, 153, 0.6);
          outline-offset: 2px;
          border-radius: 8px;
        }

        .footer-social-icon {
          font-size: 18px;
          line-height: 1;
        }

        .footer-social-label {
          font-weight: 500;
        }

        .footer-bottom {
          padding-top: 32px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          text-align: center;
        }

        .footer-copyright {
          margin: 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }

        @media (min-width: 768px) {
          .footer {
            padding: 80px 32px 40px 32px;
          }

          .footer-content {
            grid-template-columns: repeat(2, 1fr);
            gap: 48px;
          }
        }

        @media (min-width: 1024px) {
          .footer-content {
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: 48px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .footer-link,
          .footer-social-link {
            transition: none;
          }
        }
      `}</style>
    </footer>
  );
}


