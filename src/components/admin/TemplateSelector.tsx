
import React from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TemplateSelector: React.FC = () => {
  const { templates, selectedTemplate, setSelectedTemplate } = useBuilder();

  return (
    <div className="space-y-6">
      <div className="prose prose-sm mb-6">
        <h2 className="text-xl font-bold">Choose a Template</h2>
        <p>
          Select from our pre-designed templates or upload your own custom template.
        </p>
      </div>

      <RadioGroup 
        value={selectedTemplate} 
        onValueChange={setSelectedTemplate}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {templates.map((template) => (
          <div key={template.id} className="relative">
            <RadioGroupItem
              value={template.id}
              id={`template-${template.id}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`template-${template.id}`}
              className="cursor-pointer"
            >
              <Card className={`
                overflow-hidden border-2 transition-all
                ${selectedTemplate === template.id ? "border-blue-600" : "border-transparent hover:border-gray-300"}
              `}>
                <div 
                  className="h-40 bg-gray-100 border-b flex items-center justify-center"
                >
                  {/* A placeholder for the template preview */}
                  <div className="text-gray-400">
                    {template.name} Preview
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold">{template.name}</div>
                    {!template.hasJS && (
                      <Badge variant="outline" className="text-xs">
                        No JavaScript
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{template.description}</p>
                </div>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default TemplateSelector;
