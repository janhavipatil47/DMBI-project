import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar, Target, Zap } from 'lucide-react';
import axios from 'axios';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const SeasonTrends = () => {
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendsData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data/season-trends');
        setTrendsData(response.data);
      } catch (error) {
        console.error('Error fetching trends data:', error);
        // Mock data for demo
        setTrendsData({
          runs_trend: [
            { season: '2008', avg_runs_per_delivery: 7.2 },
            { season: '2009', avg_runs_per_delivery: 7.5 },
            { season: '2010', avg_runs_per_delivery: 7.8 },
            { season: '2011', avg_runs_per_delivery: 8.1 },
            { season: '2012', avg_runs_per_delivery: 8.0 },
            { season: '2013', avg_runs_per_delivery: 8.3 },
            { season: '2014', avg_runs_per_delivery: 8.2 },
            { season: '2015', avg_runs_per_delivery: 8.5 },
            { season: '2016', avg_runs_per_delivery: 8.7 },
            { season: '2017', avg_runs_per_delivery: 8.9 },
            { season: '2018', avg_runs_per_delivery: 8.8 },
            { season: '2019', avg_runs_per_delivery: 9.1 },
            { season: '2020', avg_runs_per_delivery: 8.6 },
            { season: '2021', avg_runs_per_delivery: 9.0 },
            { season: '2022', avg_runs_per_delivery: 9.2 }
          ],
          matches_trend: [
            { season: '2008', total_matches: 56 },
            { season: '2009', total_matches: 57 },
            { season: '2010', total_matches: 60 },
            { season: '2011', total_matches: 74 },
            { season: '2012', total_matches: 76 },
            { season: '2013', total_matches: 76 },
            { season: '2014', total_matches: 60 },
            { season: '2015', total_matches: 60 },
            { season: '2016', total_matches: 60 },
            { season: '2017', total_matches: 60 },
            { season: '2018', total_matches: 60 },
            { season: '2019', total_matches: 60 },
            { season: '2020', total_matches: 60 },
            { season: '2021', total_matches: 60 },
            { season: '2022', total_matches: 74 }
          ],
          boundaries_trend: [
            { season: '2008', sixes: 623, fours: 1456 },
            { season: '2009', sixes: 712, fours: 1523 },
            { season: '2010', sixes: 785, fours: 1589 },
            { season: '2011', sixes: 872, fours: 1678 },
            { season: '2012', sixes: 904, fours: 1698 },
            { season: '2013', sixes: 934, fours: 1712 },
            { season: '2014', sixes: 856, fours: 1645 },
            { season: '2015', sixes: 892, fours: 1678 },
            { season: '2016', sixes: 945, fours: 1723 },
            { season: '2017', sixes: 967, fours: 1756 },
            { season: '2018', sixes: 989, fours: 1789 },
            { season: '2019', sixes: 1023, fours: 1823 },
            { season: '2020', sixes: 978, fours: 1767 },
            { season: '2021', sixes: 1012, fours: 1801 },
            { season: '2022', sixes: 1056, fours: 1845 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrendsData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
          Season Trends Analysis
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Track the evolution of IPL performance metrics across seasons
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <TrendingUp className="w-8 h-8 text-blue-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {trendsData?.runs_trend?.length || 0}
              </div>
              <div className="text-sm opacity-90">Seasons Analyzed</div>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Target className="w-8 h-8 text-green-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {Math.max(...(trendsData?.runs_trend?.map(r => r.avg_runs_per_delivery) || [0])).toFixed(1)}
              </div>
              <div className="text-sm opacity-90">Peak Run Rate</div>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Calendar className="w-8 h-8 text-purple-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {Math.max(...(trendsData?.matches_trend?.map(m => m.total_matches) || [0]))}
              </div>
              <div className="text-sm opacity-90">Most Matches</div>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Zap className="w-8 h-8 text-yellow-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {Math.max(...(trendsData?.boundaries_trend?.map(b => b.sixes) || [0]))}
              </div>
              <div className="text-sm opacity-90">Most Sixes</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Runs Per Delivery Trend - Line Chart */}
        <motion.div 
          className="chart-container"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Average Runs Per Delivery Trend
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendsData?.runs_trend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="season" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                domain={[6, 10]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [value.toFixed(2), 'Runs per Delivery']}
              />
              <Line 
                type="monotone" 
                dataKey="avg_runs_per_delivery" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Total Matches Trend - Area Chart */}
        <motion.div 
          className="chart-container"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Total Matches Per Season
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={trendsData?.matches_trend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="season" 
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
                formatter={(value) => [value, 'Total Matches']}
              />
              <Area 
                type="monotone" 
                dataKey="total_matches" 
                stroke="#10B981" 
                fill="url(#colorMatches)"
                strokeWidth={3}
              />
              <defs>
                <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Boundaries Trend */}
      <motion.div 
        className="chart-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          Boundaries Trend Over Seasons
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trendsData?.boundaries_trend || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="season" 
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
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="sixes" 
              stroke="#F59E0B" 
              strokeWidth={3}
              name="Sixes"
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="fours" 
              stroke="#EF4444" 
              strokeWidth={3}
              name="Fours"
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Performance Summary */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Run Rate Evolution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">2008-2012</span>
              <span className="text-sm font-medium text-slate-800">7.2 - 8.0</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">2013-2017</span>
              <span className="text-sm font-medium text-slate-800">8.0 - 8.9</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">2018-2022</span>
              <span className="text-sm font-medium text-slate-800">8.6 - 9.2</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-800">Run Rate Growth</p>
                <p className="text-xs text-slate-600">27% increase from 2008 to 2022</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-800">Tournament Expansion</p>
                <p className="text-xs text-slate-600">From 56 to 74 matches per season</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-800">Boundary Evolution</p>
                <p className="text-xs text-slate-600">69% increase in sixes over time</p>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Peak Performance</h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-800">Best Run Rate Season</p>
              <p className="text-lg font-bold text-blue-900">
                {trendsData?.runs_trend?.find(r => r.avg_runs_per_delivery === Math.max(...(trendsData?.runs_trend?.map(r => r.avg_runs_per_delivery) || [0])))?.season || '2022'}
              </p>
              <p className="text-xs text-blue-700">
                {Math.max(...(trendsData?.runs_trend?.map(r => r.avg_runs_per_delivery) || [0])).toFixed(1)} runs per delivery
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3">
              <p className="text-sm font-medium text-green-800">Most Active Season</p>
              <p className="text-lg font-bold text-green-900">
                {trendsData?.matches_trend?.find(m => m.total_matches === Math.max(...(trendsData?.matches_trend?.map(m => m.total_matches) || [0])))?.season || '2012'}
              </p>
              <p className="text-xs text-green-700">
                {Math.max(...(trendsData?.matches_trend?.map(m => m.total_matches) || [0]))} matches
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SeasonTrends;
