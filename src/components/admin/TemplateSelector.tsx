
import { useState } from "react";
import { useCanvas, Template } from "@/context/CanvasContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Code, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Predefined templates
const templates: Template[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'A clean, minimalist design with focus on content',
    className: 'template-minimal',
    jsRequired: false,
    isCustom: false,
  },
  {
    id: 'crypto',
    name: 'Crypto Modern',
    description: 'A modern design for cryptocurrency exchanges',
    className: 'template-crypto',
    jsRequired: true,
    isCustom: false,
  },
  {
    id: 'classic',
    name: 'Classic Exchange',
    description: 'Traditional exchange layout with detailed information',
    className: 'template-classic',
    jsRequired: true,
    isCustom: false,
  },
];

// Sample custom templates
const customTemplates: Template[] = [
  // This would be populated from user uploads
];

interface TemplateCardProps {
  template: Template;
  isActive: boolean;
  onSelect: () => void;
  onDelete?: () => void;
}

const TemplateCard = ({ template, isActive, onSelect, onDelete }: TemplateCardProps) => {
  return (
    <Card 
      className={`overflow-hidden cursor-pointer transition-all ${
        isActive 
          ? 'ring-2 ring-primary' 
          : 'hover:border-primary/50'
      }`}
      onClick={onSelect}
    >
      <div className={`h-40 ${template.className}`}>
        <div className="w-full h-full flex items-center justify-center">
          {/* This would be a preview of the template */}
          <div className="bg-exchange-blue/20 p-4 rounded-lg border border-exchange-blue/30 backdrop-blur-sm">
            <div className="w-12 h-1 bg-exchange-lightblue mb-2"></div>
            <div className="w-20 h-1 bg-exchange-lightblue/70 mb-4"></div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-md bg-exchange-lightblue/50"></div>
              <div className="w-8 h-8 rounded-md bg-exchange-lightblue/50"></div>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">
              {template.name}
              {isActive && (
                <span className="ml-2 text-primary">
                  <CheckCircle size={14} className="inline" />
                </span>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">{template.description}</p>
            <div className="mt-2 text-xs text-muted-foreground">
              {template.jsRequired ? (
                <span>Requires JavaScript</span>
              ) : (
                <span>Works without JavaScript</span>
              )}
            </div>
          </div>
          
          {template.isCustom && onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full opacity-70 hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete custom template?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Are you sure you want to delete this template?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={onDelete}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const TemplateSelector = () => {
  const { template, setTemplate, useJavascript, setUseJavascript } = useCanvas();
  const [customHTML, setCustomHTML] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [availableTemplates, setAvailableTemplates] = useState([...templates, ...customTemplates]);
  
  const handleSelectTemplate = (selectedTemplate: Template) => {
    setTemplate(selectedTemplate);
    
    // If the template requires JS but JS is disabled, show a warning
    if (selectedTemplate.jsRequired && !useJavascript) {
      toast({
        title: "JavaScript Required",
        description: "This template requires JavaScript. JavaScript has been automatically enabled.",
        variant: "default",
      });
      setUseJavascript(true);
    }
  };
  
  const handleUploadCustomTemplate = () => {
    setIsUploading(true);
    
    // Simulate HTML validation and sanitization
    setTimeout(() => {
      setIsUploading(false);
      
      // Create a new custom template
      const newCustomTemplate: Template = {
        id: `custom-${Date.now()}`,
        name: `Custom Template ${availableTemplates.filter(t => t.isCustom).length + 1}`,
        description: 'Your custom template',
        className: 'template-minimal', // Default styling
        jsRequired: true, // Assume custom templates need JS
        isCustom: true,
      };
      
      // Add the new template to available templates
      setAvailableTemplates([...availableTemplates, newCustomTemplate]);
      
      // Select the new template
      setTemplate(newCustomTemplate);
      
      // Enable JavaScript for the custom template
      setUseJavascript(true);
      
      toast({
        title: "Custom template uploaded",
        description: "Your custom template has been uploaded and selected.",
      });
      
      // Clear the textarea
      setCustomHTML('');
    }, 1500);
  };
  
  const handleDeleteCustomTemplate = (templateId: string) => {
    // Remove the template from available templates
    const updatedTemplates = availableTemplates.filter(t => t.id !== templateId);
    setAvailableTemplates(updatedTemplates);
    
    // If the deleted template was selected, select the first available template
    if (template.id === templateId) {
      setTemplate(templates[0]);
    }
    
    toast({
      title: "Custom template deleted",
      description: "The custom template has been deleted.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Template Selection</h2>
        <p className="text-muted-foreground">
          Choose a template for your exchange website
        </p>
      </div>
      
      <Separator />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">JavaScript Support</h3>
          <div className="flex items-center gap-2">
            <Switch 
              id="js-mode" 
              checked={useJavascript}
              onCheckedChange={setUseJavascript}
              disabled={template.jsRequired}
            />
            <Label htmlFor="js-mode">
              {useJavascript ? "Enabled" : "Disabled"}
            </Label>
          </div>
        </div>
        
        {!useJavascript && (
          <div className="bg-amber-950/20 border border-amber-950/30 p-4 rounded-md flex items-start gap-2">
            <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-500">JavaScript Disabled</h4>
              <p className="text-sm text-muted-foreground">
                With JavaScript disabled, some features may not work. Your site will use server-side rendering for exchange data.
              </p>
            </div>
          </div>
        )}
        
        {template.jsRequired && !useJavascript && (
          <div className="bg-red-950/20 border border-red-950/30 p-4 rounded-md flex items-start gap-2">
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-500">Template Incompatibility</h4>
              <p className="text-sm text-muted-foreground">
                The selected template requires JavaScript to function properly. Please enable JavaScript or select a different template.
              </p>
            </div>
          </div>
        )}
      </div>
      
      <Separator />
      
      <Tabs defaultValue="prebuilt">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prebuilt">Pre-built Templates</TabsTrigger>
          <TabsTrigger value="custom">Custom Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prebuilt" className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                template={tpl}
                isActive={template.id === tpl.id}
                onSelect={() => handleSelectTemplate(tpl)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableTemplates
              .filter(t => t.isCustom)
              .map((tpl) => (
                <TemplateCard
                  key={tpl.id}
                  template={tpl}
                  isActive={template.id === tpl.id}
                  onSelect={() => handleSelectTemplate(tpl)}
                  onDelete={() => handleDeleteCustomTemplate(tpl.id)}
                />
              ))}
              
            <Dialog>
              <DialogTrigger asChild>
                <Card className="overflow-hidden cursor-pointer h-full flex flex-col items-center justify-center p-8 border-dashed">
                  <Upload size={32} className="text-muted-foreground mb-4" />
                  <p className="font-medium">Upload Custom Template</p>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Upload your own HTML template
                  </p>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Upload Custom Template</DialogTitle>
                  <DialogDescription>
                    Paste your HTML code below. The code will be sanitized before being used as a template.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="flex items-start gap-2">
                    <Code size={16} className="mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <Label htmlFor="custom-html" className="text-sm font-medium">HTML Template</Label>
                      <textarea
                        id="custom-html"
                        className="w-full h-64 mt-2 p-3 text-sm font-mono bg-secondary/50 border border-border rounded-md"
                        placeholder="<!DOCTYPE html>..."
                        value={customHTML}
                        onChange={(e) => setCustomHTML(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Important Notes:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                      <li>Template code will be sanitized to prevent security issues</li>
                      <li>Use relative URLs for all resources (avoid CDNs for Tor compatibility)</li>
                      <li>Include placeholders for dynamic content (exchange widgets)</li>
                      <li>Templates should be responsive and work on all devices</li>
                    </ul>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCustomHTML('')}>Clear</Button>
                  <Button 
                    onClick={handleUploadCustomTemplate}
                    disabled={!customHTML.trim() || isUploading}
                    className="bg-exchange-blue hover:bg-exchange-lightblue"
                  >
                    {isUploading ? "Validating..." : "Upload Template"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplateSelector;
