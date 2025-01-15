import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center">
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back to Search
        </Link>
      </div>
      <div className="text-center">
        <div className="text-white text-6xl font-bold">Player Not Found</div>
      </div>
    </div>
  );
};

export default PageNotFound;
