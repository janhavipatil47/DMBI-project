import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line } from 'recharts';
import { Trophy, Target, Zap, Users, TrendingUp } from 'lucide-react';
import axios from 'axios';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

const PlayerStats = () => {
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('batsmen');

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data/player-stats');
        setPlayerData(response.data);
      } catch (error) {
        console.error('Error fetching player data:', error);
        // Mock data for demo
        setPlayerData({
          top_batsmen: [
            { player: 'V Kohli', total_runs: 6076, fours: 548, sixes: 201, dismissals: 172 },
            { player: 'SK Raina', total_runs: 5528, fours: 506, sixes: 194, dismissals: 194 },
            { player: 'RG Sharma', total_runs: 5480, fours: 491, sixes: 224, dismissals: 195 },
            { player: 'DA Warner', total_runs: 5447, fours: 525, sixes: 201, dismissals: 152 },
            { player: 'S Dhawan', total_runs: 5424, fours: 647, sixes: 116, dismissals: 171 }
          ],
          top_bowlers: [
            { player: 'SL Malinga', wickets: 170, runs_conceded: 3366, balls_bowled: 4711 },
            { player: 'A Mishra', wickets: 166, runs_conceded: 3413, balls_bowled: 4616 },
            { player: 'Harbhajan Singh', wickets: 150, runs_conceded: 3470, balls_bowled: 4622 },
            { player: 'PP Chawla', wickets: 157, runs_conceded: 3780, balls_bowled: 4790 },
            { player: 'DJ Bravo', wickets: 156, runs_conceded: 3540, balls_bowled: 4370 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const processBatsmenData = () => {
    if (!playerData?.top_batsmen) return [];
    
    return playerData.top_batsmen.map(player => ({
      player: player.player.split(' ').pop(), // Use last name for display
      fullName: player.player,
      total_runs: player.total_runs,
      fours: player.fours,
      sixes: player.sixes,
      strike_rate: ((player.total_runs / (player.dismissals * 4 + 100)) * 100).toFixed(1), // Approximate SR
      boundaries: player.fours + player.sixes
    }));
  };

  const processBowlersData = () => {
    if (!playerData?.top_bowlers) return [];
    
    return playerData.top_bowlers.map(player => ({
      player: player.player.split(' ').pop(),
      fullName: player.player,
      wickets: player.wickets,
      runs_conceded: player.runs_conceded,
      balls_bowled: player.balls_bowled,
      economy: (player.runs_conceded / (player.balls_bowled / 6)).toFixed(2),
      avg_balls_per_wicket: (player.balls_bowled / player.wickets).toFixed(1)
    }));
  };

  const batsmenData = processBatsmenData();
  const bowlersData = processBowlersData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-gradient mb-4">
          Player Performance Analysis
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Comprehensive statistics of top batsmen and bowlers in IPL history
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-white/20">
          <button
            onClick={() => setActiveTab('batsmen')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'batsmen' 
                ? 'bg-primary-600 text-white shadow-lg' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Batsmen
          </button>
          <button
            onClick={() => setActiveTab('bowlers')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'bowlers' 
                ? 'bg-primary-600 text-white shadow-lg' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Bowlers
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Trophy className="w-8 h-8 text-yellow-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {activeTab === 'batsmen' ? batsmenData[0]?.total_runs || 0 : bowlersData[0]?.wickets || 0}
              </div>
              <div className="text-sm opacity-90">
                {activeTab === 'batsmen' ? 'Top Batsman Runs' : 'Top Bowler Wickets'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Target className="w-8 h-8 text-green-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {activeTab === 'batsmen' ? batsmenData[0]?.boundaries || 0 : bowlersData[0]?.economy || 0}
              </div>
              <div className="text-sm opacity-90">
                {activeTab === 'batsmen' ? 'Most Boundaries' : 'Best Economy'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Zap className="w-8 h-8 text-blue-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {activeTab === 'batsmen' ? batsmenData[0]?.sixes || 0 : bowlersData[0]?.balls_bowled || 0}
              </div>
              <div className="text-sm opacity-90">
                {activeTab === 'batsmen' ? 'Most Sixes' : 'Balls Bowled'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Users className="w-8 h-8 text-purple-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {activeTab === 'batsmen' ? batsmenData.length : bowlersData.length}
              </div>
              <div className="text-sm opacity-90">Players Analyzed</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      {activeTab === 'batsmen' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Batsmen Runs - Bar Chart */}
          <motion.div 
            className="chart-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Top Batsmen by Runs
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={batsmenData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="player" 
                  stroke="#64748b"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => [value, name === 'total_runs' ? 'Runs' : name]}
                />
                <Bar 
                  dataKey="total_runs" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Boundaries vs Sixes - Scatter Chart */}
          <motion.div 
            className="chart-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              Boundaries vs Sixes Analysis
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart data={batsmenData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  type="number" 
                  dataKey="fours" 
                  name="Fours"
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  type="number" 
                  dataKey="sixes" 
                  name="Sixes"
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name, props) => [
                    value, 
                    name === 'fours' ? 'Fours' : 'Sixes',
                    `Player: ${props.payload.fullName}`
                  ]}
                />
                <Scatter 
                  dataKey="sixes" 
                  fill="#10B981"
                  r={6}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Bowlers Wickets - Bar Chart */}
          <motion.div 
            className="chart-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-600" />
              Top Bowlers by Wickets
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={bowlersData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="player" 
                  stroke="#64748b"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => [value, name === 'wickets' ? 'Wickets' : name]}
                />
                <Bar 
                  dataKey="wickets" 
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Economy vs Wickets - Scatter Chart */}
          <motion.div 
            className="chart-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Economy vs Wickets Analysis
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart data={bowlersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  type="number" 
                  dataKey="economy" 
                  name="Economy"
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  type="number" 
                  dataKey="wickets" 
                  name="Wickets"
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name, props) => [
                    value, 
                    name === 'economy' ? 'Economy' : 'Wickets',
                    `Player: ${props.payload.fullName}`
                  ]}
                />
                <Scatter 
                  dataKey="wickets" 
                  fill="#8B5CF6"
                  r={6}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {/* Player Performance Table */}
      <motion.div 
        className="chart-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Detailed Player Statistics
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Player</th>
                {activeTab === 'batsmen' ? (
                  <>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Runs</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Fours</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Sixes</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">SR</th>
                  </>
                ) : (
                  <>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Wickets</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Economy</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Balls</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Avg/W</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'batsmen' ? batsmenData : bowlersData).slice(0, 15).map((player, index) => (
                <motion.tr 
                  key={player.fullName}
                  className="border-b border-slate-100 hover:bg-slate-50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {player.fullName}
                  </td>
                  {activeTab === 'batsmen' ? (
                    <>
                      <td className="py-3 px-4 text-slate-600">{player.total_runs}</td>
                      <td className="py-3 px-4 text-slate-600">{player.fours}</td>
                      <td className="py-3 px-4 text-slate-600">{player.sixes}</td>
                      <td className="py-3 px-4 text-slate-600">{player.strike_rate}</td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4 text-slate-600">{player.wickets}</td>
                      <td className="py-3 px-4 text-slate-600">{player.economy}</td>
                      <td className="py-3 px-4 text-slate-600">{player.balls_bowled}</td>
                      <td className="py-3 px-4 text-slate-600">{player.avg_balls_per_wicket}</td>
                    </>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default PlayerStats;
