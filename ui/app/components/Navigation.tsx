"use client";

import { useState } from "react";
import type { MouseEvent } from "react";

interface NavigationProps {
  activeSection?: string;
  onNavClick?: (sectionId: string) => void;
}

export default function Navigation({ activeSection, onNavClick }: NavigationProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "hero", label: "Home", href: "#hero" },
    { id: "introduction", label: "Über uns", href: "#introduction" },
    { id: "services", label: "Dienstleistungen", href: "#services" },
    { id: "products", label: "Produkte", href: "#products" },
  ];


  const handleClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
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

      if (onNavClick) {
        onNavClick(targetId);
      }
    }
  };

  return (
    <>
      <nav className="navigation" aria-label="Main navigation">
        <button
          className="nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="nav-menu"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <span className="nav-toggle-icon" aria-hidden="true" />
          <span className="nav-toggle-icon" aria-hidden="true" />
          <span className="nav-toggle-icon" aria-hidden="true" />
        </button>

        <ul className={`nav-menu ${isOpen ? "open" : ""}`} id="nav-menu">
          {navItems.map((item) => (
            <li key={item.id} className="nav-item">
              <a
                href={item.href}
                className={`nav-link ${activeSection === item.id ? "active" : ""}`}
                onClick={(e) => handleClick(e, item.href)}
                aria-current={activeSection === item.id ? "page" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <style jsx>{`
        .navigation {
          position: relative;
        }

        .nav-toggle {
          display: none;
          flex-direction: column;
          gap: 4px;
          padding: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 101;
          position: relative;
        }

        .nav-toggle:focus-visible {
          outline: 3px solid rgba(236, 72, 153, 0.6);
          outline-offset: 2px;
          border-radius: 4px;
        }

        .nav-toggle-icon {
          width: 24px;
          height: 2px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 2px;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }

        .nav-toggle[aria-expanded="true"] .nav-toggle-icon:nth-child(1) {
          transform: rotate(45deg) translate(7px, 7px);
        }

        .nav-toggle[aria-expanded="true"] .nav-toggle-icon:nth-child(2) {
          opacity: 0;
          transform: translateX(-10px);
        }

        .nav-toggle[aria-expanded="true"] .nav-toggle-icon:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -7px);
        }

        .nav-menu {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 32px;
          align-items: center;
        }

        .nav-item {
          margin: 0;
        }

        .nav-link {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.01em;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          display: inline-block;
        }

        .nav-link::after {
          content: "";
          position: absolute;
          bottom: 4px;
          left: 12px;
          right: 12px;
          height: 2px;
          background: linear-gradient(90deg, #ec4899, #a78bfa);
          border-radius: 1px;
          transform: scaleX(0);
          transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: left;
        }

        .nav-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .nav-link:hover::after {
          transform: scaleX(1);
        }

        .nav-link.active {
          color: #ffffff;
          background: rgba(236, 72, 153, 0.15);
        }

        .nav-link.active::after {
          transform: scaleX(1);
        }

        .nav-link:focus-visible {
          outline: 2px solid rgba(236, 72, 153, 0.6);
          outline-offset: 2px;
          border-radius: 8px;
        }

        @media (max-width: 767px) {
          .nav-toggle {
            display: flex;
          }

          .nav-menu {
            position: fixed;
            top: 0;
            right: 0;
            width: 280px;
            height: 100vh;
            background: rgba(10, 10, 15, 0.98);
            backdrop-filter: blur(20px) saturate(180%);
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            padding: 100px 32px 32px 32px;
            gap: 8px;
            box-shadow: -8px 0 32px rgba(0, 0, 0, 0.5);
            transform: translateX(100%);
            transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 100;
            border-left: 1px solid rgba(255, 255, 255, 0.1);
          }

          .nav-menu.open {
            transform: translateX(0);
          }

          .nav-item {
            width: 100%;
          }

          .nav-link {
            display: block;
            width: 100%;
            padding: 16px 20px;
            font-size: 16px;
          }

          .nav-link::after {
            left: 20px;
            right: 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nav-link,
          .nav-toggle-icon,
          .nav-menu {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}


