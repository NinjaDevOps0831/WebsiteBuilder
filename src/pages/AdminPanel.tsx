
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageBuilder from "@/components/admin/PageBuilder";
import TemplateSelector from "@/components/admin/TemplateSelector";
import ColorSchemeEditor from "@/components/admin/ColorSchemeEditor";
import UploadTemplate from "@/components/admin/UploadTemplate";
import SavedTemplates from "@/components/admin/SavedTemplates";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("builder");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-800">ExchBuilder Admin</h1>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <Button 
            onClick={() => navigate("/preview")}
          >
            Preview Site
          </Button>
        </div>
      </header>
      
      <div className="flex-grow p-6">
        <Tabs 
          defaultValue="builder" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="builder">Page Builder</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="colors">Color Scheme</TabsTrigger>
            <TabsTrigger value="upload">Upload Template</TabsTrigger>
            <TabsTrigger value="saved">Saved Pages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="builder" className="p-4 bg-white rounded-lg shadow">
            <PageBuilder />
          </TabsContent>
          
          <TabsContent value="templates" className="p-4 bg-white rounded-lg shadow">
            <TemplateSelector />
          </TabsContent>
          
          <TabsContent value="colors" className="p-4 bg-white rounded-lg shadow">
            <ColorSchemeEditor />
          </TabsContent>
          
          <TabsContent value="upload" className="p-4 bg-white rounded-lg shadow">
            <UploadTemplate />
          </TabsContent>
          
          <TabsContent value="saved" className="p-4 bg-white rounded-lg shadow">
            <SavedTemplates />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
