
import React from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ColorSchemeEditor: React.FC = () => {
  const { colorScheme, updateColorScheme } = useBuilder();

  const colorSettings = [
    { key: "primary", label: "Primary Color", description: "Used for buttons and important elements" },
    { key: "secondary", label: "Secondary Color", description: "Used for backgrounds and less important elements" },
    { key: "accent", label: "Accent Color", description: "Used for highlights and calls to action" },
    { key: "background", label: "Background Color", description: "Main background color of the site" },
    { key: "text", label: "Text Color", description: "Main text color" },
  ];

  return (
    <div className="space-y-6">
      <div className="prose prose-sm mb-6">
        <h2 className="text-xl font-bold">Customize Your Site Colors</h2>
        <p>
          Choose colors that match your brand. Changes will be applied to the entire site.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {colorSettings.map((setting) => (
          <Card key={setting.key} className="overflow-hidden">
            <div 
              className="h-24 w-full" 
              style={{ backgroundColor: colorScheme[setting.key as keyof typeof colorScheme] }} 
            />
            <CardContent className="p-4 space-y-3">
              <div>
                <Label htmlFor={`color-${setting.key}`}>{setting.label}</Label>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
              
              <div className="flex gap-2">
                <Input
                  id={`color-${setting.key}`}
                  type="color"
                  value={colorScheme[setting.key as keyof typeof colorScheme]}
                  onChange={(e) => 
                    updateColorScheme(setting.key as keyof typeof colorScheme, e.target.value)
                  }
                  className="w-12 p-1 h-10"
                />
                <Input
                  type="text"
                  value={colorScheme[setting.key as keyof typeof colorScheme]}
                  onChange={(e) => 
                    updateColorScheme(setting.key as keyof typeof colorScheme, e.target.value)
                  }
                  className="flex-1"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button 
        onClick={() => {
          // Reset to default
          updateColorScheme("primary", "#3b82f6");
          updateColorScheme("secondary", "#e2e8f0");
          updateColorScheme("accent", "#10b981");
          updateColorScheme("background", "#ffffff");
          updateColorScheme("text", "#1e293b");
        }}
        variant="outline"
      >
        Reset to Default Colors
      </Button>
    </div>
  );
};

export default ColorSchemeEditor;
