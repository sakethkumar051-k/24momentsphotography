'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <h2 className="font-display text-2xl text-foreground mb-2">Something went wrong</h2>
              <p className="text-muted text-sm mb-4">Please try refreshing the page</p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="px-4 py-2 text-sm border border-gold text-gold rounded-[3px] hover:bg-gold hover:text-background transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
