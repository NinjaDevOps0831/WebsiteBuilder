
import { useState } from "react";
import { Route, Routes, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Layout, 
  Palette, 
  Settings, 
  Grid,
  Code,
  Save,
  FileText
} from "lucide-react";
import { useCanvas, Configuration } from "@/context/CanvasContext";
import { toast } from "@/components/ui/use-toast";

// Admin panel sections
import CanvasEditor from "@/components/admin/CanvasEditor";
import TemplateSelector from "@/components/admin/TemplateSelector";
import ColorSchemeEditor from "@/components/admin/ColorSchemeEditor";
import ApiSettings from "@/components/admin/ApiSettings";
import SavedPages from "@/components/admin/SavedPages";
// import PageEditor from "@/components/admin/PageEditor";

import { updateWebsiteConfiguration } from "@/api/websiteConfigurationApi";

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { widgets, template, colorScheme, useJavascript, apiKey, pages, currentPageId, configId, configName, configDescription } = useCanvas();
  const [isSaving, setisSaving] = useState(false);

  // Save configuration
  const handleSave = () => {
    setisSaving(true);

    const newConfiguration: Configuration = {
      id: "",
      name: configName,
      description: configDescription,
      pages,
      currentPageId,
      template,
      colorScheme,
      useJavascript,
      apiKey,
    };

    updateWebsiteConfiguration(configId, {
      name: newConfiguration.name,
      description: newConfiguration.description,
      pages: newConfiguration.pages,
      current_page_id: newConfiguration.currentPageId,
      template_type: 'custom',
      color_scheme: newConfiguration.colorScheme,
      is_js_enabled: newConfiguration.useJavascript,
      api_key: newConfiguration.apiKey || "temp-api-key",
    }).then(response => {
        toast({
          title: "Configuration saved",
          description: `"${response.name}" has been saved successfully`,
        });
    }).catch(error => {
      toast({
        title: "Configuration save failed",
        description: `"${newConfiguration.name}" saving failed`,
        variant: "destructive",
      });

      console.log(error);
    }).finally(() => {
      setisSaving(false);
    });
  };
  
  // Get current page
  const currentPage = pages.find(p => p.id === currentPageId);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 bg-card">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary">Exchange Canvas Builder</h1>
            {currentPage && (
              <span className="text-sm bg-secondary px-2 py-1 rounded-md">
                Editing: {currentPage.title}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/preview')}
              className="flex items-center gap-2"
            >
              <Layout size={16} />
              Preview Site
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving || configId == ""}
              className="flex items-center gap-2 bg-exchange-blue hover:bg-exchange-lightblue"
            >
              {isSaving ? "Saving..." : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-card rounded-lg p-4">
          <nav className="space-y-2">
            {/* <NavLink 
              to="/admin/pages" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-secondary text-foreground'
                }`
              }
            >
              <FileText size={18} />
              Pages
            </NavLink> */}
            <NavLink 
              to="/admin/canvas" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-secondary text-foreground'
                }`
              }
            >
              <Grid size={18} />
              Canvas Editor
            </NavLink>
            <NavLink 
              to="/admin/templates" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-secondary text-foreground'
                }`
              }
            >
              <Layout size={18} />
              Templates
            </NavLink>
            <NavLink 
              to="/admin/colors" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-secondary text-foreground'
                }`
              }
            >
              <Palette size={18} />
              Color Scheme
            </NavLink>
            <NavLink 
              to="/admin/api" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-secondary text-foreground'
                }`
              }
            >
              <Code size={18} />
              API Settings
            </NavLink>
            <NavLink 
              to="/admin/saved-pages" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-secondary text-foreground'
                }`
              }
            >
              <Save size={18} />
              Saved Pages
            </NavLink>
          </nav>

          <Separator className="my-6" />
          
          <div className="p-4 bg-secondary rounded-md">
            {/* <h3 className="text-sm font-medium mb-2">Current Page</h3>
            <p className="text-sm text-muted-foreground">{currentPage?.title || 'Home'}</p> */}
            
            <h3 className="text-sm font-medium mb-2">Active Template</h3>
            <p className="text-sm text-muted-foreground">{template.name}</p>
            
            <h3 className="text-sm font-medium mt-4 mb-2">JavaScript</h3>
            <p className="text-sm text-muted-foreground">
              {useJavascript ? "Enabled" : "Disabled"}
            </p>
            
            <h3 className="text-sm font-medium mt-4 mb-2">Widgets</h3>
            <p className="text-sm text-muted-foreground">{widgets.length} widgets configured</p>
            
            {/* <h3 className="text-sm font-medium mt-4 mb-2">Total Pages</h3>
            <p className="text-sm text-muted-foreground">{pages.length} pages created</p> */}
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 bg-card rounded-lg p-6">
          <Routes>
            <Route path="/" element={<CanvasEditor />} />
            {/* <Route path="/pages" element={<PageEditor />} /> */}
            <Route path="/canvas" element={<CanvasEditor />} />
            <Route path="/templates" element={<TemplateSelector />} />
            <Route path="/colors" element={<ColorSchemeEditor />} />
            <Route path="/api" element={<ApiSettings />} />
            <Route path="/saved-pages" element={<SavedPages />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
