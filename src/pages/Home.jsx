import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BarChart2 } from 'lucide-react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [numberOfGames, setNumberOfGames] = useState('100');
  const [timeControls, setTimeControls] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (username.trim()) {
      const timeControlsParam = timeControls.length > 0 ? `&time=${timeControls.join(',')}` : '';
      navigate(`/player/${username}?games=${numberOfGames}${timeControlsParam}`);
    }
  };

  const handleTimeControlToggle = (value) => {
    setTimeControls(prev => 
      prev.includes(value)
        ? prev.filter(tc => tc !== value)
        : [...prev, value]
    );
  };

  const timeControlOptions = [
    { value: 'bullet', label: 'Bullet' },
    { value: 'blitz', label: 'Blitz' },
    { value: 'rapid', label: 'Rapid' },
    { value: 'classical', label: 'Classical' },
  ];

  const gameNumberOptions = [
    { value: '100', label: 'Last 100 games' },
    { value: '500', label: 'Last 500 games' },
    { value: '1000', label: 'Last 1000 games' },
    { value: '2000', label: 'Last 2000 games' },
    { value: '3000', label: 'Last 3000 games' },
    { value: '5000', label: 'Last 5000 games' },
    { value: '10000', label: 'Last 10000 games' },
    { value: '50000', label: 'Last 50000 games' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <BarChart2 className="w-12 h-12 text-white mr-3" />
          <h1 className="text-4xl font-bold text-white">Lichess Profile</h1>
        </div>
        <p className="text-gray-400">Analyze chess performance and openings</p>
      </div>

      <form onSubmit={handleSearch} className="w-full max-w-md space-y-6">
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter player username..."
            className="w-full px-6 py-4 rounded-full bg-white bg-opacity-10 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
          >
            <Search className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Number of Games
            </label>
            <div className="grid grid-cols-3 gap-2">
              {gameNumberOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setNumberOfGames(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    numberOfGames === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Time Controls
            </label>
            <div className="grid grid-cols-2 gap-3">
              {timeControlOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 bg-white bg-opacity-10 rounded-lg p-3 cursor-pointer hover:bg-opacity-20 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={timeControls.includes(option.value)}
                    onChange={() => handleTimeControlToggle(option.value)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500 focus:ring-2 bg-gray-700"
                  />
                  <span className="text-white">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}