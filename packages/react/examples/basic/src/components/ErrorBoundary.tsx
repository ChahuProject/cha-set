import React, { Component, type ReactNode } from 'react';
import { Button } from '@chahu/cha-set';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Showcase ErrorBoundary caught an error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 m-4 rounded-lg border border-destructive/40 bg-destructive/10 text-foreground flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-destructive">
              {this.props.fallbackTitle || 'Component Rendering Error'}
            </h3>
            <div className="flex items-center gap-2">
              <Button size="xs" variant="outline" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button size="xs" variant="destructive" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-mono bg-background/80 p-3 rounded border border-border/40 overflow-auto max-h-40">
            {this.state.error?.message || 'An unexpected error occurred during rendering.'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
