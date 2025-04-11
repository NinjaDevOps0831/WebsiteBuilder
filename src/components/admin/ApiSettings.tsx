
import { useState } from "react";
import { useCanvas } from "@/context/CanvasContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Key, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Link as LinkIcon, 
  Network 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ApiSettings = () => {
  const { apiKey, setApiKey, useJavascript, setUseJavascript } = useCanvas();
  const [newApiKey, setNewApiKey] = useState(apiKey);
  const [isTorEnabled, setIsTorEnabled] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [apiStatus, setApiStatus] = useState<'none' | 'valid' | 'invalid'>('none');
  
  const validateApiKey = () => {
    setIsValidating(true);
    
    // Simulate API key validation
    setTimeout(() => {
      setIsValidating(false);
      
      // For demo purposes, we'll assume any non-empty key is valid
      if (newApiKey.trim()) {
        setApiStatus('valid');
        setApiKey(newApiKey);
        toast({
          title: "API key validated",
          description: "Your exch.net API key has been validated and saved.",
        });
      } else {
        setApiStatus('invalid');
        toast({
          title: "Invalid API key",
          description: "Please enter a valid exch.net API key.",
          variant: "destructive",
        });
      }
    }, 1500);
  };
  
  const handleTorToggle = (enabled: boolean) => {
    setIsTorEnabled(enabled);
    
    toast({
      title: enabled ? "Tor support enabled" : "Tor support disabled",
      description: enabled
        ? "Your site will be optimized for .onion domains and Tor network."
        : "Standard web optimizations will be used.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">API & Network Settings</h2>
        <p className="text-muted-foreground">
          Configure API keys and network options for your exchange website
        </p>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="api">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="api">API Configuration</TabsTrigger>
          <TabsTrigger value="network">Network Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api" className="py-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key size={18} />
                exch.net API Key
              </CardTitle>
              <CardDescription>
                Connect your exchange website to the exch.net API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    type="text"
                    value={newApiKey}
                    onChange={(e) => setNewApiKey(e.target.value)}
                    placeholder="Enter your exch.net API key"
                    className="font-mono"
                  />
                  <Button 
                    onClick={validateApiKey}
                    disabled={isValidating}
                    className="bg-exchange-blue hover:bg-exchange-lightblue"
                  >
                    {isValidating ? "Validating..." : "Validate & Save"}
                  </Button>
                </div>
              </div>
              
              {apiStatus === 'valid' && (
                <Alert variant="default" className="bg-green-950/20 border-green-950/30 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>API Key Valid</AlertTitle>
                  <AlertDescription>
                    Your exch.net API key has been validated and will be used for exchange operations.
                  </AlertDescription>
                </Alert>
              )}
              
              {apiStatus === 'invalid' && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Invalid API Key</AlertTitle>
                  <AlertDescription>
                    The API key could not be validated. Please check your key and try again.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="bg-secondary/50 p-4 rounded-md space-y-2">
                <div className="flex items-start gap-2">
                  <Info size={16} className="mt-0.5 text-muted-foreground" />
                  <div>
                    <h4 className="text-sm font-medium">API Key Security</h4>
                    <p className="text-xs text-muted-foreground">
                      Your API key is stored securely and used only for connections to the exch.net API.
                      The key is never exposed to website visitors.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <LinkIcon size={16} className="mt-0.5 text-muted-foreground" />
                  <div>
                    <h4 className="text-sm font-medium">Getting an API Key</h4>
                    <p className="text-xs text-muted-foreground">
                      To get an API key, register at exch.net and generate a key from your account dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network size={18} />
                API Communication Mode
              </CardTitle>
              <CardDescription>
                Configure how your website communicates with the exch.net API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="js-api" className="text-base">JavaScript API Calls</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable direct API calls from the browser using JavaScript
                    </p>
                  </div>
                  <Switch 
                    id="js-api" 
                    checked={useJavascript}
                    onCheckedChange={setUseJavascript}
                  />
                </div>
                
                {!useJavascript && (
                  <Alert className="mt-2 bg-blue-950/20 border-blue-950/30">
                    <Info className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-500">Server-Side Mode Enabled</AlertTitle>
                    <AlertDescription className="text-muted-foreground">
                      With JavaScript disabled, all API calls will be proxied through your backend.
                      This ensures compatibility with non-JS browsers and Tor, but may result in
                      slightly slower updates.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">API Endpoints Used</h3>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>- /api/rates - Gets current exchange rates</p>
                  <p>- /api/convert - Performs currency conversion</p>
                  <p>- /api/transaction - Initiates a transaction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="network" className="py-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network size={18} />
                Tor (.onion) Support
              </CardTitle>
              <CardDescription>
                Configure Tor network compatibility for privacy-focused hosting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="tor-support" className="text-base">Enable Tor Support</Label>
                    <p className="text-sm text-muted-foreground">
                      Optimize your site for use on Tor (.onion) domains
                    </p>
                  </div>
                  <Switch 
                    id="tor-support" 
                    checked={isTorEnabled}
                    onCheckedChange={handleTorToggle}
                  />
                </div>
                
                {isTorEnabled && (
                  <Alert className="mt-2 bg-purple-950/20 border-purple-950/30">
                    <Info className="h-4 w-4 text-purple-500" />
                    <AlertTitle className="text-purple-500">Tor Support Enabled</AlertTitle>
                    <AlertDescription className="text-muted-foreground">
                      Your site will be optimized for Tor with relative URLs, reduced external
                      resources, and server-side API communication. JavaScript will be used
                      sparingly to ensure compatibility with Tor Browser.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Tor Optimization Features</h3>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>- Uses relative URLs for all resources</p>
                  <p>- Avoids external CDNs and third-party resources</p>
                  <p>- Minimizes JavaScript usage when possible</p>
                  <p>- Provides fallback server-rendered content</p>
                  <p>- Optimizes image loading for slower connections</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon size={18} />
                URL Configuration
              </CardTitle>
              <CardDescription>
                Configure URL settings for your exchange website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="base-url">Base URL (Optional)</Label>
                <Input
                  id="base-url"
                  type="text"
                  placeholder="https://yoursite.com or http://yoursite.onion"
                />
                <p className="text-xs text-muted-foreground">
                  The base URL for your site. Leave blank to use relative URLs.
                </p>
              </div>
              
              <div className="bg-secondary/50 p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2">URL Guidelines:</h4>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                  <li>Use relative URLs when possible for better Tor compatibility</li>
                  <li>Avoid hardcoding full URLs in your templates</li>
                  <li>For multiple domains, leave base URL blank and handle at the server level</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiSettings;
