import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NativeModeBanner from "./components/NativeModeBanner";
import ErrorBoundary from "./components/ErrorBoundary";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useServiceWorker } from "./hooks/useServiceWorker";
import { usePrefetch } from "./hooks/usePrefetch";

// Lazy load pages for code splitting
const Index = React.lazy(() => import("./pages/Index"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const ModuleColombia = React.lazy(() => import("./pages/ModuleColombia"));
const PricingPage = React.lazy(() => import("./pages/PricingPage"));
const FoodResiliencePage = React.lazy(() => import("./pages/FoodResiliencePage"));
const MetatronPanel = React.lazy(() => import("./components/MetatronPanel"));
const DemoPage = React.lazy(() => import("./pages/DemoPage"));
const SolutionsPage = React.lazy(() => import("./pages/SolutionsPage"));
const CommandCenterPage = React.lazy(() => import("./pages/CommandCenterPage"));
const SdlcDashboardPage = React.lazy(() => import("./pages/SdlcDashboardPage"));

const App = () => {
  console.log('App render');

  // Initialize service worker
  useServiceWorker();

  // Initialize prefetching
  const { prefetchSDLCData } = usePrefetch();

  // Prefetch critical data on app start
  React.useEffect(() => {
    prefetchSDLCData();
  }, [prefetchSDLCData]);

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <NativeModeBanner />
        <Toaster />
        <Sonner />
        <HashRouter>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-etherblue-dark text-etherneon"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-etherneon"></div></div>}>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/sdlc-dashboard" element={<SdlcDashboardPage />} />
                <Route path="/command-center" element={<CommandCenterPage />} />
                <Route path="/module/colombia" element={<ModuleColombia />} />
                <Route path="/food-resilience" element={<FoodResiliencePage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/demo" element={<DemoPage />} />
                <Route path="/solutions" element={<SolutionsPage />} />
                <Route path="/metatron-panel" element={<MetatronPanel />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
        </HashRouter>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default App;
