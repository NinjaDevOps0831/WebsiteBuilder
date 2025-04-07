
import React, { useState } from "react";
import { WidgetElement } from "@/contexts/BuilderContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  PlusCircle, 
  X, 
  Trash2,
  MoveUp,
  MoveDown
} from "lucide-react";

interface ElementEditorProps {
  element: WidgetElement;
  onUpdate: (updates: Partial<WidgetElement>) => void;
  onRemove: () => void;
}

const ElementEditor: React.FC<ElementEditorProps> = ({
  element,
  onUpdate,
  onRemove,
}) => {
  const [newOption, setNewOption] = useState("");
  
  // Handle color change
  const handleColorChange = (key: keyof typeof element.styles, value: string) => {
    onUpdate({
      styles: {
        ...element.styles,
        [key]: value,
      },
    });
  };

  // Handle position or size change
  const handlePositionSizeChange = (
    property: "position" | "size",
    axis: "x" | "y" | "width" | "height",
    value: string
  ) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;

    const newValue = { ...element[property], [axis]: numValue };
    onUpdate({ [property]: newValue });
  };

  // Handle content change
  const handleContentChange = (value: string) => {
    onUpdate({ content: value });
  };

  // Handle attribute change
  const handleAttributeChange = (key: string, value: string) => {
    onUpdate({
      attributes: {
        ...element.attributes,
        [key]: value,
      },
    });
  };
  
  // Options management for list and combo elements
  const handleAddOption = () => {
    if (!newOption.trim()) return;
    
    const updatedOptions = [...(element.options || []), newOption.trim()];
    onUpdate({ options: updatedOptions });
    setNewOption("");
  };
  
  const handleUpdateOption = (index: number, value: string) => {
    if (!element.options) return;
    
    const updatedOptions = [...element.options];
    updatedOptions[index] = value;
    onUpdate({ options: updatedOptions });
  };
  
  const handleRemoveOption = (index: number) => {
    if (!element.options) return;
    
    const updatedOptions = element.options.filter((_, i) => i !== index);
    onUpdate({ options: updatedOptions });
  };
  
  const handleMoveOption = (index: number, direction: 'up' | 'down') => {
    if (!element.options) return;
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === element.options.length - 1)
    ) return;
    
    const updatedOptions = [...element.options];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap positions
    [updatedOptions[index], updatedOptions[newIndex]] = 
      [updatedOptions[newIndex], updatedOptions[index]];
      
    onUpdate({ options: updatedOptions });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Element Type: {element.type}</h3>
      </div>

      {/* Content */}
      {(element.type === "button" || element.type === "text") && (
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Input
            id="content"
            value={element.content}
            onChange={(e) => handleContentChange(e.target.value)}
          />
        </div>
      )}

      {/* Placeholder for inputs */}
      {element.type === "input" && (
        <div className="space-y-2">
          <Label htmlFor="placeholder">Placeholder</Label>
          <Input
            id="placeholder"
            value={element.attributes?.placeholder || ""}
            onChange={(e) => handleAttributeChange("placeholder", e.target.value)}
          />
        </div>
      )}
      
      {/* Options editor for list and combo box */}
      {(element.type === "list" || element.type === "combo") && (
        <div className="space-y-3">
          <Label>{element.type === "list" ? "List Items" : "Options"}</Label>
          
          <div className="space-y-2 max-h-40 overflow-y-auto p-1">
            {(element.options || []).map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={option}
                  onChange={(e) => handleUpdateOption(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="icon" 
                  variant="ghost" 
                  onClick={() => handleMoveOption(index, 'up')}
                  disabled={index === 0}
                  className="h-8 w-8"
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => handleMoveOption(index, 'down')}
                  disabled={index === (element.options?.length || 0) - 1}
                  className="h-8 w-8"
                >
                  <MoveDown className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => handleRemoveOption(index)}
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <Input
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder={`Add new ${element.type === "list" ? "item" : "option"}`}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddOption();
                }
              }}
            />
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleAddOption}
              className="gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      )}

      <Separator />

      {/* Position and Size */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Position</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="position-x" className="text-xs">X</Label>
              <Input
                id="position-x"
                type="number"
                value={element.position.x}
                onChange={(e) => handlePositionSizeChange("position", "x", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="position-y" className="text-xs">Y</Label>
              <Input
                id="position-y"
                type="number"
                value={element.position.y}
                onChange={(e) => handlePositionSizeChange("position", "y", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Size</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="size-width" className="text-xs">Width</Label>
              <Input
                id="size-width"
                type="number"
                value={element.size.width}
                onChange={(e) => handlePositionSizeChange("size", "width", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="size-height" className="text-xs">Height</Label>
              <Input
                id="size-height"
                type="number"
                value={element.size.height}
                onChange={(e) => handlePositionSizeChange("size", "height", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Colors and Styles */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Appearance</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="text-color">Text Color</Label>
            <div className="flex">
              <Input
                id="text-color"
                type="color"
                value={element.styles.color || "#000000"}
                onChange={(e) => handleColorChange("color", e.target.value)}
                className="w-12 p-1 h-10"
              />
              <Input
                type="text"
                value={element.styles.color || "#000000"}
                onChange={(e) => handleColorChange("color", e.target.value)}
                className="ml-2 flex-1"
              />
            </div>
          </div>

          {element.type === "button" && (
            <div className="space-y-2">
              <Label htmlFor="bg-color">Background Color</Label>
              <div className="flex">
                <Input
                  id="bg-color"
                  type="color"
                  value={element.styles.backgroundColor || "#ffffff"}
                  onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                  className="w-12 p-1 h-10"
                />
                <Input
                  type="text"
                  value={element.styles.backgroundColor || "#ffffff"}
                  onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                  className="ml-2 flex-1"
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="border-radius">Border Radius</Label>
            <Input
              id="border-radius"
              type="text"
              value={element.styles.borderRadius || "0px"}
              onChange={(e) => handleColorChange("borderRadius", e.target.value)}
              placeholder="e.g. 4px or 25%"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size</Label>
            <Input
              id="font-size"
              type="text"
              value={element.styles.fontSize || "16px"}
              onChange={(e) => handleColorChange("fontSize", e.target.value)}
              placeholder="e.g. 16px"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Remove button */}
      <Button 
        variant="destructive" 
        onClick={onRemove}
        className="w-full"
      >
        Remove Element
      </Button>
    </div>
  );
};

export default ElementEditor;
