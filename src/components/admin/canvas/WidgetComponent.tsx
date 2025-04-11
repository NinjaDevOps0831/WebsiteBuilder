
import React from "react";
import { useDrag } from "react-dnd";
import { Widget, useCanvas } from "@/context/CanvasContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { GripVertical, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeftRight } from "lucide-react";

interface WidgetComponentProps {
  widget: Widget;
  isSelected: boolean;
  onDrop: (item: { id: string }, gridPosition: { column: number, row: number }) => void;
}

const WidgetComponent = ({ widget, isSelected, onDrop }: WidgetComponentProps) => {
  const { selectWidget, removeWidget } = useCanvas();
  
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'WIDGET',
    item: { id: widget.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  
  const handleSelectWidget = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectWidget(widget.id);
  };
  
  const handleRemoveWidget = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeWidget(widget.id);
    toast({
      title: "Widget removed",
      description: "The widget has been removed from the canvas.",
    });
  };

  const getGridPosition = () => {
    const colMatch = widget.gridColumn.match(/^(\d+)/);
    const rowMatch = widget.gridRow.match(/^(\d+)/);
    return {
      column: colMatch ? parseInt(colMatch[1]) : 1,
      row: rowMatch ? parseInt(rowMatch[1]) : 1,
    };
  };

  const { column, row } = getGridPosition();

  return (
    <div 
      ref={preview}
      className={`draggable-widget ${isSelected ? 'widget-active' : ''} ${isDragging ? 'opacity-50' : ''}`}
      style={{
        gridColumn: widget.gridColumn,
        gridRow: widget.gridRow,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative',
        background: 'var(--background)',
        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        transition: 'all 0.2s ease',
        zIndex: isSelected ? 10 : 1,
      }}
      onClick={handleSelectWidget}
    >
      <div className="p-1 bg-muted flex items-center justify-between">
        <div ref={drag} className="flex items-center gap-1 text-xs cursor-grab">
          <GripVertical size={12} />
          <span>{widget.title}</span>
        </div>
        <div className="flex items-center gap-1">
          {isSelected && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRemoveWidget}
              className="h-5 w-5 text-destructive hover:text-destructive"
            >
              <Trash2 size={12} />
            </Button>
          )}
        </div>
      </div>
      <WidgetContent widget={widget} />
    </div>
  );
};

const WidgetContent = ({ widget }: { widget: Widget }) => {
  switch (widget.type) {
    case 'exchangeRates':
      return (
        <div className="p-3">
          <h3 className="text-sm font-medium mb-2">Current Exchange Rates</h3>
          <div className="space-y-2">
            {widget.config?.currencies.map((currency: string) => (
              <div key={currency} className="flex justify-between items-center">
                <span>{currency}</span>
                <span className="text-exchange-green">
                  $
                  {parseFloat(
                    (Math.random() * (50000 - 100) + 100).toFixed(2)
                  ).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    case 'converter':
      return (
        <div className="p-3">
          <h3 className="text-sm font-medium mb-2">Convert Currency</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input placeholder="1.0" className="w-24" />
              <Select defaultValue={widget.config?.fromCurrency}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="From" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-center my-1">
              <ArrowLeftRight size={16} />
            </div>
            <div className="flex items-center gap-2">
              <Input placeholder="32,456.78" className="w-24" readOnly />
              <Select defaultValue={widget.config?.toCurrency}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="To" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );
    case 'menu':
      return (
        <div className="p-3">
          <div className="flex justify-between items-center">
            {widget.config?.items.map((item: {label: string, url: string}, index: number) => (
              <span key={index} className="text-sm font-medium">{item.label}</span>
            ))}
          </div>
        </div>
      );
    default:
      return (
        <div className="p-3">
          <h3 className="text-sm font-medium mb-2">{widget.title}</h3>
          <p className="text-xs text-muted-foreground">Widget content preview</p>
        </div>
      );
  }
};

export default WidgetComponent;
