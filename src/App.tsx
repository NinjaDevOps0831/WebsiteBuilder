
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CanvasProvider } from "./context/CanvasContext";
import Index from "./pages/Index";
import AdminPanel from "./pages/AdminPanel";
import PreviewSite from "./pages/PreviewSite";
import NotFound from "./pages/NotFound";

// // Create a new component for dynamic page previews
// import DynamicPage from "./pages/DynamicPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CanvasProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/*" element={<AdminPanel />} />
            <Route path="/preview" element={<PreviewSite />} />
            {/* <Route path="/preview/*" element={<DynamicPage />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CanvasProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
