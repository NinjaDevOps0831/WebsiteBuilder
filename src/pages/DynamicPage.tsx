
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCanvas } from "@/context/CanvasContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// This component renders a specific page based on URL
const DynamicPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getPageBySlug, pages } = useCanvas();
  
  // Get the current path without the /preview prefix
  const currentPath = location.pathname.replace('/preview', '') || '/';
  
  // Find the page that matches this path
  const page = getPageBySlug(currentPath);
  
  // If no page is found, show a not found message
  if (!page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          There is no page configured for the URL: {currentPath}
        </p>
        <div className="flex gap-4">
          <Button onClick={() => navigate('/preview')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Homepage
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/pages')}>
            Go to Page Editor
          </Button>
        </div>
      </div>
    );
  }
  
  // For now, this is a placeholder - you would render the actual page widgets here
  return (
    <div className="min-h-screen">
      <div className="bg-primary/20 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">{page.title}</h1>
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/pages')}>
          Edit Pages
        </Button>
      </div>
      
      <div className="container mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6">Page Content ({page.widgets.length} widgets)</h2>
        
        {page.widgets.length === 0 ? (
          <div className="border border-dashed border-muted-foreground p-8 rounded-lg text-center">
            <p className="text-muted-foreground mb-4">This page has no widgets yet.</p>
            <Button 
              onClick={() => {
                // Set current page to this page and navigate to the canvas editor
                const { setCurrentPage } = useCanvas();
                setCurrentPage(page.id);
                navigate('/admin/canvas');
              }}
            >
              Add Widgets
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4">
            {page.widgets.map((widget) => (
              <div
                key={widget.id}
                className="bg-card p-4 rounded-lg border"
                style={{
                  gridColumn: widget.gridColumn,
                  gridRow: widget.gridRow,
                }}
              >
                <h3 className="font-medium mb-2">{widget.title}</h3>
                <p className="text-sm text-muted-foreground">{widget.type}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicPage;
