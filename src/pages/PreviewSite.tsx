
import { useCanvas, Widget } from "@/context/CanvasContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface WidgetRendererProps {
  widget: Widget;
  colorScheme: any;
}

const WidgetRenderer = ({ widget, colorScheme }: WidgetRendererProps) => {
  let widgetContent;
  
  const widgetStyle = {
    backgroundColor: colorScheme.secondary,
    color: colorScheme.text,
    borderRadius: '0.5rem',
    padding: '1rem',
    gridColumn: widget.gridColumn,
    gridRow: widget.gridRow,
  };
  
  switch (widget.type) {
    case 'exchangeRates':
      widgetContent = (
        <div>
          <h3 style={{ color: colorScheme.text, marginBottom: '0.5rem', fontWeight: 'bold' }}>
            {widget.title}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {widget.config?.currencies.map((currency: string) => (
              <div key={currency} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{currency}</span>
                <span style={{ color: colorScheme.accent }}>
                  $
                  {parseFloat(
                    (Math.random() * (50000 - 100) + 100).toFixed(2)
                  ).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
      break;
    case 'converter':
      widgetContent = (
        <div>
          <h3 style={{ color: colorScheme.text, marginBottom: '0.5rem', fontWeight: 'bold' }}>
            {widget.title}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                defaultValue="1.0"
                style={{
                  padding: '0.5rem',
                  background: colorScheme.background,
                  color: colorScheme.text,
                  border: `1px solid ${colorScheme.text}40`,
                  borderRadius: '0.25rem',
                  width: '100px',
                }}
              />
              <select
                defaultValue={widget.config?.fromCurrency}
                style={{
                  padding: '0.5rem',
                  background: colorScheme.background,
                  color: colorScheme.text,
                  border: `1px solid ${colorScheme.text}40`,
                  borderRadius: '0.25rem',
                  width: '100px',
                }}
              >
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
                <option value="USD">USD</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10l5 5 5-5"></path>
                <path d="M7 14l5-5 5 5"></path>
              </svg>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                defaultValue="32,456.78"
                readOnly
                style={{
                  padding: '0.5rem',
                  background: `${colorScheme.background}80`,
                  color: colorScheme.text,
                  border: `1px solid ${colorScheme.text}40`,
                  borderRadius: '0.25rem',
                  width: '100px',
                }}
              />
              <select
                defaultValue={widget.config?.toCurrency}
                style={{
                  padding: '0.5rem',
                  background: colorScheme.background,
                  color: colorScheme.text,
                  border: `1px solid ${colorScheme.text}40`,
                  borderRadius: '0.25rem',
                  width: '100px',
                }}
              >
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
                <option value="USD">USD</option>
              </select>
            </div>
            
            <button
              style={{
                padding: '0.5rem 1rem',
                background: colorScheme.primary,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '0.25rem',
                marginTop: '0.5rem',
                cursor: 'pointer',
              }}
            >
              Convert
            </button>
          </div>
        </div>
      );
      break;
    case 'transaction':
      widgetContent = (
        <div>
          <h3 style={{ color: colorScheme.text, marginBottom: '0.5rem', fontWeight: 'bold' }}>
            {widget.title}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              <label style={{ color: colorScheme.text, fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
                Send
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Amount"
                  style={{
                    padding: '0.5rem',
                    background: colorScheme.background,
                    color: colorScheme.text,
                    border: `1px solid ${colorScheme.text}40`,
                    borderRadius: '0.25rem',
                    flexGrow: 1,
                  }}
                />
                <select
                  style={{
                    padding: '0.5rem',
                    background: colorScheme.background,
                    color: colorScheme.text,
                    border: `1px solid ${colorScheme.text}40`,
                    borderRadius: '0.25rem',
                    width: '100px',
                  }}
                >
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                </select>
              </div>
            </div>
            
            <div>
              <label style={{ color: colorScheme.text, fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
                Destination Address
              </label>
              <input
                type="text"
                placeholder="Enter wallet address"
                style={{
                  padding: '0.5rem',
                  background: colorScheme.background,
                  color: colorScheme.text,
                  border: `1px solid ${colorScheme.text}40`,
                  borderRadius: '0.25rem',
                  width: '100%',
                }}
              />
            </div>
            
            <button
              style={{
                padding: '0.5rem 1rem',
                background: colorScheme.primary,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '0.25rem',
                marginTop: '0.5rem',
                cursor: 'pointer',
              }}
            >
              Send Transaction
            </button>
          </div>
        </div>
      );
      break;
    case 'menu':
      widgetContent = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {widget.config?.items.map((item: {label: string, url: string}, index: number) => (
            <a
              key={index}
              href={item.url}
              style={{ color: colorScheme.text, textDecoration: 'none', padding: '0.5rem 1rem' }}
              onMouseOver={(e) => (e.currentTarget.style.color = colorScheme.primary)}
              onMouseOut={(e) => (e.currentTarget.style.color = colorScheme.text)}
            >
              {item.label}
            </a>
          ))}
        </div>
      );
      break;
    case 'form':
      widgetContent = (
        <div>
          <h3 style={{ color: colorScheme.text, marginBottom: '0.5rem', fontWeight: 'bold' }}>
            {widget.title}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ color: colorScheme.text, fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                style={{
                  padding: '0.5rem',
                  background: colorScheme.background,
                  color: colorScheme.text,
                  border: `1px solid ${colorScheme.text}40`,
                  borderRadius: '0.25rem',
                  width: '100%',
                }}
              />
            </div>
            
            <div>
              <label style={{ color: colorScheme.text, fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="Your email"
                style={{
                  padding: '0.5rem',
                  background: colorScheme.background,
                  color: colorScheme.text,
                  border: `1px solid ${colorScheme.text}40`,
                  borderRadius: '0.25rem',
                  width: '100%',
                }}
              />
            </div>
            
            <div>
              <label style={{ color: colorScheme.text, fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
                Message
              </label>
              <textarea
                placeholder="Your message"
                style={{
                  padding: '0.5rem',
                  background: colorScheme.background,
                  color: colorScheme.text,
                  border: `1px solid ${colorScheme.text}40`,
                  borderRadius: '0.25rem',
                  width: '100%',
                  minHeight: '100px',
                }}
              ></textarea>
            </div>
            
            <button
              style={{
                padding: '0.5rem 1rem',
                background: colorScheme.primary,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
              }}
            >
              Send Message
            </button>
          </div>
        </div>
      );
      break;
    default:
      widgetContent = (
        <div>
          <h3 style={{ color: colorScheme.text, marginBottom: '0.5rem', fontWeight: 'bold' }}>
            {widget.title}
          </h3>
          <p style={{ color: `${colorScheme.text}80` }}>Widget content</p>
        </div>
      );
  }
  
  return (
    <div style={widgetStyle}>
      {widgetContent}
    </div>
  );
};

const PreviewSite = () => {
  const { widgets, template, colorScheme, useJavascript } = useCanvas();
  
  // Apply color scheme to the page
  const pageStyle = {
    backgroundColor: colorScheme.background,
    color: colorScheme.text,
    minHeight: '100vh',
  };
  
  // Create grid style for canvas
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridTemplateRows: 'repeat(12, minmax(50px, auto))',
    gap: '1rem',
    padding: '1rem',
    maxWidth: '1200px',
    margin: '0 auto',
  };
  
  return (
    <div style={pageStyle}>
      {/* Preview header */}
      <div style={{ 
        padding: '1rem', 
        backgroundColor: colorScheme.secondary,
        borderBottom: `1px solid ${colorScheme.text}20`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-1"
          asChild
        >
          <Link to="/admin">
            <ArrowLeft size={16} />
            Back to Admin
          </Link>
        </Button>
        
        <div className="flex items-center gap-4">
          <div style={{ 
            padding: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: colorScheme.background,
            color: colorScheme.text,
            borderRadius: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span 
              style={{ 
                width: '0.75rem', 
                height: '0.75rem', 
                backgroundColor: useJavascript ? '#10B981' : '#EF4444',
                borderRadius: '50%',
                display: 'inline-block',
              }}
            ></span>
            {useJavascript ? 'JavaScript Enabled' : 'No JavaScript Mode'}
          </div>
          
          <div style={{ 
            padding: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: colorScheme.background,
            color: colorScheme.text,
            borderRadius: '0.25rem',
          }}>
            Template: {template.name}
          </div>
        </div>
      </div>
      
      {/* Preview content */}
      <main>
        <div style={gridStyle} className={template.className}>
          {widgets.map((widget) => (
            <WidgetRenderer 
              key={widget.id} 
              widget={widget} 
              colorScheme={colorScheme} 
            />
          ))}
        </div>
      </main>
      
      {/* Preview footer */}
      <footer style={{ 
        padding: '1rem',
        textAlign: 'center',
        color: `${colorScheme.text}80`,
        marginTop: '2rem',
        fontSize: '0.875rem',
      }}>
        <p>Exchange Canvas Builder &copy; 2025</p>
      </footer>
    </div>
  );
};

export default PreviewSite;
