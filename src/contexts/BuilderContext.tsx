
import React, { createContext, useContext, useState, useEffect } from "react";

// Define types for our elements
export type ElementType = 
  "button" | 
  "input" | 
  "text" | 
  "number" | 
  "list" | 
  "combo" | 
  "exchangeWidget";

export interface WidgetElement {
  id: string;
  type: ElementType;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  styles: {
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: string;
    fontSize?: string;
    fontWeight?: string;
    // Add more style properties as needed
  };
  attributes?: Record<string, any>;
  options?: string[]; // For list and combo elements
}

interface Template {
  id: string;
  name: string;
  description: string;
  hasJS: boolean;
  preview: string;
  template: string;
}

interface BuilderContextType {
  elements: WidgetElement[];
  setElements: (elements: WidgetElement[]) => void; // Add this line
  addElement: (element: Omit<WidgetElement, "id">) => void;
  updateElement: (id: string, updates: Partial<WidgetElement>) => void;
  removeElement: (id: string) => void;
  selectedElement: string | null;
  setSelectedElement: (id: string | null) => void;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  updateColorScheme: (key: keyof BuilderContextType["colorScheme"], value: string) => void;
  selectedTemplate: string;
  setSelectedTemplate: (id: string) => void;
  templates: Template[];
  uploadTemplate: (template: Omit<Template, "id">) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
  showGrid: boolean;
  toggleGrid: () => void;
}

const defaultColorScheme = {
  primary: "#3b82f6",
  secondary: "#e2e8f0",
  accent: "#10b981",
  background: "#ffffff",
  text: "#1e293b"
};

// Predefined templates
const defaultTemplates: Template[] = [
  {
    id: "modern",
    name: "Modern",
    description: "A modern template with JavaScript interactions",
    hasJS: true,
    preview: "/templates/modern-preview.png",
    template: "<div class='modern-template'>{{content}}</div>"
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "A clean minimal design with JavaScript",
    hasJS: true,
    preview: "/templates/minimal-preview.png",
    template: "<div class='minimal-template'>{{content}}</div>"
  },
  {
    id: "basic",
    name: "Basic",
    description: "A simple template without JavaScript",
    hasJS: false,
    preview: "/templates/basic-preview.png",
    template: "<div class='basic-template'>{{content}}</div>"
  }
];

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [elements, setElements] = useState<WidgetElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [colorScheme, setColorScheme] = useState(defaultColorScheme);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);
  const [gridSize, setGridSize] = useState(20); // Default grid size (in pixels)
  const [showGrid, setShowGrid] = useState(true); // Default to show grid

  // Load state from localStorage on initial render
  useEffect(() => {
    const savedState = localStorage.getItem("builderState");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setElements(parsedState.elements || []);
        setColorScheme(parsedState.colorScheme || defaultColorScheme);
        setSelectedTemplate(parsedState.selectedTemplate || "modern");
        setGridSize(parsedState.gridSize || 20);
        setShowGrid(parsedState.showGrid !== undefined ? parsedState.showGrid : true);
        if (parsedState.templates) {
          setTemplates(prev => {
            // Merge custom templates with default ones
            const defaultIds = defaultTemplates.map(t => t.id);
            const customTemplates = parsedState.templates.filter(
              (t: Template) => !defaultIds.includes(t.id)
            );
            return [...defaultTemplates, ...customTemplates];
          });
        }
      } catch (error) {
        console.error("Error parsing saved state", error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      elements,
      colorScheme,
      selectedTemplate,
      templates: templates.filter(t => !defaultTemplates.map(dt => dt.id).includes(t.id)),
      gridSize,
      showGrid
    };
    localStorage.setItem("builderState", JSON.stringify(state));
  }, [elements, colorScheme, selectedTemplate, templates, gridSize, showGrid]);

  const addElement = (element: Omit<WidgetElement, "id">) => {
    // Snap position to grid
    const snappedX = Math.round(element.position.x / gridSize) * gridSize;
    const snappedY = Math.round(element.position.y / gridSize) * gridSize;
    
    // Set default options for list and combo elements
    let options: string[] = [];
    if (element.type === "list" || element.type === "combo") {
      options = element.type === "list" 
        ? ["Item 1", "Item 2", "Item 3"] 
        : ["Option 1", "Option 2", "Option 3"];
    }
    
    const newElement: WidgetElement = {
      ...element,
      id: `element-${Date.now()}`,
      position: { x: snappedX, y: snappedY },
      options: options.length > 0 ? options : undefined
    };
    
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
  };

  const updateElement = (id: string, updates: Partial<WidgetElement>) => {
    setElements(prev => 
      prev.map(el => {
        if (el.id === id) {
          // If position is updated, snap to grid
          const updatedPosition = updates.position 
            ? {
                x: Math.round(updates.position.x / gridSize) * gridSize,
                y: Math.round(updates.position.y / gridSize) * gridSize
              }
            : el.position;
            
          return { 
            ...el, 
            ...updates,
            position: updatedPosition 
          };
        }
        return el;
      })
    );
  };

  const removeElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const updateColorScheme = (key: keyof typeof colorScheme, value: string) => {
    setColorScheme(prev => ({ ...prev, [key]: value }));
  };

  const uploadTemplate = (template: Omit<Template, "id">) => {
    const newTemplate: Template = {
      ...template,
      id: `template-${Date.now()}`
    };
    setTemplates(prev => [...prev, newTemplate]);
  };
  
  const toggleGrid = () => {
    setShowGrid(prev => !prev);
  };

  return (
    <BuilderContext.Provider value={{
      elements,
      setElements, // Add this line
      addElement,
      updateElement,
      removeElement,
      selectedElement,
      setSelectedElement,
      colorScheme,
      updateColorScheme,
      selectedTemplate,
      setSelectedTemplate,
      templates,
      uploadTemplate,
      gridSize,
      setGridSize,
      showGrid,
      toggleGrid
    }}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
};
