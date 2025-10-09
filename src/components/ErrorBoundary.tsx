import React from 'react';

type State = { hasError: boolean; error?: Error };

class ErrorBoundary extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false } as State;
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch() {
    // You can send logs to a monitoring service here
    // console.error('Uncaught error in subtree:', error, info);
  }

  render() {
    if (this.state?.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Se ha producido un error en la aplicación</h2>
          <p>{this.state?.error?.message}</p>
        </div>
      );
    }
    return this.props.children as React.ReactNode;
  }
}

export default ErrorBoundary;
