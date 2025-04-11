
import React from "react";
import { Widget } from "@/context/CanvasContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ExchangeRatesSettings from "../settings/ExchangeRatesSettings";
import ConverterSettings from "../settings/ConverterSettings";
import MenuSettings from "../settings/MenuSettings";

interface SettingsTabProps {
  widget: Widget;
  onUpdateTitle: (title: string) => void;
}

const SettingsTab = ({ widget, onUpdateTitle }: SettingsTabProps) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="widget-title">Widget Title</Label>
        <Input
          id="widget-title"
          value={widget.title}
          onChange={(e) => onUpdateTitle(e.target.value)}
        />
      </div>
      
      {widget.type === 'exchangeRates' && <ExchangeRatesSettings widget={widget} />}
      {widget.type === 'converter' && <ConverterSettings widget={widget} />}
      {widget.type === 'menu' && <MenuSettings widget={widget} />}
    </div>
  );
};

export default SettingsTab;
