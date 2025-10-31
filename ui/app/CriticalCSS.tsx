/**
 * Critical CSS Component
 * Inlines critical CSS to prevent render-blocking
 * This component is loaded server-side to inject critical CSS into the head
 */

import { readFileSync } from 'fs';
import { join } from 'path';

let criticalCSSContent = '';

// Load critical CSS on server-side
if (typeof window === 'undefined') {
  try {
    const criticalPath = join(process.cwd(), 'app', 'critical.css');
    criticalCSSContent = readFileSync(criticalPath, 'utf-8');
  } catch (error) {
    // Fallback - critical CSS not found
    console.warn('Critical CSS file not found');
  }
}

export function CriticalCSS() {
  if (!criticalCSSContent) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: criticalCSSContent,
      }}
    />
  );
}

