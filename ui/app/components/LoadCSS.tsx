"use client";

import { useEffect } from 'react';

/**
 * Component to asynchronously load non-critical CSS
 * This prevents render-blocking for CSS files
 */
export default function LoadCSS() {
  useEffect(() => {
    // Function to load CSS asynchronously
    const loadCSS = (href: string) => {
      // Check if stylesheet is already loaded
      const existingLink = document.querySelector(`link[href="${href}"]`);
      if (existingLink) {
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'print'; // Load as print media first (low priority)
      link.onload = function() {
        // Change to 'all' once loaded
        (this as HTMLLinkElement).media = 'all';
      };
      // Fallback for browsers that don't support onload
      link.onerror = function() {
        // If loading fails, still try to apply as normal stylesheet
        (this as HTMLLinkElement).media = 'all';
      };
      document.head.appendChild(link);
    };

    // Load non-critical CSS files after page load
    // Use requestIdleCallback for better performance
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        loadCSS('/_next/static/css/app/layout.css');
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        loadCSS('/_next/static/css/app/layout.css');
      }, 100);
    }
  }, []);

  return null;
}


