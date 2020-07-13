import React from 'react';

export class ErrorBoundary extends React.Component<
  {},
  { error: Error | null }
> {
  state = {
    error: null,
  };
  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }
  render() {
    return this.props.children;
  }
}
