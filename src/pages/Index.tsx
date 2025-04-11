
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-exchange-darkblue to-exchange-black">
      <div className="container px-4 py-16 space-y-12 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-exchange-lightblue to-blue-300 text-transparent bg-clip-text">
          Exchange Canvas Builder
        </h1>
        <p className="text-xl md:text-2xl text-exchange-lightgray max-w-3xl mx-auto">
          Build your own cryptocurrency exchange website with our easy-to-use platform.
          Customize templates, add widgets, and deploy your site in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
          <Button asChild size="lg" className="bg-exchange-blue hover:bg-exchange-lightblue text-white px-8 py-6 text-lg">
            <Link to="/admin">
              Launch Admin Panel
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-exchange-lightgray text-exchange-lightgray hover:bg-exchange-gray px-8 py-6 text-lg">
            <Link to="/preview">
              View Demo Site
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="container mt-12 px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-exchange-gray bg-opacity-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-exchange-lightblue mb-4">Drag & Drop Builder</h3>
            <p className="text-exchange-lightgray">
              Easily position exchange widgets, menus, and forms on your website with our intuitive drag-and-drop interface.
            </p>
          </div>
          <div className="bg-exchange-gray bg-opacity-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-exchange-lightblue mb-4">Customizable Templates</h3>
            <p className="text-exchange-lightgray">
              Choose from pre-designed templates or upload your own HTML. Supports both JavaScript and non-JavaScript versions.
            </p>
          </div>
          <div className="bg-exchange-gray bg-opacity-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-exchange-lightblue mb-4">API Integration</h3>
            <p className="text-exchange-lightgray">
              Connect with exch.net API to display real-time exchange rates and process transactions securely.
            </p>
          </div>
        </div>
      </div>

      <footer className="w-full py-6 mt-12 text-center text-exchange-lightgray">
        <p>Exchange Canvas Builder &copy; 2025</p>
      </footer>
    </div>
  );
};

export default Index;
