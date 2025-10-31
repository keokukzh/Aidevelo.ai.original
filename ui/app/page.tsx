'use client';

import dynamic from 'next/dynamic';
import ErrorBoundary from './components/ErrorBoundary';
import IdeaHero from './components/IdeaHero';
import SolarBackground from './components/SolarBackground';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';

// Dynamic imports for non-critical sections - code splitting
const IntroductionSection = dynamic(() => import('./components/IntroductionSection'), {
  loading: () => <div className="section-skeleton" />,
});

const ServicesSection = dynamic(() => import('./components/ServicesSection'), {
  loading: () => <div className="section-skeleton" />,
});

const ProductsSection = dynamic(() => import('./components/ProductsSection'), {
  loading: () => <div className="section-skeleton" />,
});

export default function Page(): JSX.Element {
  return (
    <>
      <ErrorBoundary>
        <SolarBackground />
        <Header logoUrl="/assets/images/IMG_0948_1758859719318-optimized.png" />
        <main id="main-content" className="page-wrapper">
          <ErrorBoundary>
            <IdeaHero />
          </ErrorBoundary>
          <ErrorBoundary>
            <IntroductionSection />
          </ErrorBoundary>
          <ErrorBoundary>
            <ServicesSection />
          </ErrorBoundary>
          <ErrorBoundary>
            <ProductsSection />
          </ErrorBoundary>
          <ErrorBoundary>
            <Footer />
          </ErrorBoundary>
        </main>
        <ScrollToTop />
      </ErrorBoundary>

      <style jsx>{`
        .page-wrapper {
          position: relative;
          z-index: 1;
          background: transparent;
          min-height: 100vh;
          padding-top: 96px; /* 8px * 12 = 96px */
        }

        @media (min-width: 768px) {
          .page-wrapper {
            padding-top: 112px; /* 8px * 14 = 112px */
          }
        }

        .section-skeleton {
          min-height: 400px;
          position: relative;
          background: rgba(10, 10, 15, 0.4);
          border-radius: 24px; /* 8px * 3 = 24px */
          margin: 80px 24px; /* 8px * 10 = 80px, 8px * 3 = 24px */
          border: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
          animation: shimmer 2s ease-in-out infinite;
        }

        .section-skeleton::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.05) 50%,
            transparent 100%
          );
          transform: translateX(-100%);
          animation: shimmerSlide 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes shimmerSlide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .section-skeleton {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}


