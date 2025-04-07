
import React, { useState } from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const UploadTemplate: React.FC = () => {
  const { uploadTemplate } = useBuilder();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hasJS, setHasJS] = useState(true);
  const [template, setTemplate] = useState("");
  const [htmlFile, setHtmlFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setHtmlFile(file);
      
      // Read file content
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTemplate(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !template) {
      toast({
        title: "Error",
        description: "Template name and HTML content are required",
        variant: "destructive",
      });
      return;
    }
    
    uploadTemplate({
      name,
      description,
      hasJS,
      preview: "/templates/custom-preview.png", // Placeholder
      template,
    });
    
    toast({
      title: "Template uploaded",
      description: "Your custom template has been added",
    });
    
    // Reset form
    setName("");
    setDescription("");
    setHasJS(true);
    setTemplate("");
    setHtmlFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="prose prose-sm mb-6">
        <h2 className="text-xl font-bold">Upload Custom Template</h2>
        <p>
          Upload your own HTML template to use in your site.
        </p>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="template-name">Template Name</Label>
          <Input
            id="template-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Custom Template"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="template-js">JavaScript Support</Label>
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="template-js"
              checked={hasJS}
              onCheckedChange={setHasJS}
            />
            <Label htmlFor="template-js">
              {hasJS ? "Uses JavaScript" : "No JavaScript"}
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="template-description">Description</Label>
        <Textarea
          id="template-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of your template"
          rows={2}
        />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-file">Upload HTML File</Label>
              <Input
                id="template-file"
                type="file"
                accept=".html,.htm"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-sm text-gray-500">
                Upload an HTML file to use as your template
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-html">Or Paste HTML Code</Label>
              <Textarea
                id="template-html"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                placeholder="<!DOCTYPE html><html>...</html>"
                rows={6}
                className="font-mono text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full sm:w-auto">
        Upload Template
      </Button>
    </form>
  );
};

export default UploadTemplate;
