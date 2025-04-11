
import React from "react";
import { Widget, useCanvas } from "@/context/CanvasContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ConverterSettingsProps {
  widget: Widget;
}

const ConverterSettings = ({ widget }: ConverterSettingsProps) => {
  const { updateWidget } = useCanvas();
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Default From Currency</Label>
        <Select
          value={widget.config?.fromCurrency}
          onValueChange={(value) => updateWidget(widget.id, {
            config: { ...widget.config, fromCurrency: value }
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
            <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
            <SelectItem value="XMR">Monero (XMR)</SelectItem>
            <SelectItem value="LTC">Litecoin (LTC)</SelectItem>
            <SelectItem value="USD">US Dollar (USD)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Default To Currency</Label>
        <Select
          value={widget.config?.toCurrency}
          onValueChange={(value) => updateWidget(widget.id, {
            config: { ...widget.config, toCurrency: value }
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
            <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
            <SelectItem value="XMR">Monero (XMR)</SelectItem>
            <SelectItem value="LTC">Litecoin (LTC)</SelectItem>
            <SelectItem value="USD">US Dollar (USD)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ConverterSettings;
