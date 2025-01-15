import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { BarChart2, ArrowLeft, Zap, Timer, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import LoadingScreen from '../components/LoadingScreen';
import PageNotFound from '../components/PageNotFound';

const mockData = {
  username: 'GrandMaster123',
  totalGames: 1500,
  ratings: {
    bullet: { rating: 2100, games: 500 },
    blitz: { rating: 2200, games: 800 },
    rapid: { rating: 2150, games: 200 },
  },
  stats: {
    white: { wins: 400, losses: 150, draws: 200 },
    black: { wins: 350, losses: 200, draws: 200 },
  },
  openings: {
    white: [
      { name: "Queen's Gambit", count: 180, winRate: 65 },
      { name: "Ruy Lopez", count: 150, winRate: 58 },
      { name: "London System", count: 120, winRate: 62 },
      { name: "Italian Game", count: 100, winRate: 55 },
      { name: "Scotch Game", count: 90, winRate: 60 }
    ],
    black: [
      { name: "Sicilian Defense", count: 250, winRate: 70 },
      { name: "French Defense", count: 120, winRate: 63 },
      { name: "Caro-Kann", count: 110, winRate: 58 },
      { name: "King's Indian", count: 100, winRate: 65 },
      { name: "Nimzo-Indian", count: 90, winRate: 61 }
    ]
  }
};

export default function PlayerStats() {
  const { username } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); 
  const games = queryParams.get("games");
  const timeControls = queryParams.get("timeControls");
  const [loading, setLoading] = useState(true);
  const [playerData, setPlayerData] = useState(mockData);
  const [error, setError] = useState(null);

  function analyzeGames(games, playerUsername) {
    const openingCounts = {
      white: {},
      black: {},
    };
  
    const winLossStats = {
      white: { wins: 0, losses: 0 },
      black: { wins: 0, losses: 0 },
    };

    const normalizedPlayerUsername = playerUsername.toLowerCase();
  
    games.forEach((game) => {
      const { players, winner, opening } = game;
  
      if (
        !players ||
        !players.white?.user?.name ||
        !players.black?.user?.name
      ) {
        return;
      }
  
      const openingName = opening?.name || "Unknown Opening";

      const whitePlayerName = players.white.user.name.toLowerCase();
      const blackPlayerName = players.black.user.name.toLowerCase();
  
      if (whitePlayerName === normalizedPlayerUsername) {
        if (players.white.provisional) {
          return;
        }
  
        if (!openingCounts.white[openingName]) {
          openingCounts.white[openingName] = { count: 0, wins: 0, losses: 0 };
        }
  
        openingCounts.white[openingName].count++;
        if (winner === "white") {
          openingCounts.white[openingName].wins++;
          winLossStats.white.wins++;
        } else if (winner === "black") {
          openingCounts.white[openingName].losses++;
          winLossStats.white.losses++;
        }
      } else if (blackPlayerName === normalizedPlayerUsername) {
        if (players.black.provisional) {
          return;
        }
  
        if (!openingCounts.black[openingName]) {
          openingCounts.black[openingName] = { count: 0, wins: 0, losses: 0 };
        }
  
        openingCounts.black[openingName].count++;
        if (winner === "black") {
          openingCounts.black[openingName].wins++;
          winLossStats.black.wins++;
        } else if (winner === "white") {
          openingCounts.black[openingName].losses++;
          winLossStats.black.losses++;
        }
      }
    });
  
    const topWhiteOpenings = Object.entries(openingCounts.white)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }));
  
    const topBlackOpenings = Object.entries(openingCounts.black)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }));
  
    return {
      topWhiteOpenings,
      topBlackOpenings,
      winLossStats,
    };
  }
  
  

  useEffect(() => {
    const fetchData = async () => {
      const maxGames = games ? games : 1000000; 
      const perfType = timeControls ? timeControls : null; 
      const authToken = process.env.REACT_APP_AUTH_TOKEN;
  
      try {
        const response = await fetch(`https://lichess.org/api/user/${username}`);
        const userData = await response.json();
  
        let url = `https://lichess.org/api/games/user/${username}?opening=true&moves=false&max=${maxGames}`;
        if (perfType) {
          url += `&perfType=${perfType}`; 
        }
  
        const headers = {
          Accept: "application/x-ndjson",
          Authorization: `Bearer ${authToken}`
        };
  
        const response2 = await fetch(url, { headers });
        if (!response2.ok) {
          throw new Error(`Error: ${response2.status} - ${response2.statusText}`);
        }
  
        const gamesText = await response2.text();
        const gamesArray = gamesText
          .split("\n")
          .filter(Boolean)
          .map((game) => JSON.parse(game));
  
        const analyzedData = analyzeGames(gamesArray, username);
  
        const updatedPlayerData = {
          username: userData.username,
          totalGames: userData.count.all,
          ratings: {
            bullet: { rating: userData.perfs.bullet.rating, games: userData.perfs.bullet.games },
            blitz: { rating: userData.perfs.blitz.rating, games: userData.perfs.blitz.games },
            rapid: { rating: userData.perfs.rapid.rating, games: userData.perfs.rapid.games },
          },
          stats: analyzedData.winLossStats, 
          openings: {
            white: analyzedData.topWhiteOpenings.map((opening) => ({
              name: opening.name,
              count: opening.count,
              winRate: Math.round((opening.wins / opening.count) * 100),
            })),
            black: analyzedData.topBlackOpenings.map((opening) => ({
              name: opening.name,
              count: opening.count,
              winRate: Math.round((opening.wins / opening.count) * 100), 
            })),
          },
        };
  
        setPlayerData(updatedPlayerData);
      } catch (error) {
        setLoading(false);
        setError(error);
        console.error(error);
      }
  
      setLoading(false);
    };
  
    fetchData();
  }, [username, games, timeControls]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <PageNotFound />;
  }

  const winRateData = [
    {
      name: 'White',
      wins: playerData.stats.white.wins,
      losses: playerData.stats.white.losses,
      draws: playerData.stats.white.draws,
    },
    {
      name: 'Black',
      wins: playerData.stats.black.wins,
      losses: playerData.stats.black.losses,
      draws: playerData.stats.black.draws,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back to Search
          </Link>
          <div className="flex items-center">
            <BarChart2 className="w-8 h-8 mr-2" />
            <h1 className="text-2xl font-bold">Lichess Profile</h1>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-bold mb-4">{username}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 rounded-lg p-4 flex items-center">
              <div className="bg-blue-500 rounded-full p-3 mr-4">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Bullet</div>
                <div className="text-2xl font-bold">{playerData.ratings.bullet.rating}</div>
                <div className="text-sm text-gray-400">{playerData.ratings.bullet.games} games</div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 flex items-center">
              <div className="bg-green-500 rounded-full p-3 mr-4">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Blitz</div>
                <div className="text-2xl font-bold">{playerData.ratings.blitz.rating}</div>
                <div className="text-sm text-gray-400">{playerData.ratings.blitz.games} games</div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 flex items-center">
              <div className="bg-purple-500 rounded-full p-3 mr-4">
                <Timer className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Rapid</div>
                <div className="text-2xl font-bold">{playerData.ratings.rapid.rating}</div>
                <div className="text-sm text-gray-400">{playerData.ratings.rapid.games} games</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Top 5 White Openings</h3>
            <div className="space-y-4">
              {playerData.openings.white.map((opening, index) => (
                <div key={opening.name} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <a href ={`https://lichess.org/opening/${opening.name}`} className="text-lg font-medium">{opening.name}</a>
                    <span className="text-sm text-gray-300">{opening.count} games</span>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-blue-400">
                          Win Rate: {opening.winRate}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-600">
                      <div
                        style={{ width: `${opening.winRate}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Top 5 Black Openings</h3>
            <div className="space-y-4">
              {playerData.openings.black.map((opening, index) => (
                <div key={opening.name} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <a href ={`https://lichess.org/opening/${opening.name}`} className="text-lg font-medium">{opening.name}</a>
                    <span className="text-sm text-gray-300">{opening.count} games</span>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-blue-400">
                          Win Rate: {opening.winRate}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-600">
                      <div
                        style={{ width: `${opening.winRate}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Overall Performance by Color</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={winRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="wins" fill="#0088FE" stackId="a" name="Wins" />
                <Bar dataKey="losses" fill="#FF8042" stackId="a" name="Losses" />
                <Bar dataKey="draws" fill="#FFBB28" stackId="a" name="Draws" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}