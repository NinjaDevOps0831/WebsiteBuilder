
import React from "react";
import { Button } from "@/components/ui/button";
import { ElementType } from "@/contexts/BuilderContext";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ElementToolbarProps {
  onAddElement: (type: ElementType) => void;
}

const ElementToolbar: React.FC<ElementToolbarProps> = ({ onAddElement }) => {
  const basicElements: { type: ElementType; label: string; description: string }[] = [
    { type: "button", label: "Button", description: "Clickable button" },
    { type: "input", label: "Input", description: "Text input field" },
    { type: "text", label: "Text", description: "Text content" },
    { type: "number", label: "Number", description: "Numeric input" },
    { type: "list", label: "List Box", description: "List of selectable items" },
    { type: "combo", label: "Combo Box", description: "Dropdown selection" },
  ];

  const specialElements: { type: ElementType; label: string; description: string }[] = [
    { type: "exchangeWidget", label: "Exchange Widget", description: "Currency exchange widget" },
  ];

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="basic">Basic</TabsTrigger>
        <TabsTrigger value="special">Special</TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
        <div className="grid grid-cols-2 gap-2">
          {basicElements.map((element) => (
            <Button
              key={element.type}
              variant="outline"
              className="h-auto text-left flex flex-col items-start p-3 border"
              onClick={() => onAddElement(element.type)}
            >
              <span className="font-medium">{element.label}</span>
              <span className="text-xs text-muted-foreground">{element.description}</span>
            </Button>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="special">
        <div className="grid grid-cols-1 gap-2">
          {specialElements.map((element) => (
            <Button
              key={element.type}
              variant="outline"
              className="h-auto text-left flex flex-col items-start p-3 border"
              onClick={() => onAddElement(element.type)}
            >
              <span className="font-medium">{element.label}</span>
              <span className="text-xs text-muted-foreground">{element.description}</span>
            </Button>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ElementToolbar;
