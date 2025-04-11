import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Download, Upload, Save, Trash2 } from "lucide-react";
import { useCanvas, Configuration } from "@/context/CanvasContext";
import { 
  fetchWebsiteConfigurations, 
  getWebsiteConfiguration,
  createWebsiteConfiguration, 
  deleteWebsiteConfiguration 
} from "@/api/websiteConfigurationApi";

const SavedPages = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [configurationName, setConfigurationName] = useState("");
  const [configurationDescription, setConfigurationDescription] = useState("");
  const [savedConfigurations, setSavedConfigurations] = useState<Configuration[]>([]);
  const { template, colorScheme, useJavascript, apiKey, pages, currentPageId, configId, setConfigId,  setConfigName, setConfigDescription, loadConfig } = useCanvas();

  // Fetch existing saved configurations
  useEffect(() => {  
    const loadConfigurations = async () => {  
      try {  
        const data = await fetchWebsiteConfigurations();  
        setSavedConfigurations(data);  
      } catch (error) {  
        toast({
          title: "Configurations fetch failed",
          description: "Failed to fetch templates",
          variant: "destructive",
        });
        console.error('Failed to fetch templates:', error);  
      }  
    };  
    
    loadConfigurations();  
  }, []);

  const saveConfiguration = async () => {
    if (!configurationName.trim()) {
      toast({
        title: "Configuration name required",
        description: "Please provide a name for your configuration",
        variant: "destructive",
      });
      return;
    }

    const newConfiguration: Configuration = {
      id: "",
      name: configurationName,
      description: configurationDescription,
      pages,
      currentPageId,
      template,
      colorScheme,
      useJavascript,
      apiKey,
    };
    
    // Set Loading
    setIsSaving(true);

    // Create new configuration  
    // Save to backend  
    createWebsiteConfiguration({
      name: newConfiguration.name,
      description: newConfiguration.description,
      pages: newConfiguration.pages,
      current_page_id: newConfiguration.currentPageId,
      template_type: 'custom',
      color_scheme: newConfiguration.colorScheme,
      is_js_enabled: newConfiguration.useJavascript,
      api_key: newConfiguration.apiKey || "temp-api-key",
    }).then(response => {
      toast({  
        title: "Configuration saved",  
        description: `"${response.name}" has been saved successfully`,  
      });  
      
      // Reset form  
      setConfigurationName("");  
      setConfigurationDescription("");  
      // Set current Configuration
      setConfigId(response.id); 
      setConfigName(response.name);
      setConfigDescription(response.description);

      // Set ID to new Configuration and save
      newConfiguration.id = response.id;
      const updatedConfigurations = [...savedConfigurations, newConfiguration];  
      setSavedConfigurations(updatedConfigurations); 
    }).catch(error => {
      toast({
        title: "Configuration save failed",
        description: `"${configurationName}" saving failed`,
        variant: "destructive",
      });

      console.log(error);
    }).finally(() => {
      setIsSaving(false);
    }); 
  };

  const deleteConfiguration = async (id: string) => {
    const configuration = savedConfigurations.filter(configuration => configuration.id == id)[0];
    // Set Loading
    setIsDeleting(true);
    deleteWebsiteConfiguration(id)
    .then(() => {
      if (id === configId) {
        setConfigId("");
      }
      const updatedConfigurations = savedConfigurations.filter(configuration => configuration.id !== id);
      setSavedConfigurations(updatedConfigurations);
      toast({
        title: "Configuration deleted",
        description: `"${configuration.name}" has been deleted successfully`,
      });
    }).catch(error => {
      toast({
        title: "Configuration delete failed",
        description: `"${configuration.name}" deleting failed`,
        variant: "destructive",
      });

      console.log(error);
    }).finally(() => {
      // Set Loading
      setIsDeleting(false);
    });
  };

  const loadConfiguration = async (id: string) => {
    setIsLoading(true);
    getWebsiteConfiguration(id)
    .then((response) => {
      const newConfiguration: Configuration = {
        id: response.id,
        name: response.name,
        description: response.description,
        pages: response.pages,
        currentPageId: response.current_page_id,
        template: response.template_type,
        colorScheme: response.color_scheme,
        useJavascript: response.is_js_enabled,
        apiKey: response.api_key,
      };

      loadConfig(newConfiguration);
    })
    .catch((error) => {
      toast({
        title: "Configuration loading failed",
        description: "Cofiguration loading failed",
        variant: "destructive",
      });

      console.log(error);
    })
    .finally(() => {
      setIsLoading(false);
    })
  }

  return (
    <div className="space-y-6">
      <div className="prose prose-sm mb-6">
        <h2 className="text-xl font-bold">Page Configuration</h2>
        <p>
          Save your current page design as a configuration or load a previously saved configuration.
        </p>
      </div>

      {/* Save current page as configuration */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-medium">Save Current Page</h3>
          
          <div className="space-y-2">
            <Label htmlFor="configuration-name">Configuration Name</Label>
            <Input
              id="configuration-name"
              value={configurationName}
              onChange={(e) => setConfigurationName(e.target.value)}
              placeholder="My Awesome Configuration"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="configuration-description">Description (Optional)</Label>
            <Textarea
              id="Configuration-description"
              value={configurationDescription}
              onChange={(e) => setConfigurationDescription(e.target.value)}
              placeholder="Description of your configuration"
              rows={2}
            />
          </div>
          
          <Button 
            onClick={saveConfiguration}
            disabled={isSaving}
            className="w-full sm:w-auto gap-2"
          >
            {isSaving ? "Saving..." : (
              <>
                <Save className="w-4 h-4" />
                Save Configuration
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Saved configurations */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Saved Configurations</h3>

        {savedConfigurations.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {savedConfigurations.map((configuration) => (
              <Card key={configuration.id}>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h4 className="font-semibold">{configuration.name}</h4>
                    {configuration.description && (
                      <p className="text-sm mt-1">{configuration.description}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => loadConfiguration(configuration.id)}
                    >
                      {isLoading ? "Loading..." : (
                        <>
                          <Download className="w-3 h-3" />
                          Load
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-700 gap-1"
                      onClick={() => deleteConfiguration(configuration.id)}
                    >
                      {isDeleting ? "Deleting..." : (
                        <>
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-exchange-black rounded-lg">
            <p>No templates saved yet.</p>
            <p className="text-sm">Create and save your first template above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPages;
