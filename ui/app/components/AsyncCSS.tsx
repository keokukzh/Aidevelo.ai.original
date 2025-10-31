"use client";

import { useEffect } from 'react';

/**
 * AsyncCSS Component
 * Loads non-critical CSS asynchronously to prevent render-blocking
 */
export default function AsyncCSS() {
  useEffect(() => {
    // Load CSS asynchronously using the print media trick
    const loadAsyncCSS = () => {
      // Check if CSS is already loaded
      const existing = document.querySelector('link[href*="layout.css"]');
      if (existing) {
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/_next/static/css/app/layout.css';
      link.media = 'print';
      link.onload = function() {
        (this as HTMLLinkElement).media = 'all';
      };
      link.onerror = function() {
        (this as HTMLLinkElement).media = 'all';
      };
      document.head.appendChild(link);
    };

    // Use requestIdleCallback for better performance, fallback to setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        loadAsyncCSS();
      }, { timeout: 2000 });
    } else {
      // Fallback: load after a short delay
      setTimeout(() => {
        loadAsyncCSS();
      }, 100);
    }
  }, []);

  return null;
}


