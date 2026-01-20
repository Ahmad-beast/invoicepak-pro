import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGate } from "@/components/auth/AuthGate";
import { initGA } from "@/lib/analytics";
import { usePageTracking } from "@/hooks/usePageTracking";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateInvoice from "./pages/CreateInvoice";
import SharedInvoice from "./pages/SharedInvoice";
import Subscription from "./pages/Subscription";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookieSettings from "./pages/CookieSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle page tracking inside BrowserRouter
const PageTracker = ({ children }: { children: React.ReactNode }) => {
  usePageTracking();
  return <>{children}</>;
};

const App = () => {
  // Initialize GA4 on app mount
  useEffect(() => {
    initGA();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PageTracker>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route
                  path="/dashboard"
                  element={
                    <AuthGate>
                      <Dashboard />
                    </AuthGate>
                  }
                />
                <Route
                  path="/dashboard/create"
                  element={
                    <AuthGate>
                      <CreateInvoice />
                    </AuthGate>
                  }
                />
                <Route
                  path="/dashboard/subscription"
                  element={
                    <AuthGate>
                      <Subscription />
                    </AuthGate>
                  }
                />

                {/* Public shared invoice route - uses document ID */}
                <Route path="/invoice/:shareId" element={<SharedInvoice />} />

                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/cookies" element={<CookieSettings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTracker>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
