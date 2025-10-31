import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BoxPlot, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line } from 'recharts';
import { Activity, Target, TrendingUp, MapPin, Clock, Users } from 'lucide-react';
import axios from 'axios';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const MatchDetails = () => {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('over');

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data/match-details');
        setMatchData(response.data);
      } catch (error) {
        console.error('Error fetching match data:', error);
        // Mock data for demo
        setMatchData({
          runs_by_over: [
            { over: 1, total_runs: 8, season: '2020' },
            { over: 2, total_runs: 12, season: '2020' },
            { over: 3, total_runs: 6, season: '2020' },
            { over: 4, total_runs: 15, season: '2020' },
            { over: 5, total_runs: 9, season: '2020' },
            { over: 6, total_runs: 18, season: '2020' },
            { over: 7, total_runs: 7, season: '2020' },
            { over: 8, total_runs: 14, season: '2020' },
            { over: 9, total_runs: 11, season: '2020' },
            { over: 10, total_runs: 16, season: '2020' },
            { over: 11, total_runs: 13, season: '2020' },
            { over: 12, total_runs: 19, season: '2020' },
            { over: 13, total_runs: 8, season: '2020' },
            { over: 14, total_runs: 22, season: '2020' },
            { over: 15, total_runs: 17, season: '2020' },
            { over: 16, total_runs: 25, season: '2020' },
            { over: 17, total_runs: 21, season: '2020' },
            { over: 18, total_runs: 28, season: '2020' },
            { over: 19, total_runs: 24, season: '2020' },
            { over: 20, total_runs: 31, season: '2020' }
          ],
          player_scatter: [
            { player: 'V Kohli', innings: 192, total_runs: 6076, avg_runs_per_ball: 1.3, sixes: 201, fours: 548 },
            { player: 'RG Sharma', innings: 213, total_runs: 5480, avg_runs_per_ball: 1.45, sixes: 224, fours: 491 },
            { player: 'SK Raina', innings: 204, total_runs: 5528, avg_runs_per_ball: 1.39, sixes: 194, fours: 506 },
            { player: 'DA Warner', innings: 162, total_runs: 5447, avg_runs_per_ball: 1.51, sixes: 201, fours: 525 },
            { player: 'S Dhawan', innings: 206, total_runs: 5424, avg_runs_per_ball: 1.32, sixes: 116, fours: 647 },
            { player: 'MS Dhoni', innings: 204, total_runs: 4746, avg_runs_per_ball: 1.36, sixes: 229, fours: 313 },
            { player: 'AB de Villiers', innings: 170, total_runs: 5162, avg_runs_per_ball: 1.52, sixes: 251, fours: 413 },
            { player: 'CH Gayle', innings: 142, total_runs: 4965, avg_runs_per_ball: 1.67, sixes: 357, fours: 404 }
          ],
          venue_performance: [
            { venue: 'M Chinnaswamy Stadium', city: 'Bangalore', total_matches: 78, avg_runs_per_delivery: 8.2, six_rate: 8.5 },
            { venue: 'Wankhede Stadium', city: 'Mumbai', total_matches: 101, avg_runs_per_delivery: 8.1, six_rate: 8.2 },
            { venue: 'Eden Gardens', city: 'Kolkata', total_matches: 52, avg_runs_per_delivery: 7.9, six_rate: 7.8 },
            { venue: 'MA Chidambaram Stadium', city: 'Chennai', total_matches: 58, avg_runs_per_delivery: 7.6, six_rate: 7.2 },
            { venue: 'Feroz Shah Kotla', city: 'Delhi', total_matches: 78, avg_runs_per_delivery: 8.0, six_rate: 8.1 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Process data for different visualizations
  const processOverData = () => {
    if (!matchData?.runs_by_over) return [];
    
    const overStats = {};
    matchData.runs_by_over.forEach(item => {
      if (!overStats[item.over]) {
        overStats[item.over] = [];
      }
      overStats[item.over].push(item.total_runs);
    });

    return Object.keys(overStats).map(over => {
      const runs = overStats[over];
      const sorted = runs.sort((a, b) => a - b);
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const median = sorted[Math.floor(sorted.length * 0.5)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      
      return {
        over: parseInt(over),
        min,
        q1,
        median,
        q3,
        max,
        avg: (runs.reduce((a, b) => a + b, 0) / runs.length).toFixed(1)
      };
    }).sort((a, b) => a.over - b.over);
  };

  const overStats = processOverData();

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
          Match Details Analysis
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Deep dive into match dynamics, over-wise performance, and venue characteristics
        </p>
      </motion.div>

      {/* View Selection */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-white/20">
          <button
            onClick={() => setActiveView('over')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              activeView === 'over' 
                ? 'bg-primary-600 text-white shadow-lg' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Over Analysis
          </button>
          <button
            onClick={() => setActiveView('players')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              activeView === 'players' 
                ? 'bg-primary-600 text-white shadow-lg' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Player Analysis
          </button>
          <button
            onClick={() => setActiveView('venues')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              activeView === 'venues' 
                ? 'bg-primary-600 text-white shadow-lg' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Venue Analysis
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
            <Clock className="w-8 h-8 text-blue-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {matchData?.runs_by_over?.length || 0}
              </div>
              <div className="text-sm opacity-90">Over Records</div>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Users className="w-8 h-8 text-green-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {matchData?.player_scatter?.length || 0}
              </div>
              <div className="text-sm opacity-90">Players Analyzed</div>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <MapPin className="w-8 h-8 text-purple-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {matchData?.venue_performance?.length || 0}
              </div>
              <div className="text-sm opacity-90">Venues</div>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Activity className="w-8 h-8 text-yellow-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {Math.max(...(matchData?.runs_by_over?.map(r => r.total_runs) || [0]))}
              </div>
              <div className="text-sm opacity-90">Max Runs/Over</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts based on active view */}
      {activeView === 'over' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Runs Distribution by Over - Box Plot Simulation */}
          <motion.div 
            className="chart-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Runs Distribution by Over (Box Plot)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={overStats.slice(0, 20)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="over" 
                  stroke="#64748b"
                  fontSize={12}
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
                  formatter={(value, name, props) => [
                    `Min: ${props.payload.min}, Max: ${props.payload.max}, Avg: ${props.payload.avg}`,
                    'Runs Distribution'
                  ]}
                />
                <Bar 
                  dataKey="median" 
                  fill="#3B82F6"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Average Runs per Over - Line Chart */}
          <motion.div 
            className="chart-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Average Runs Per Over Trend
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={overStats.slice(0, 20)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="over" 
                  stroke="#64748b"
                  fontSize={12}
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
                  formatter={(value) => [value, 'Average Runs']}
                />
                <Line 
                  type="monotone" 
                  dataKey="avg" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {activeView === 'players' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Player Performance Scatter */}
          <motion.div 
            className="chart-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Player Performance: Runs vs Strike Rate
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart data={matchData?.player_scatter || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  type="number" 
                  dataKey="total_runs" 
                  name="Total Runs"
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  type="number" 
                  dataKey="avg_runs_per_ball" 
                  name="Strike Rate"
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
                    props.payload.player,
                    'Player'
                  ]}
                />
                <Scatter 
                  dataKey="avg_runs_per_ball" 
                  fill="#8B5CF6"
                  r={8}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Boundaries Analysis */}
          <motion.div 
            className="chart-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-yellow-600" />
              Boundaries Analysis: Sixes vs Fours
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart data={matchData?.player_scatter || []}>
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
                    props.payload.player,
                    'Player'
                  ]}
                />
                <Scatter 
                  dataKey="sixes" 
                  fill="#F59E0B"
                  r={8}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {activeView === 'venues' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Venue Performance */}
          <motion.div 
            className="chart-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Venue Performance Metrics
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={matchData?.venue_performance || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="city" 
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
                />
                <Legend />
                <Bar 
                  dataKey="avg_runs_per_delivery" 
                  fill="#EF4444"
                  name="Runs/Delivery"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="six_rate" 
                  fill="#F59E0B"
                  name="Six Rate %"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Venue Characteristics */}
          <motion.div 
            className="chart-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Venue Characteristics
            </h3>
            <div className="space-y-4">
              {matchData?.venue_performance?.map((venue, index) => (
                <div key={venue.venue} className="bg-slate-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-800">{venue.city}</h4>
                    <span className="text-sm text-slate-600">{venue.total_matches} matches</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Run Rate</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(venue.avg_runs_per_delivery / 10) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {venue.avg_runs_per_delivery}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Six Rate</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${venue.six_rate * 10}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {venue.six_rate}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Insights */}
      <motion.div 
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            📊 Match Dynamics Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Over Progression</h4>
              <p className="text-sm text-blue-100">
                Runs typically increase from overs 1-6 (7.5 avg) to death overs 16-20 (21 avg), 
                showing clear batting strategy evolution.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Player Patterns</h4>
              <p className="text-sm text-blue-100">
                Top performers show strong correlation between total runs and strike rate, 
                with boundary hitters having higher impact.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Venue Impact</h4>
              <p className="text-sm text-blue-100">
                Smaller grounds like Bangalore show higher run rates (8.2) and six rates (8.5%), 
                while larger venues favor bowlers.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MatchDetails;
