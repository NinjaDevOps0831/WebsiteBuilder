
import React from "react";
import { Widget, useCanvas } from "@/context/CanvasContext";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Move } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PositionTabProps {
  widget: Widget;
}

const PositionTab = ({ widget }: PositionTabProps) => {
  const { updateWidget, addWidget, widgets } = useCanvas();
  
  // Get current widget position
  const getGridPosition = () => {
    const colMatch = widget.gridColumn.match(/^(\d+)/);
    const rowMatch = widget.gridRow.match(/^(\d+)/);
    return {
      column: colMatch ? parseInt(colMatch[1]) : 1,
      row: rowMatch ? parseInt(rowMatch[1]) : 1,
    };
  };
  
  const { column, row } = getGridPosition();
  
  // Generate position options for dropdowns
  const generatePositionOptions = (max: number) => {
    const options = [];
    for (let i = 1; i <= max; i++) {
      options.push(i);
    }
    return options;
  };
  
  const handleColumnChange = (value: string) => {
    const newColumn = parseInt(value);
    updateWidget(widget.id, {
      gridColumn: `${newColumn} / span ${widget.width}`
    });
    
    toast({
      title: "Widget moved",
      description: `${widget.title} has been repositioned.`,
    });
  };
  
  const handleRowChange = (value: string) => {
    const newRow = parseInt(value);
    updateWidget(widget.id, {
      gridRow: `${newRow} / span ${widget.height}`
    });
    
    toast({
      title: "Widget moved",
      description: `${widget.title} has been repositioned.`,
    });
  };
  
  const handleDuplicate = () => {
    const duplicate = { ...widget };
    duplicate.id = `${duplicate.id}-copy-${Date.now()}`;
    duplicate.title = `${duplicate.title} (Copy)`;
    
    const colMatch = duplicate.gridColumn.match(/^(\d+)/);
    const startCol = colMatch ? parseInt(colMatch[1]) : 1;
    const newStartCol = (startCol + duplicate.width <= 9) ? startCol + duplicate.width : 1;
    
    duplicate.gridColumn = `${newStartCol} / span ${duplicate.width}`;
    
    addWidget(duplicate);
    
    toast({
      title: "Widget duplicated",
      description: "A copy of the widget has been created.",
    });
  };
  
  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label>Position</Label>
        <p className="text-sm text-muted-foreground mb-3">
          Set the position or drag the widget handle (grip icon) to reposition it on the canvas.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="column-position">Column Position</Label>
          <Select 
            value={column.toString()}
            onValueChange={handleColumnChange}
          >
            <SelectTrigger id="column-position">
              <SelectValue placeholder="Column" />
            </SelectTrigger>
            <SelectContent>
              {generatePositionOptions(12 - widget.width + 1).map((pos) => (
                <SelectItem key={`col-${pos}`} value={pos.toString()}>
                  Column {pos}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="row-position">Row Position</Label>
          <Select 
            value={row.toString()}
            onValueChange={handleRowChange}
          >
            <SelectTrigger id="row-position">
              <SelectValue placeholder="Row" />
            </SelectTrigger>
            <SelectContent>
              {generatePositionOptions(12 - widget.height + 1).map((pos) => (
                <SelectItem key={`row-${pos}`} value={pos.toString()}>
                  Row {pos}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="widget-width">Width (Grid Columns)</Label>
        <Select 
          value={widget.width.toString()}
          onValueChange={(value) => {
            const width = parseInt(value);
            const colMatch = widget.gridColumn.match(/^(\d+)/);
            const startCol = colMatch ? parseInt(colMatch[1]) : 1;
            updateWidget(widget.id, {
              width,
              gridColumn: `${startCol} / span ${width}`
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select width" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 column</SelectItem>
            <SelectItem value="2">2 columns</SelectItem>
            <SelectItem value="3">3 columns</SelectItem>
            <SelectItem value="4">4 columns</SelectItem>
            <SelectItem value="6">6 columns</SelectItem>
            <SelectItem value="8">8 columns</SelectItem>
            <SelectItem value="12">12 columns (full width)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="widget-height">Height (Grid Rows)</Label>
        <Select
          value={widget.height.toString()}
          onValueChange={(value) => {
            const height = parseInt(value);
            const rowMatch = widget.gridRow.match(/^(\d+)/);
            const startRow = rowMatch ? parseInt(rowMatch[1]) : 1;
            updateWidget(widget.id, {
              height,
              gridRow: `${startRow} / span ${height}`
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select height" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 row</SelectItem>
            <SelectItem value="2">2 rows</SelectItem>
            <SelectItem value="3">3 rows</SelectItem>
            <SelectItem value="4">4 rows</SelectItem>
            <SelectItem value="6">6 rows</SelectItem>
            <SelectItem value="8">8 rows</SelectItem>
            <SelectItem value="12">12 rows (full height)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="pt-2">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleDuplicate}
        >
          <Copy size={16} className="mr-2" />
          Duplicate Widget
        </Button>
      </div>
    </div>
  );
};

export default PositionTab;
