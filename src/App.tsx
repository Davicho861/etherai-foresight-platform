import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NativeModeBanner from "./components/NativeModeBanner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Lazy load pages for code splitting
const Index = React.lazy(() => import("./pages/Index"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const ModuleColombia = React.lazy(() => import("./pages/ModuleColombia"));
const PricingPage = React.lazy(() => import("./pages/PricingPage"));
const FoodResiliencePage = React.lazy(() => import("./pages/FoodResiliencePage"));
const MetatronPanel = React.lazy(() => import("./components/MetatronPanel"));
const DemoPage = React.lazy(() => import("./pages/DemoPage"));

const queryClient = new QueryClient();

const App = () => {
  console.log('App render');
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NativeModeBanner />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-etherblue-dark text-etherneon"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-etherneon"></div></div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<div className="min-h-screen flex items-center justify-center">Cargando dashboard...</div>} />
              <Route path="/module/colombia" element={<ModuleColombia />} />
              <Route path="/food-resilience" element={<FoodResiliencePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/metatron-panel" element={<MetatronPanel />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
