
import React from "react";
import { useDrop } from "react-dnd";

interface GridCellProps {
  column: number;
  row: number;
  onDrop: (item: { id: string }, gridPosition: { column: number, row: number }) => void;
  children?: React.ReactNode;
  isOccupied?: boolean;
}

const GridCell = ({ column, row, onDrop, children, isOccupied = false }: GridCellProps) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'WIDGET',
    drop: (item: { id: string }) => onDrop(item, { column, row }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
    canDrop: () => !isOccupied, // Prevent dropping if the cell is already occupied
  }));

  return (
    <div 
      ref={drop}
      className={`grid-cell ${isOver ? 'bg-primary/20' : ''} ${isOccupied ? 'bg-muted/30' : ''}`}
      style={{
        gridColumn: column,
        gridRow: row,
        minHeight: '20px',
        border: isOver ? '1px dashed hsl(var(--primary))' : 'none', 
        transition: 'all 0.2s ease',
        background: isOver ? 'rgba(var(--primary), 0.1)' : isOccupied ? 'rgba(var(--muted), 0.1)' : 'transparent',
        cursor: isOccupied ? 'not-allowed' : 'default',
      }}
    >
      {children}
    </div>
  );
};

export default GridCell;
