
import React from "react";
import { Widget, useCanvas } from "@/context/CanvasContext";
import { Label } from "@/components/ui/label";

interface ExchangeRatesSettingsProps {
  widget: Widget;
}

const ExchangeRatesSettings = ({ widget }: ExchangeRatesSettingsProps) => {
  const { updateWidget } = useCanvas();
  
  return (
    <div className="space-y-2">
      <Label>Displayed Currencies</Label>
      <div className="grid grid-cols-2 gap-2">
        {['BTC', 'ETH', 'XMR', 'LTC', 'DOGE', 'SOL'].map((currency) => (
          <div key={currency} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`currency-${currency}`}
              checked={widget.config?.currencies.includes(currency)}
              onChange={(e) => {
                const currencies = e.target.checked
                  ? [...(widget.config?.currencies || []), currency]
                  : widget.config?.currencies.filter((c: string) => c !== currency);
                
                updateWidget(widget.id, {
                  config: { ...widget.config, currencies }
                });
              }}
              className="form-checkbox h-4 w-4"
            />
            <label htmlFor={`currency-${currency}`} className="text-sm">
              {currency}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExchangeRatesSettings;
