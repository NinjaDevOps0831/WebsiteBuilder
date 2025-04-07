
import React from "react";
import { WidgetElement } from "@/contexts/BuilderContext";
import DraggableElement from "./DraggableElement";
import { useBuilder } from "@/contexts/BuilderContext";

interface BuilderCanvasProps {
  elements: WidgetElement[];
  selectedElement: string | null;
  onSelectElement: (id: string | null) => void;
}

const BuilderCanvas: React.FC<BuilderCanvasProps> = ({
  elements,
  selectedElement,
  onSelectElement,
}) => {
  const { colorScheme, gridSize, showGrid } = useBuilder();

  // Generate grid cells
  const gridCells = [];
  const cellWidth = gridSize; // Width of each grid cell in pixels
  const cellHeight = gridSize; // Height of each grid cell in pixels
  const canvasWidth = Math.floor(100 * 20 / gridSize); // Number of cells horizontally based on grid size
  const canvasHeight = Math.floor(25 * 20 / gridSize); // Number of cells vertically based on grid size

  if (showGrid) {
    for (let y = 0; y < canvasHeight; y++) {
      for (let x = 0; x < canvasWidth; x++) {
        gridCells.push(
          <div
            key={`cell-${x}-${y}`}
            className="absolute border border-gray-200 opacity-25"
            style={{
              left: x * cellWidth,
              top: y * cellHeight,
              width: cellWidth,
              height: cellHeight,
            }}
          />
        );
      }
    }
  }

  return (
    <div 
      className="relative border border-dashed border-gray-300 rounded-lg overflow-hidden"
      style={{ 
        height: "500px", 
        width: "100%", 
        backgroundColor: colorScheme.background 
      }}
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          onSelectElement(null);
        }
      }}
    >
      {/* Grid overlay */}
      {showGrid && gridCells}

      {elements.map((element) => (
        <DraggableElement
          key={element.id}
          element={element}
          isSelected={element.id === selectedElement}
          onClick={() => onSelectElement(element.id)}
          gridSize={gridSize}
        />
      ))}

      {elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <p>Drag elements here to build your page</p>
        </div>
      )}
    </div>
  );
};

export default BuilderCanvas;
