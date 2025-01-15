import React from 'react';
import { LineChart } from 'lucide-react';

export default function LoadingScreen({gamesNum}) {
    let time = "";
    if(gamesNum === "100") {
        time = "it may take up to 4 seconds"
    } else if(gamesNum === "500") {
        time = "it may take up to 17 seconds"
    } else if(gamesNum === "1000") {
        time = "it may take up to 34 seconds"
    } else if(gamesNum === "2000") {
        time = "it may take up to 1 minute and 8 seconds"
    } else if(gamesNum === "3000") {
        time = "it may take up to 1 minute and 42 seconds"
    } else if(gamesNum === "5000") {
        time = "it may take up to 2 minutes and 50 seconds"
    } else if(gamesNum === "10000") {
        time = "it may take up to 7 minutes and 50 seconds"
    } else if(gamesNum === "50000") {
        time = "it may take a while"
    }
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <div className="animate-bounce mb-4">
        <LineChart className="w-16 h-16 text-white" />
      </div>
      <div className="text-white text-xl font-semibold">Loading stats...</div>
      <div className="mt-4 w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 animate-pulse"></div>
      </div>
        <div className="text-gray-400 mt-4 text-sm">{time}</div>
    </div>
  );
}