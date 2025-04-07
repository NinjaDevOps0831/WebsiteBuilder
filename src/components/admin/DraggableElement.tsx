
import React from "react";
import { WidgetElement } from "@/contexts/BuilderContext";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface DraggableElementProps {
  element: WidgetElement;
  isSelected: boolean;
  onClick: () => void;
  gridSize: number;
}

const DraggableElement: React.FC<DraggableElementProps> = ({
  element,
  isSelected,
  onClick,
  gridSize,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.id,
  });

  // Calculate the snapped position based on grid
  const snappedPosition = {
    x: Math.round(element.position.x / gridSize) * gridSize,
    y: Math.round(element.position.y / gridSize) * gridSize,
  };

  const style = {
    position: "absolute" as const,
    left: snappedPosition.x,
    top: snappedPosition.y,
    width: element.size.width,
    height: element.size.height,
    transform: CSS.Translate.toString(transform),
    ...element.styles,
    cursor: "move",
  };

  const renderElementContent = () => {
    switch (element.type) {
      case "button":
        return (
          <button
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: element.styles.backgroundColor,
              color: element.styles.color,
              borderRadius: element.styles.borderRadius,
              fontSize: element.styles.fontSize,
              border: "none",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease",
            }}
            className="hover:opacity-90 active:translate-y-0.5"
          >
            {element.content}
          </button>
        );
        
      case "input":
        return (
          <input
            type="text"
            placeholder={element.attributes?.placeholder || ""}
            className="w-full h-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
            style={{
              color: element.styles.color,
              fontSize: element.styles.fontSize,
              borderRadius: element.styles.borderRadius,
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
            }}
            disabled
          />
        );
        
      case "text":
        return (
          <div
            className="w-full h-full flex items-center overflow-hidden"
            style={{
              color: element.styles.color,
              fontSize: element.styles.fontSize,
            }}
          >
            {element.content}
          </div>
        );
        
      case "number":
        return (
          <input
            type="number"
            className="w-full h-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
            style={{
              color: element.styles.color,
              fontSize: element.styles.fontSize,
              borderRadius: element.styles.borderRadius,
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
            }}
            disabled
          />
        );
        
      case "list":
        return (
          <select
            className="w-full h-full px-3 py-2 border rounded appearance-none bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none"
            style={{
              color: element.styles.color,
              fontSize: element.styles.fontSize,
              borderRadius: element.styles.borderRadius,
              backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.7rem top 50%",
              backgroundSize: "0.65rem auto",
            }}
            disabled
          >
            {element.options?.map((option, index) => (
              <option key={index}>{option}</option>
            )) || (
              <>
                <option>Item 1</option>
                <option>Item 2</option>
                <option>Item 3</option>
              </>
            )}
          </select>
        );
        
      case "combo":
        return (
          <select
            className="w-full h-full px-3 py-2 border rounded appearance-none bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none"
            style={{
              color: element.styles.color,
              fontSize: element.styles.fontSize,
              borderRadius: element.styles.borderRadius,
              backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.7rem top 50%",
              backgroundSize: "0.65rem auto",
            }}
            disabled
          >
            {element.options?.map((option, index) => (
              <option key={index}>{option}</option>
            )) || (
              <>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </>
            )}
          </select>
        );
        
      case "exchangeWidget":
        return (
          <div
            className="w-full h-full border rounded bg-white p-3 flex flex-col shadow-sm"
            style={{
              borderRadius: element.styles.borderRadius || "4px",
            }}
          >
            <div className="font-bold text-center mb-2 text-sm" style={{ color: element.styles.color }}>
              Exchange Widget
            </div>
            <div className="flex gap-2 mb-2">
              <input type="text" className="border rounded px-2 py-1 w-1/2 text-sm" placeholder="Amount" disabled />
              <select className="border rounded px-2 py-1 w-1/2 text-sm" disabled>
                <option>BTC</option>
                <option>ETH</option>
                <option>USD</option>
              </select>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="text" className="border rounded px-2 py-1 w-1/2 text-sm" placeholder="Receive" disabled />
              <select className="border rounded px-2 py-1 w-1/2 text-sm" disabled>
                <option>ETH</option>
                <option>BTC</option>
                <option>USD</option>
              </select>
            </div>
            <button className="mt-1 bg-blue-600 text-white rounded py-1 text-sm">Exchange Now</button>
          </div>
        );
      
      default:
        return <div>Unknown element type</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "touch-none select-none",
        isSelected && "ring-2 ring-blue-500 z-10"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      {...attributes}
      {...listeners}
    >
      {renderElementContent()}
    </div>
  );
};

export default DraggableElement;
