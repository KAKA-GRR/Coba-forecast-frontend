import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ScrollToTop from '@/components/ScrollToTop';
import DashboardPage from '@/pages/DashboardPage';
import SettingsPage from '@/pages/SettingsPage';
import { Toaster } from '@/components/ui/toaster';

// Global Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center p-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong.</h1>
            <p className="text-gray-600 mb-4">Aplikasi mengalami kesalahan tak terduga.</p>
            <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Refresh Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Helmet titleTemplate="%s | Nickel Prediction AI" defaultTitle="Nickel Prediction AI">
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        <Toaster />
      </ErrorBoundary>
    </Router>
  );
}

export default App;