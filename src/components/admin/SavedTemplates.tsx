
import React, { useState } from "react";
import { useBuilder, WidgetElement } from "@/contexts/BuilderContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Download, Upload, Save, Trash2 } from "lucide-react";

// Template structure for saving
export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  elements: WidgetElement[];
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

const SavedTemplates: React.FC = () => {
  const { elements, colorScheme, setElements, updateColorScheme } = useBuilder();
  const { toast } = useToast();
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [savedTemplates, setSavedTemplates] = useState<PageTemplate[]>(() => {
    const saved = localStorage.getItem("savedPageTemplates");
    return saved ? JSON.parse(saved) : [];
  });
  const [importJson, setImportJson] = useState("");

  // Save current page as a template
  const saveTemplate = () => {
    if (!templateName.trim()) {
      toast({
        title: "Template name required",
        description: "Please provide a name for your template",
        variant: "destructive",
      });
      return;
    }

    const newTemplate: PageTemplate = {
      id: `template-${Date.now()}`,
      name: templateName,
      description: templateDescription,
      createdAt: new Date().toISOString(),
      elements: elements,
      colorScheme: colorScheme,
    };

    const updatedTemplates = [...savedTemplates, newTemplate];
    setSavedTemplates(updatedTemplates);
    localStorage.setItem("savedPageTemplates", JSON.stringify(updatedTemplates));

    toast({
      title: "Template saved",
      description: `"${templateName}" has been saved successfully`,
    });

    // Reset form
    setTemplateName("");
    setTemplateDescription("");
  };

  // Load a template
  const loadTemplate = (template: PageTemplate) => {
    setElements(template.elements);
    
    // Update all color scheme values
    Object.entries(template.colorScheme).forEach(([key, value]) => {
      updateColorScheme(key as keyof typeof colorScheme, value);
    });

    toast({
      title: "Template loaded",
      description: `"${template.name}" has been loaded successfully`,
    });
  };

  // Delete a template
  const deleteTemplate = (id: string) => {
    const updatedTemplates = savedTemplates.filter(template => template.id !== id);
    setSavedTemplates(updatedTemplates);
    localStorage.setItem("savedPageTemplates", JSON.stringify(updatedTemplates));

    toast({
      title: "Template deleted",
      description: "The template has been deleted successfully",
    });
  };

  // Export template as JSON
  const exportTemplate = (template: PageTemplate) => {
    const dataStr = JSON.stringify(template, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `${template.name.replace(/\s+/g, '-').toLowerCase()}-template.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import template from JSON
  const importTemplate = () => {
    try {
      const template = JSON.parse(importJson) as PageTemplate;
      
      // Validate imported data
      if (!template.elements || !template.colorScheme || !template.name) {
        throw new Error("Invalid template format");
      }
      
      // Add imported template to saved templates
      const newTemplate = {
        ...template,
        id: `template-${Date.now()}`, // Generate new ID
        createdAt: new Date().toISOString() // Update creation date
      };
      
      const updatedTemplates = [...savedTemplates, newTemplate];
      setSavedTemplates(updatedTemplates);
      localStorage.setItem("savedPageTemplates", JSON.stringify(updatedTemplates));
      
      toast({
        title: "Template imported",
        description: `"${template.name}" has been imported successfully`,
      });
      
      setImportJson("");
    } catch (error) {
      toast({
        title: "Import failed",
        description: "The template data is invalid or corrupted",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="prose prose-sm mb-6">
        <h2 className="text-xl font-bold">Page Templates</h2>
        <p>
          Save your current page design as a template or load a previously saved template.
        </p>
      </div>

      {/* Save current page as template */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-medium">Save Current Page</h3>
          
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="My Awesome Template"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template-description">Description (Optional)</Label>
            <Textarea
              id="template-description"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="Description of your template"
              rows={2}
            />
          </div>
          
          <Button 
            onClick={saveTemplate} 
            className="w-full sm:w-auto gap-2"
          >
            <Save className="w-4 h-4" />
            Save Template
          </Button>
        </CardContent>
      </Card>

      {/* Import template */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-medium">Import Template</h3>
          
          <div className="space-y-2">
            <Label htmlFor="import-json">Paste Template JSON</Label>
            <Textarea
              id="import-json"
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='{"name": "Template Name", "elements": [...], ...}'
              rows={4}
              className="font-mono text-sm"
            />
          </div>
          
          <Button 
            onClick={importTemplate} 
            variant="outline" 
            className="w-full sm:w-auto gap-2"
            disabled={!importJson.trim()}
          >
            <Upload className="w-4 h-4" />
            Import Template
          </Button>
        </CardContent>
      </Card>

      {/* Saved templates */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Saved Templates</h3>
        
        {savedTemplates.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {savedTemplates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h4 className="font-semibold">{template.name}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(template.createdAt).toLocaleDateString()}
                    </p>
                    {template.description && (
                      <p className="text-sm mt-1">{template.description}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => loadTemplate(template)}
                    >
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => exportTemplate(template)}
                      className="gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Export
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-700 gap-1"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p>No templates saved yet.</p>
            <p className="text-sm">Create and save your first template above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTemplates;
