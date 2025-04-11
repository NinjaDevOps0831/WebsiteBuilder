
import { useState } from "react";
import { useCanvas } from "@/context/CanvasContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { File, FilePlus, Trash2, Edit2 } from "lucide-react";

const PageEditor = () => {
  const { pages, addPage, updatePage, removePage, setCurrentPage, currentPageId } = useCanvas();
  
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [newPageIsHomepage, setNewPageIsHomepage] = useState(false);
  
  const resetForm = () => {
    setNewPageTitle("");
    setNewPageSlug("");
    setNewPageIsHomepage(false);
  };
  
  const handleAddPage = () => {
    // Validate
    if (!newPageTitle || !newPageSlug) {
      toast({
        title: "Invalid page details",
        description: "Please provide both a title and a slug for the page.",
        variant: "destructive"
      });
      return;
    }
    
    // Make sure slug starts with /
    const formattedSlug = newPageSlug.startsWith('/') ? newPageSlug : `/${newPageSlug}`;
    
    // If setting a new homepage, unset the old one
    if (newPageIsHomepage) {
      pages.forEach(page => {
        if (page.isHomepage) {
          updatePage(page.id, { isHomepage: false });
        }
      });
    }
    
    // Add the page
    addPage({
      title: newPageTitle,
      slug: formattedSlug,
      isHomepage: newPageIsHomepage,
    });
    
    toast({
      title: "Page added",
      description: `The page "${newPageTitle}" has been added successfully.`
    });
    
    resetForm();
    setIsAddingPage(false);
  };
  
  const handleEditPage = () => {
    if (!editingPageId) return;
    
    // Validate
    if (!newPageTitle || !newPageSlug) {
      toast({
        title: "Invalid page details",
        description: "Please provide both a title and a slug for the page.",
        variant: "destructive"
      });
      return;
    }
    
    // Make sure slug starts with /
    const formattedSlug = newPageSlug.startsWith('/') ? newPageSlug : `/${newPageSlug}`;
    
    // If setting a new homepage, unset the old one
    if (newPageIsHomepage) {
      pages.forEach(page => {
        if (page.id !== editingPageId && page.isHomepage) {
          updatePage(page.id, { isHomepage: false });
        }
      });
    }
    
    // Update the page
    updatePage(editingPageId, {
      title: newPageTitle,
      slug: formattedSlug,
      isHomepage: newPageIsHomepage,
    });
    
    toast({
      title: "Page updated",
      description: `The page "${newPageTitle}" has been updated successfully.`
    });
    
    resetForm();
    setEditingPageId(null);
  };
  
  const handleDeletePage = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;
    
    // Don't allow deleting the homepage
    if (page.isHomepage) {
      toast({
        title: "Cannot delete homepage",
        description: "The homepage cannot be deleted. Please set another page as the homepage first.",
        variant: "destructive"
      });
      return;
    }
    
    removePage(pageId);
    
    toast({
      title: "Page deleted",
      description: `The page "${page.title}" has been deleted.`
    });
  };
  
  const startEditPage = (page: typeof pages[0]) => {
    setEditingPageId(page.id);
    setNewPageTitle(page.title);
    setNewPageSlug(page.slug);
    setNewPageIsHomepage(page.isHomepage);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Page Editor</h2>
          <p className="text-muted-foreground">
            Create and manage pages for your exchange website
          </p>
        </div>
        <Dialog open={isAddingPage} onOpenChange={setIsAddingPage}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <FilePlus size={16} />
              Add New Page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Page</DialogTitle>
              <DialogDescription>
                Create a new page for your exchange website. Each page can have its own set of widgets.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pageTitle" className="text-right">Title</Label>
                <Input
                  id="pageTitle"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="Home, About, Contact, etc."
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pageSlug" className="text-right">URL Path</Label>
                <Input
                  id="pageSlug"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="/about, /contact, /pricing, etc."
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isHomepage" className="text-right">Set as Homepage</Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="isHomepage"
                    checked={newPageIsHomepage}
                    onCheckedChange={setNewPageIsHomepage}
                  />
                  <Label htmlFor="isHomepage" className="text-sm text-muted-foreground">
                    This will be the default landing page
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsAddingPage(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddPage}>Add Page</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Page Dialog */}
        <Dialog open={!!editingPageId} onOpenChange={(open) => !open && setEditingPageId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Page</DialogTitle>
              <DialogDescription>
                Update the details for this page.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editPageTitle" className="text-right">Title</Label>
                <Input
                  id="editPageTitle"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editPageSlug" className="text-right">URL Path</Label>
                <Input
                  id="editPageSlug"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editIsHomepage" className="text-right">Set as Homepage</Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="editIsHomepage"
                    checked={newPageIsHomepage}
                    onCheckedChange={setNewPageIsHomepage}
                  />
                  <Label htmlFor="editIsHomepage" className="text-sm text-muted-foreground">
                    This will be the default landing page
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setEditingPageId(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleEditPage}>Update Page</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Separator />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Card key={page.id} className={`overflow-hidden transition-shadow hover:shadow-md ${currentPageId === page.id ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{page.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{page.slug}</p>
                </div>
                {page.isHomepage && (
                  <Badge variant="outline" className="ml-2">Homepage</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                <span className="font-medium">{page.widgets.length}</span> widgets configured
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => setCurrentPage(page.id)}
                >
                  <File size={16} className="mr-1" />
                  {currentPageId === page.id ? 'Current Page' : 'Edit Layout'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => startEditPage(page)}
                >
                  <Edit2 size={16} />
                </Button>
                {!page.isHomepage && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeletePage(page.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PageEditor;
