
import React from "react";
import { Widget, useCanvas } from "@/context/CanvasContext";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import PositionTab from "./tabs/PositionTab";
import SettingsTab from "./tabs/SettingsTab";

interface WidgetEditorProps {
  widget: Widget;
}

const WidgetEditor = ({ widget }: WidgetEditorProps) => {
  const { selectWidget, updateWidget } = useCanvas();
  
  const handleCloseWidgetEditor = () => {
    selectWidget(null);
  };

  const handleUpdateTitle = (title: string) => {
    updateWidget(widget.id, { title });
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Edit Widget</CardTitle>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleCloseWidgetEditor}
        >
          <X size={16} />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="position">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="position">Position</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="position">
            <PositionTab widget={widget} />
          </TabsContent>
          
          <TabsContent value="settings">
            <SettingsTab 
              widget={widget} 
              onUpdateTitle={handleUpdateTitle} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WidgetEditor;
