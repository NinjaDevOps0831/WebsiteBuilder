
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="text-center max-w-3xl px-6">
        <h1 className="text-4xl font-bold mb-4 text-blue-900">ExchBuilder</h1>
        <p className="text-xl text-blue-700 mb-8">
          Create your own cryptocurrency exchange service with minimal effort
        </p>
        <p className="text-gray-700 mb-8">
          Easily customize and deploy your exchange website using the exch.net API. 
          No coding skills required.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 text-lg"
            onClick={() => navigate("/admin")}
          >
            Admin Panel
          </Button>
          <Button 
            className="bg-blue-200 hover:bg-blue-300 text-blue-800 py-2 px-6 text-lg"
            variant="outline"
            onClick={() => navigate("/preview")}
          >
            Preview Site
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
