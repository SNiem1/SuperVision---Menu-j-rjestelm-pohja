import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  private handleClearDataAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#faf8f2] text-[#1e1e1a] flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#c5a85c]/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif font-bold text-2xl text-[#2e4c9b]">
                Jokin meni vikaan
              </h1>
              <p className="font-serif text-sm text-gray-500 italic">
                Something went wrong
              </p>
              <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed pt-2">
                Sovelluksessa tapahtui odottamaton virhe. Voit yrittää ladata sivun uudelleen tai tyhjentää paikalliset tiedot.
              </p>
            </div>

            <div className="pt-2 flex flex-col space-y-2.5">
              <button
                onClick={this.handleReload}
                className="w-full py-3 px-4 bg-[#2e4c9b] hover:bg-[#233b7b] text-white font-bold rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Päivitä sivu / Reload</span>
              </button>

              <button
                onClick={this.handleClearDataAndReload}
                className="w-full py-2.5 px-4 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 font-medium rounded-xl transition-colors text-xs flex items-center justify-center space-x-2 border border-gray-200 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Tyhjennä tiedot ja lataa / Clear data & reload</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
