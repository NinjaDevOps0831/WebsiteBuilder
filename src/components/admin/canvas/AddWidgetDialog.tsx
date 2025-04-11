
import React, { useState } from "react";
import { Widget, WidgetType, useCanvas } from "@/context/CanvasContext";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DollarSign,
  ArrowLeftRight, 
  Menu as MenuIcon, 
  Layout, 
  Plus, 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const widgetTypeOptions = [
  { value: 'exchangeRates', label: 'Exchange Rates', icon: <DollarSign size={16} /> },
  { value: 'converter', label: 'Currency Converter', icon: <ArrowLeftRight size={16} /> },
  { value: 'transaction', label: 'Transaction Form', icon: <Layout size={16} /> },
  // { value: 'menu', label: 'Navigation Menu', icon: <MenuIcon size={16} /> },
  { value: 'form', label: 'Contact Form', icon: <Layout size={16} /> },
];

interface AddWidgetDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddWidgetDialog = ({ isOpen, onOpenChange }: AddWidgetDialogProps) => {
  const { addWidget } = useCanvas();
  const [newWidgetType, setNewWidgetType] = useState<WidgetType>('exchangeRates');
  const [newWidgetTitle, setNewWidgetTitle] = useState('');
  
  const handleAddWidget = () => {
    let widgetConfig = {};
    
    switch (newWidgetType) {
      case 'exchangeRates':
        widgetConfig = { currencies: ['BTC', 'ETH', 'XMR', 'LTC'] };
        break;
      case 'converter':
        widgetConfig = { fromCurrency: 'BTC', toCurrency: 'USD' };
        break;
      case 'menu':
        widgetConfig = { 
          items: [
            { label: 'Home', url: '/' },
            { label: 'Exchange', url: '/exchange' },
            { label: 'About', url: '/about' },
            { label: 'Contact', url: '/contact' },
          ] 
        };
        break;
    }
    
    const title = newWidgetTitle || widgetTypeOptions.find(w => w.value === newWidgetType)?.label || 'New Widget';
    
    addWidget({
      type: newWidgetType,
      title,
      gridColumn: '1 / span 4',
      gridRow: '1 / span 4',
      width: 4,
      height: 4,
      config: widgetConfig,
    });
    
    setNewWidgetType('exchangeRates');
    setNewWidgetTitle('');
    onOpenChange(false);
    
    toast({
      title: "Widget added",
      description: `A new ${title} widget has been added to the canvas.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-exchange-blue hover:bg-exchange-lightblue">
          <Plus size={16} className="mr-2" />
          Add Widget
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Widget</DialogTitle>
          <DialogDescription>
            Select the type of widget you want to add to your canvas.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="widget-type">Widget Type</Label>
            <Select 
              value={newWidgetType} 
              onValueChange={(value) => setNewWidgetType(value as WidgetType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select widget type" />
              </SelectTrigger>
              <SelectContent>
                {widgetTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {option.icon}
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="widget-title">Widget Title (Optional)</Label>
            <Input
              id="widget-title"
              value={newWidgetTitle}
              onChange={(e) => setNewWidgetTitle(e.target.value)}
              placeholder="Enter a custom title"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddWidget} className="bg-exchange-blue hover:bg-exchange-lightblue">
            Add Widget
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;
