import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-etherblue-dark text-etherneon">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold mb-4">¡Error Crítico!</h1>
            <p className="text-xl mb-6">
              El Oráculo ha experimentado un fallo temporal. Nuestros ingenieros divinos están trabajando para restaurar la visión.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-etherneon text-etherblue-dark font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Restaurar la Visión
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm">Detalles técnicos (desarrollo)</summary>
                <pre className="mt-2 text-xs bg-black bg-opacity-50 p-4 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
