
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from "./hooks/useLanguage";
import Features from "./pages/Features";
import AgriVision from "./pages/AgriVision";
import AgriCare from "./pages/AgriCare";
import About from "./pages/About";
import Community from "./pages/Community";
import Support from "./pages/Support";
import LoginPage from "./pages/LoginPage"; // Import LoginPage
import SignUpPage from "./pages/SignUpPage"; // Import SignUpPage

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/features" element={<Features />} />
            <Route path="/agrivision" element={<AgriVision />} />
            <Route path="/agricare" element={<AgriCare />} />
            <Route path="/about" element={<About />} />
            <Route path="/community" element={<Community />} />
            <Route path="/support" element={<Support />} />
            <Route path="/login" element={<LoginPage />} /> {/* Add Login Route */}
            <Route path="/signup" element={<SignUpPage />} /> {/* Add SignUp Route */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
