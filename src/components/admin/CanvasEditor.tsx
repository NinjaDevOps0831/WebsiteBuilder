
import { useState, useEffect, useRef } from "react";
import { useCanvas } from "@/context/CanvasContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Import refactored components
import CanvasGrid from "./canvas/CanvasGrid";
import AddWidgetDialog from "./canvas/AddWidgetDialog";
import WidgetEditor from "./canvas/WidgetEditor";
import WidgetProperties from "./canvas/WidgetProperties";

const CanvasEditor = () => {
  const { widgets, selectedWidget, updateWidget, currentPageId, pages } = useCanvas();
  const [isAddingWidget, setIsAddingWidget] = useState(false);
  const widgetsRef = useRef(widgets);

  useEffect(() => {  
    widgetsRef.current = widgets;
  }, [widgets]);  

  const selectedWidgetData = widgets.find(w => w.id === selectedWidget);
  const currentPage = pages.find(p => p.id === currentPageId);

  // Enhanced widget dropping logic to preserve other widgets' positions
  const handleDropWidget = (item: { id: string }, position: { column: number, row: number }) => {
    const widget = widgetsRef.current.find(w => w.id === item.id);
    if (!widget) return;

    // Check if the target position would cause the widget to overflow the grid
    const widthMatch = widget.gridColumn.match(/span (\d+)/);
    const heightMatch = widget.gridRow.match(/span (\d+)/);
    const width = widthMatch ? parseInt(widthMatch[1]) : 4;
    const height = heightMatch ? parseInt(heightMatch[1]) : 4;
    
    // Adjust if widget would overflow
    const adjustedColumn = Math.min(position.column, 13 - width);
    const adjustedRow = Math.min(position.row, 13 - height);
    
    // Check for widget overlap
    const wouldOverlap = widgets.some(w => {
      if (w.id === item.id) return false; // Skip the widget being moved
      
      // Extract grid data
      const wColStart = parseInt(w.gridColumn.split('/')[0].trim());
      const wColSpan = parseInt(w.gridColumn.match(/span\s+(\d+)/)?.[1] || '1');
      const wRowStart = parseInt(w.gridRow.split('/')[0].trim());
      const wRowSpan = parseInt(w.gridRow.match(/span\s+(\d+)/)?.[1] || '1');
      
      // Check for rectangle intersection
      return (
        adjustedColumn < wColStart + wColSpan &&
        adjustedColumn + width > wColStart &&
        adjustedRow < wRowStart + wRowSpan &&
        adjustedRow + height > wRowStart
      );
    });
    
    if (wouldOverlap) {
      toast({
        title: "Position conflict",
        description: "This position overlaps with another widget. Try a different position.",
        variant: "destructive"
      });
      return;
    }
    
    // Update the widget position
    const newGridColumn = `${adjustedColumn} / span ${width}`;
    const newGridRow = `${adjustedRow} / span ${height}`;
    
    updateWidget(item.id, {
      gridColumn: newGridColumn,
      gridRow: newGridRow,
    });

    toast({
      title: "Widget moved",
      description: `${widget.title} has been moved to a new position.`,
    });
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Canvas Editor</h2>
            {/* <p className="text-muted-foreground">
              {currentPage ? `Editing layout for: ${currentPage.title}` : 'Drag and position widgets on your exchange website'}
            </p> */}
          </div>
          <AddWidgetDialog 
            isOpen={isAddingWidget} 
            onOpenChange={setIsAddingWidget} 
          />
        </div>
        
        <Separator />
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:flex-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Website Canvas</CardTitle>
              </CardHeader>
              <CardContent>
                <CanvasGrid onDropWidget={handleDropWidget} />
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full lg:w-80">
            {selectedWidgetData ? (
              <WidgetEditor widget={selectedWidgetData} />
            ) : (
              <WidgetProperties />
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default CanvasEditor;
