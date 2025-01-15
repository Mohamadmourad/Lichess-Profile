import React from 'react';
import { LineChart } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <div className="animate-bounce mb-4">
        <LineChart className="w-16 h-16 text-white" />
      </div>
      <div className="text-white text-xl font-semibold">Loading stats...</div>
      <div className="mt-4 w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 animate-pulse"></div>
      </div>
    </div>
  );
}