
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowLeftRight, Menu as MenuIcon, Layout } from "lucide-react";

const widgetTypeOptions = [
  { value: 'exchangeRates', label: 'Exchange Rates', icon: <DollarSign size={16} /> },
  { value: 'converter', label: 'Currency Converter', icon: <ArrowLeftRight size={16} /> },
  { value: 'transaction', label: 'Transaction Form', icon: <Layout size={16} /> },
  // { value: 'menu', label: 'Navigation Menu', icon: <MenuIcon size={16} /> },
  { value: 'form', label: 'Contact Form', icon: <Layout size={16} /> },
];

const WidgetProperties = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Widget Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Select a widget on the canvas to edit its properties, or add a new widget with the "Add Widget" button.
        </p>
        
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-medium">Available Widgets:</h3>
          <div className="space-y-2">
            {widgetTypeOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-2 p-2 bg-secondary rounded-md">
                {option.icon}
                <span className="text-sm">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WidgetProperties;
