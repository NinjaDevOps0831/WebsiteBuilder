
import React, { useState } from "react";
import { useBuilder, ElementType, WidgetElement } from "@/contexts/BuilderContext";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import ElementEditor from "./ElementEditor";
import BuilderCanvas from "./BuilderCanvas";
import ElementToolbar from "./ElementToolbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const PageBuilder: React.FC = () => {
  const { 
    elements, 
    addElement, 
    updateElement, 
    removeElement, 
    selectedElement, 
    setSelectedElement,
    gridSize,
    setGridSize,
    showGrid,
    toggleGrid
  } = useBuilder();

  const handleAddElement = (type: ElementType) => {
    const defaultElement: Omit<WidgetElement, "id"> = {
      type,
      content: type === "text" ? "Text content" : "",
      position: { x: 50, y: 50 },
      size: { width: 120, height: type === "text" ? 30 : 40 }, // Reduced default sizes
      styles: {
        color: "#000000",
        backgroundColor: type === "button" ? "#3b82f6" : "transparent",
        borderRadius: type === "button" ? "4px" : "0px",
        fontSize: "16px",
      },
      attributes: {}
    };

    if (type === "button") {
      defaultElement.content = "Click me";
    } else if (type === "input") {
      defaultElement.attributes = { placeholder: "Enter text..." };
    } else if (type === "exchangeWidget") {
      defaultElement.content = "Exchange Widget";
      defaultElement.size = { width: 240, height: 160 }; // Reduced size
    } else if (type === "list") {
      defaultElement.options = ["Item 1", "Item 2", "Item 3"];
    } else if (type === "combo") {
      defaultElement.options = ["Option 1", "Option 2", "Option 3"];
    }

    addElement(defaultElement);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const id = active.id as string;
    
    const element = elements.find(el => el.id === id);
    if (!element) return;
    
    const newPosition = {
      x: element.position.x + delta.x,
      y: element.position.y + delta.y
    };
    
    updateElement(id, { position: newPosition });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-3/4">
        <Card>
          <CardHeader>
            <CardTitle>Canvas</CardTitle>
            <CardDescription>
              Drag and drop elements to build your page
            </CardDescription>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="grid-toggle" 
                  checked={showGrid} 
                  onCheckedChange={toggleGrid}
                />
                <Label htmlFor="grid-toggle">Show Grid</Label>
              </div>
              <div className="flex items-center space-x-4 w-1/3">
                <Label htmlFor="grid-size" className="whitespace-nowrap">Grid Size: {gridSize}px</Label>
                <Slider 
                  id="grid-size"
                  min={5}
                  max={50}
                  step={5}
                  value={[gridSize]}
                  onValueChange={(value) => setGridSize(value[0])}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DndContext 
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToParentElement]}
            >
              <BuilderCanvas 
                elements={elements}
                selectedElement={selectedElement}
                onSelectElement={setSelectedElement}
              />
            </DndContext>
          </CardContent>
        </Card>
      </div>

      <div className="w-full lg:w-1/4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Elements</CardTitle>
            <CardDescription>
              Add elements to your page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ElementToolbar onAddElement={handleAddElement} />
          </CardContent>
        </Card>

        {selectedElement && (
          <Card>
            <CardHeader>
              <CardTitle>Properties</CardTitle>
              <CardDescription>
                Edit element properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ElementEditor 
                element={elements.find(el => el.id === selectedElement)!}
                onUpdate={(updates) => updateElement(selectedElement, updates)}
                onRemove={() => removeElement(selectedElement)}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PageBuilder;
