
import React from "react";
import { Widget, useCanvas } from "@/context/CanvasContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Link } from "lucide-react";

interface MenuSettingsProps {
  widget: Widget;
}

const MenuSettings = ({ widget }: MenuSettingsProps) => {
  const { updateWidget, pages } = useCanvas();
  
  return (
    <div className="space-y-2">
      <Label>Menu Items</Label>
      {widget.config?.items.map((item: {label: string, url: string}, index: number) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <Input
            placeholder="Label"
            value={item.label}
            onChange={(e) => {
              const items = [...widget.config.items];
              items[index].label = e.target.value;
              updateWidget(widget.id, {
                config: { ...widget.config, items }
              });
            }}
            className="flex-1"
          />
          <Select
            value={item.url}
            onValueChange={(value) => {
              const items = [...widget.config.items];
              items[index].url = value;
              updateWidget(widget.id, {
                config: { ...widget.config, items }
              });
            }}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select page or enter URL" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="#">No Link (#)</SelectItem>
              {pages.map((page) => (
                <SelectItem key={page.id} value={page.slug}>
                  {page.title}
                </SelectItem>
              ))}
              <SelectItem value="custom">Custom URL</SelectItem>
            </SelectContent>
          </Select>
          {item.url === 'custom' && (
            <Input
              placeholder="https://..."
              value={item.customUrl || ''}
              onChange={(e) => {
                const items = [...widget.config.items];
                items[index].customUrl = e.target.value;
                updateWidget(widget.id, {
                  config: { ...widget.config, items }
                });
              }}
              className="flex-1"
            />
          )}
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => {
          const items = [...(widget.config?.items || []), { label: 'New Item', url: '#' }];
          updateWidget(widget.id, {
            config: { ...widget.config, items }
          });
        }}
      >
        <Plus size={14} className="mr-1" />
        Add Menu Item
      </Button>
    </div>
  );
};

export default MenuSettings;
