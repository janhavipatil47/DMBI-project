import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MapPin, Target, Activity, TrendingUp } from 'lucide-react';
import axios from 'axios';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#14B8A6'];

const VenueAnalysis = () => {
  const [venueData, setVenueData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data/venue-analysis');
        setVenueData(response.data);
      } catch (error) {
        console.error('Error fetching venue data:', error);
        // Mock data for demo
        setVenueData({
          city_matches: [
            { city: 'Mumbai', match_count: 101 },
            { city: 'Delhi', match_count: 78 },
            { city: 'Bangalore', match_count: 65 },
            { city: 'Chennai', match_count: 58 },
            { city: 'Kolkata', match_count: 52 }
          ],
          toss_decisions: [
            { toss_decision: 'field', count: 456 },
            { toss_decision: 'bat', count: 300 }
          ],
          result_types: [
            { result: 'runs', count: 423 },
            { result: 'wickets', count: 333 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVenueData();
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
          Venue Analysis
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Explore match distribution, toss decisions, and venue performance across IPL cities
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <MapPin className="w-8 h-8 text-blue-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">{venueData?.city_matches?.length || 0}</div>
              <div className="text-sm opacity-90">Cities Hosted</div>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Target className="w-8 h-8 text-green-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {venueData?.city_matches?.reduce((acc, city) => acc + city.match_count, 0) || 0}
              </div>
              <div className="text-sm opacity-90">Total Matches</div>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Activity className="w-8 h-8 text-purple-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {Math.round(venueData?.city_matches?.reduce((acc, city) => acc + city.match_count, 0) / (venueData?.city_matches?.length || 1))}
              </div>
              <div className="text-sm opacity-90">Avg per City</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* City Matches Distribution - Pie Chart */}
        <motion.div 
          className="chart-container"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Matches by City Distribution
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={venueData?.city_matches || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ city, match_count, percent }) => `${city}: ${match_count}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="match_count"
              >
                {(venueData?.city_matches || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} matches`, 'Count']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Cities - Bar Chart */}
        <motion.div 
          className="chart-container"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Top Cities by Match Count
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={venueData?.city_matches?.slice(0, 8) || []}>
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
              <Bar 
                dataKey="match_count" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Additional Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Toss Decisions */}
        <motion.div 
          className="chart-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-600" />
            Toss Decision Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={venueData?.toss_decisions || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ toss_decision, count, percent }) => `${toss_decision}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {(venueData?.toss_decisions || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} matches`, 'Count']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Result Types */}
        <motion.div 
          className="chart-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" />
            Match Result Types
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={venueData?.result_types || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ result, count, percent }) => `${result}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {(venueData?.result_types || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index + 2 % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} matches`, 'Count']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div 
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            🏟️ Venue Performance Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Most Active Venue</h4>
              <p className="text-sm text-blue-100">
                {venueData?.city_matches?.[0]?.city || 'Mumbai'} leads with {venueData?.city_matches?.[0]?.match_count || 0} matches
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Toss Preference</h4>
              <p className="text-sm text-blue-100">
                {venueData?.toss_decisions?.find(t => t.toss_decision === 'field')?.count > venueData?.toss_decisions?.find(t => t.toss_decision === 'bat')?.count ? 'Fielding first' : 'Batting first'} is preferred by captains
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Match Outcomes</h4>
              <p className="text-sm text-blue-100">
                Most matches are decided by {venueData?.result_types?.find(r => r.result === 'runs')?.count > venueData?.result_types?.find(r => r.result === 'wickets')?.count ? 'runs' : 'wickets'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VenueAnalysis;
