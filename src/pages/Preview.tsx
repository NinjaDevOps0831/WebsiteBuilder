
import React from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Preview: React.FC = () => {
  const { elements, colorScheme, selectedTemplate, templates } = useBuilder();
  const navigate = useNavigate();
  
  // Find the selected template
  const template = templates.find(t => t.id === selectedTemplate);
  const hasJS = template?.hasJS !== false;

  // Generate HTML content from elements
  const generateHtmlContent = () => {
    return elements.map(el => {
      // Position styles
      const posStyle = `position:absolute;left:${el.position.x}px;top:${el.position.y}px;width:${el.size.width}px;height:${el.size.height}px;`;
      
      // Appearance styles
      const appearanceStyle = Object.entries(el.styles)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`)
        .join(';');
      
      const style = `${posStyle}${appearanceStyle}`;
      
      // Generate element HTML based on type
      switch (el.type) {
        case "button":
          return `<button style="${style}" class="preview-element">${el.content}</button>`;
        
        case "input":
          return `<input type="text" placeholder="${el.attributes?.placeholder || ''}" style="${style}" class="preview-element" />`;
        
        case "text":
          return `<div style="${style}" class="preview-element">${el.content}</div>`;
        
        case "number":
          return `<input type="number" style="${style}" class="preview-element" />`;
        
        case "list":
          const listOptions = el.options?.map(option => `<option>${option}</option>`).join('') || 
            `<option>Item 1</option><option>Item 2</option><option>Item 3</option>`;
          return `<select style="${style}" class="preview-element">${listOptions}</select>`;
        
        case "combo":
          const comboOptions = el.options?.map(option => `<option>${option}</option>`).join('') || 
            `<option>Option 1</option><option>Option 2</option><option>Option 3</option>`;
          return `<select style="${style}" class="preview-element">${comboOptions}</select>`;
        
        case "exchangeWidget":
          return `
            <div style="${style}" class="preview-element exchange-widget">
              <div style="font-weight:bold;text-align:center;margin-bottom:8px;">Exchange Widget</div>
              <div style="display:flex;gap:8px;margin-bottom:8px;">
                <input type="text" placeholder="Amount" style="width:50%;padding:4px;border:1px solid #ccc;border-radius:4px;" />
                <select style="width:50%;padding:4px;border:1px solid #ccc;border-radius:4px;">
                  <option>BTC</option>
                  <option>ETH</option>
                  <option>USD</option>
                </select>
              </div>
              <div style="display:flex;gap:8px;margin-bottom:8px;">
                <input type="text" placeholder="Receive" style="width:50%;padding:4px;border:1px solid #ccc;border-radius:4px;" />
                <select style="width:50%;padding:4px;border:1px solid #ccc;border-radius:4px;">
                  <option>ETH</option>
                  <option>BTC</option>
                  <option>USD</option>
                </select>
              </div>
              <button style="margin-top:8px;background-color:${colorScheme.primary};color:white;border-radius:4px;padding:4px;width:100%;">Exchange Now</button>
            </div>
          `;
        
        default:
          return `<div style="${style}" class="preview-element">Unknown element</div>`;
      }
    }).join('\n');
  };

  // Create a complete HTML document
  const generateFullHtml = () => {
    const content = generateHtmlContent();
    
    // Base styles for the preview
    const baseStyles = `
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 0;
        padding: 0;
        background-color: ${colorScheme.background};
        color: ${colorScheme.text};
      }
      .preview-container {
        position: relative;
        min-height: 100vh;
      }
      .preview-element {
        font-size: 14px;
      }
      .exchange-widget {
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      button.preview-element {
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      input.preview-element, select.preview-element {
        border: 1px solid #ddd;
        padding: 6px 10px;
      }
    `;
    
    // Prepare HTML based on template type (JS or non-JS)
    const baseHtml = hasJS ? 
      `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Exchange Site Preview</title>
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="preview-container">
          ${content}
        </div>
        <script>
          // Basic functionality for the exchange widget
          document.addEventListener('DOMContentLoaded', function() {
            // Simplified example of exchange widget functionality
            const exchangeWidgets = document.querySelectorAll('.exchange-widget');
            exchangeWidgets.forEach(widget => {
              const button = widget.querySelector('button');
              if (button) {
                button.addEventListener('click', function() {
                  alert('Exchange API would be called here');
                });
              }
            });
          });
        </script>
      </body>
      </html>` : 
      `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Exchange Site Preview (No JavaScript)</title>
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="preview-container">
          ${content}
        </div>
      </body>
      </html>`;
    
    // Apply the template if available
    if (template && template.template) {
      return template.template.replace('{{content}}', content);
    }
    
    return baseHtml;
  };

  const htmlContent = generateFullHtml();
  
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-800">Site Preview</h1>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <Button 
            onClick={() => navigate("/admin")}
          >
            Back to Admin
          </Button>
        </div>
      </header>
      
      <div className="flex-grow relative">
        <iframe
          title="Site Preview"
          srcDoc={htmlContent}
          className="w-full h-full border-0"
          sandbox={hasJS ? "allow-scripts" : ""}
        />
      </div>
      
      <footer className="bg-white border-t border-gray-200 py-3 px-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Template: {template?.name || "Custom"} | 
            {hasJS ? " JavaScript Enabled" : " No JavaScript"}
          </div>
          <Button
            onClick={() => {
              const blob = new Blob([htmlContent], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'exchange-site.html';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            Download HTML
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Preview;
