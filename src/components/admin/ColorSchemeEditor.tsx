
import { useState, useEffect } from "react";
import { useCanvas } from "@/context/CanvasContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Paintbrush, Check } from "lucide-react";

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  description?: string;
}

const ColorInput = ({ label, value, onChange, description }: ColorInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  const handleBlur = () => {
    // Validate if the input is a valid hex color
    const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(inputValue);
    
    if (isValidHex) {
      onChange(inputValue);
    } else {
      // Reset to the previous valid value
      setInputValue(value);
      toast({
        title: "Invalid color format",
        description: "Please enter a valid hex color (e.g., #3B82F6)",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor={`color-${label.toLowerCase()}`}>{label}</Label>
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-md border border-border"
          style={{ backgroundColor: inputValue }}
        ></div>
        <Input
          id={`color-${label.toLowerCase()}`}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          className="font-mono"
        />
        <Input
          type="color"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value);
          }}
          className="w-10 h-10 p-0 overflow-hidden border-0"
        />
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

// Predefined color schemes
const colorSchemes = [
  {
    name: 'Dark Blue',
    colors: {
      primary: '#3B82F6',
      secondary: '#1F2937',
      accent: '#10B981',
      background: '#111827',
      text: '#F9FAFB',
    },
  },
  {
    name: 'Dark Purple',
    colors: {
      primary: '#8B5CF6',
      secondary: '#1E1B4B',
      accent: '#EC4899',
      background: '#0F172A',
      text: '#F8FAFC',
    },
  },
  {
    name: 'Dark Green',
    colors: {
      primary: '#10B981',
      secondary: '#064E3B',
      accent: '#6366F1',
      background: '#111827',
      text: '#F9FAFB',
    },
  },
  {
    name: 'Light Mode',
    colors: {
      primary: '#2563EB',
      secondary: '#F1F5F9',
      accent: '#10B981',
      background: '#FFFFFF',
      text: '#0F172A',
    },
  },
];

const ColorSchemeEditor = () => {
  const { colorScheme, setColorScheme } = useCanvas();
  const [activeTab, setActiveTab] = useState('custom');
  
  // Handle color change
  const handleColorChange = (key: string, value: string) => {
    setColorScheme({ [key]: value });
  };
  
  // Apply predefined color scheme
  const applyColorScheme = (scheme: typeof colorSchemes[0]) => {
    setColorScheme(scheme.colors);
    toast({
      title: "Color scheme applied",
      description: `The "${scheme.name}" color scheme has been applied.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Color Scheme</h2>
        <p className="text-muted-foreground">
          Customize the colors of your exchange website
        </p>
      </div>
      
      <Separator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="custom">Custom Colors</TabsTrigger>
          <TabsTrigger value="presets">Color Presets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="custom" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paintbrush size={18} />
                Color Customization
              </CardTitle>
              <CardDescription>
                Use the color pickers to customize your website's color scheme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorInput
                  label="Primary Color"
                  value={colorScheme.primary}
                  onChange={(color) => handleColorChange('primary', color)}
                  description="Used for buttons, links, and primary actions"
                />
                
                <ColorInput
                  label="Secondary Color"
                  value={colorScheme.secondary}
                  onChange={(color) => handleColorChange('secondary', color)}
                  description="Used for secondary elements, backgrounds, and borders"
                />
                
                <ColorInput
                  label="Accent Color"
                  value={colorScheme.accent}
                  onChange={(color) => handleColorChange('accent', color)}
                  description="Used for highlighting important information"
                />
                
                <ColorInput
                  label="Background Color"
                  value={colorScheme.background}
                  onChange={(color) => handleColorChange('background', color)}
                  description="Main background color for your website"
                />
                
                <ColorInput
                  label="Text Color"
                  value={colorScheme.text}
                  onChange={(color) => handleColorChange('text', color)}
                  description="Color for text and icons"
                />
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Preview</h3>
                <div 
                  className="p-6 rounded-lg border border-border"
                  style={{ backgroundColor: colorScheme.background, color: colorScheme.text }}
                >
                  <h4 
                    className="text-xl font-bold mb-2"
                    style={{ color: colorScheme.text }}
                  >
                    Sample Heading
                  </h4>
                  <p className="mb-4">This is how your text will look with the selected colors.</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button 
                      className="px-4 py-2 rounded-md text-white"
                      style={{ backgroundColor: colorScheme.primary }}
                    >
                      Primary Button
                    </button>
                    <button 
                      className="px-4 py-2 rounded-md"
                      style={{ 
                        backgroundColor: colorScheme.secondary, 
                        color: colorScheme.text 
                      }}
                    >
                      Secondary Button
                    </button>
                    <button 
                      className="px-4 py-2 rounded-md text-white"
                      style={{ backgroundColor: colorScheme.accent }}
                    >
                      Accent Button
                    </button>
                  </div>
                  
                  <div 
                    className="p-4 rounded-md"
                    style={{ 
                      backgroundColor: colorScheme.secondary,
                      color: colorScheme.text
                    }}
                  >
                    <p>This is a sample widget with the secondary background color.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="presets" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colorSchemes.map((scheme, index) => (
              <Card 
                key={index}
                className="overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => applyColorScheme(scheme)}
              >
                <div 
                  className="h-24 flex items-center justify-center"
                  style={{ 
                    backgroundColor: scheme.colors.background,
                    color: scheme.colors.text,
                  }}
                >
                  <div className="flex gap-2">
                    <div 
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: scheme.colors.primary }}
                    ></div>
                    <div 
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: scheme.colors.secondary }}
                    ></div>
                    <div 
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: scheme.colors.accent }}
                    ></div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{scheme.name}</h3>
                    {colorScheme.primary === scheme.colors.primary &&
                     colorScheme.secondary === scheme.colors.secondary &&
                     colorScheme.accent === scheme.colors.accent && (
                      <span className="text-primary">
                        <Check size={16} />
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColorSchemeEditor;
