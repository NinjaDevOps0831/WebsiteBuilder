
import React, { useRef } from "react";
import { useCanvas } from "@/context/CanvasContext";
import GridCell from "./GridCell";
import WidgetComponent from "./WidgetComponent";

interface CanvasGridProps {
  onDropWidget: (item: { id: string }, gridPosition: { column: number, row: number }) => void;
}

const CanvasGrid = ({ onDropWidget }: CanvasGridProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { widgets, selectedWidget, selectWidget, template } = useCanvas();
  
  // Create an array of grid cells
  const gridCells = [];
  for (let row = 1; row <= 12; row++) {
    for (let col = 1; col <= 12; col++) {
      gridCells.push({ column: col, row });
    }
  }
  
  // Check if a cell is occupied by any widget
  const isCellOccupied = (col: number, row: number) => {
    return widgets.some((widget) => {
      // Extract grid information from widget
      const colStart = parseInt(widget.gridColumn.split('/')[0].trim());
      const colSpan = parseInt(widget.gridColumn.match(/span\s+(\d+)/)?.[1] || '1');
      const rowStart = parseInt(widget.gridRow.split('/')[0].trim());
      const rowSpan = parseInt(widget.gridRow.match(/span\s+(\d+)/)?.[1] || '1');
      
      // Check if the cell falls within this widget's area
      return (
        col >= colStart && 
        col < colStart + colSpan && 
        row >= rowStart && 
        row < rowStart + rowSpan
      );
    });
  };

  return (
    <div 
      ref={canvasRef}
      className={`grid-canvas ${template.className} relative`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(12, minmax(30px, auto))',
        gap: '4px',
        position: 'relative',
        minHeight: '600px',
        backgroundColor: 'var(--background)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '8px',
      }}
      onClick={() => selectWidget(null)}
    >
      {/* Render grid cells first (as a background) */}
      {gridCells.map((cell, index) => (
        <GridCell 
          key={`cell-${index}`} 
          column={cell.column} 
          row={cell.row} 
          onDrop={onDropWidget}
          isOccupied={isCellOccupied(cell.column, cell.row)}
        />
      ))}
      
      {/* Render widgets on top of the grid */}
      {widgets.map((widget) => (
        <WidgetComponent 
          key={widget.id} 
          widget={widget} 
          isSelected={widget.id === selectedWidget} 
          onDrop={onDropWidget}
        />
      ))}
    </div>
  );
};

export default CanvasGrid;
