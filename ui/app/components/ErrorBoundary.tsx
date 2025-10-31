"use client";

import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console or error tracking service
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2 className="error-boundary-title">Oops! Something went wrong</h2>
            <p className="error-boundary-message">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="error-boundary-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-boundary-stack">
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <div className="error-boundary-actions">
              <button
                onClick={this.handleReset}
                className="error-boundary-button error-boundary-button-primary"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="error-boundary-button error-boundary-button-secondary"
              >
                Refresh Page
              </button>
            </div>
          </div>

          <style jsx>{`
            .error-boundary {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 400px;
              padding: 40px 24px;
              background: transparent;
            }

            .error-boundary-content {
              max-width: 600px;
              text-align: center;
              padding: 48px 32px;
              background: rgba(10, 10, 15, 0.8);
              border-radius: 24px; /* 8px * 3 = 24px (large) */
              border: 1px solid rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(16px);
            }

            .error-boundary-title {
              margin: 0 0 16px 0;
              font-size: 28px;
              font-weight: 600;
              color: #fff;
            }

            .error-boundary-message {
              margin: 0 0 24px 0;
              font-size: 16px;
              color: rgba(255, 255, 255, 0.8);
              line-height: 1.6;
            }

            .error-boundary-details {
              margin: 24px 0;
              padding: 16px;
              background: rgba(0, 0, 0, 0.3);
              border-radius: 12px; /* 8px * 1.5 = 12px (small) */ /* 8px * 1.5 = 12px (small) */
              text-align: left;
              color: rgba(255, 255, 255, 0.7);
            }

            .error-boundary-details summary {
              cursor: pointer;
              margin-bottom: 12px;
              font-weight: 600;
            }

            .error-boundary-stack {
              margin: 12px 0 0 0;
              padding: 12px;
              background: rgba(0, 0, 0, 0.4);
              border-radius: 12px; /* 8px * 1.5 = 12px (small) */ /* 8px * 1.5 = 12px (small) */
              font-size: 12px;
              font-family: monospace;
              overflow-x: auto;
              color: #fca5a5;
            }

            .error-boundary-actions {
              display: flex;
              gap: 12px;
              justify-content: center;
              margin-top: 32px;
            }

            .error-boundary-button {
              padding: 12px 24px;
              border: none;
              border-radius: 12px; /* 8px * 1.5 = 12px (small) */
              font-size: 15px;
              font-weight: 600;
              cursor: pointer;
              transition: all 200ms ease;
            }

            .error-boundary-button-primary {
              background: linear-gradient(95deg, #fb7185 0%, #ec4899 50%, #a78bfa 100%);
              color: white;
              box-shadow: 0 8px 32px rgba(236, 72, 153, 0.4);
            }

            .error-boundary-button-primary:hover {
              box-shadow: 0 12px 48px rgba(236, 72, 153, 0.6);
              transform: translateY(-2px);
            }

            .error-boundary-button-primary:focus-visible,
            .error-boundary-button-secondary:focus-visible {
              outline: 3px solid rgba(236, 72, 153, 0.6);
              outline-offset: 2px;
            }

            .error-boundary-button-secondary {
              background: rgba(255, 255, 255, 0.1);
              color: rgba(255, 255, 255, 0.9);
              border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .error-boundary-button-secondary:hover {
              background: rgba(255, 255, 255, 0.15);
            }

            @media (max-width: 768px) {
              .error-boundary-content {
                padding: 32px 24px;
              }

              .error-boundary-actions {
                flex-direction: column;
              }

              .error-boundary-button {
                width: 100%;
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
export { ErrorBoundary };


