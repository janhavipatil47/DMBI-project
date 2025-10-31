import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Brain, Users, Target, Zap, TrendingUp, BarChart3 } from 'lucide-react';
import axios from 'axios';

const CLUSTER_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const ClusteringAnalysis = () => {
  const [batsmanClusters, setBatsmanClusters] = useState(null);
  const [teamClusters, setTeamClusters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeClustering, setActiveClustering] = useState('batsmen');

  useEffect(() => {
    const fetchClusteringData = async () => {
      try {
        const [batsmanResponse, teamResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/clustering/batsman-clusters'),
          axios.get('http://localhost:5000/api/clustering/team-clusters')
        ]);
        
        setBatsmanClusters(batsmanResponse.data);
        setTeamClusters(teamResponse.data);
      } catch (error) {
        console.error('Error fetching clustering data:', error);
        // Mock data for demo
        setBatsmanClusters({
          clusters: [
            { player: 'V Kohli', cluster: 0, cluster_name: 'Consistent Players', total_runs: 6076, strike_rate: 130.5, boundary_rate: 12.3, average: 35.3, pca_x: -0.8, pca_y: 1.2 },
            { player: 'RG Sharma', cluster: 1, cluster_name: 'Power Hitters', total_runs: 5480, strike_rate: 145.2, boundary_rate: 18.7, average: 28.1, pca_x: 1.5, pca_y: -0.3 },
            { player: 'MS Dhoni', cluster: 2, cluster_name: 'Anchor Players', total_runs: 4746, strike_rate: 135.8, boundary_rate: 10.9, average: 38.9, pca_x: -1.2, pca_y: -0.8 },
            { player: 'AB de Villiers', cluster: 1, cluster_name: 'Power Hitters', total_runs: 5162, strike_rate: 151.7, boundary_rate: 20.1, average: 39.7, pca_x: 2.1, pca_y: 0.5 },
            { player: 'SK Raina', cluster: 3, cluster_name: 'Aggressive Batsmen', total_runs: 5528, strike_rate: 138.9, boundary_rate: 15.6, average: 28.5, pca_x: 0.7, pca_y: 1.8 }
          ]
        });
        
        setTeamClusters({
          clusters: [
            { team: 'Mumbai Indians', cluster: 0, cluster_name: 'Balanced Teams', win_percentage: 58.7, avg_runs_per_match: 168.2, six_rate: 8.5, wicket_rate: 12.3 },
            { team: 'Chennai Super Kings', cluster: 0, cluster_name: 'Balanced Teams', win_percentage: 59.2, avg_runs_per_match: 165.8, six_rate: 7.9, wicket_rate: 11.8 },
            { team: 'Royal Challengers Bangalore', cluster: 1, cluster_name: 'Batting Heavy', win_percentage: 45.3, avg_runs_per_match: 175.6, six_rate: 9.8, wicket_rate: 9.2 },
            { team: 'Kolkata Knight Riders', cluster: 1, cluster_name: 'Batting Heavy', win_percentage: 48.1, avg_runs_per_match: 172.3, six_rate: 8.7, wicket_rate: 10.1 },
            { team: 'Rajasthan Royals', cluster: 2, cluster_name: 'Bowling Heavy', win_percentage: 52.4, avg_runs_per_match: 158.9, six_rate: 6.8, wicket_rate: 13.7 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClusteringData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const processBatsmanClusterData = () => {
    if (!batsmanClusters?.clusters) return [];
    
    const clusterStats = {};
    batsmanClusters.clusters.forEach(player => {
      if (!clusterStats[player.cluster_name]) {
        clusterStats[player.cluster_name] = {
          count: 0,
          avg_runs: 0,
          avg_strike_rate: 0,
          avg_boundary_rate: 0,
          avg_average: 0
        };
      }
      clusterStats[player.cluster_name].count++;
      clusterStats[player.cluster_name].avg_runs += player.total_runs;
      clusterStats[player.cluster_name].avg_strike_rate += player.strike_rate;
      clusterStats[player.cluster_name].avg_boundary_rate += player.boundary_rate;
      clusterStats[player.cluster_name].avg_average += player.average;
    });

    return Object.keys(clusterStats).map(clusterName => ({
      cluster_name: clusterName,
      count: clusterStats[clusterName].count,
      avg_runs: Math.round(clusterStats[clusterName].avg_runs / clusterStats[clusterName].count),
      avg_strike_rate: (clusterStats[clusterName].avg_strike_rate / clusterStats[clusterName].count).toFixed(1),
      avg_boundary_rate: (clusterStats[clusterName].avg_boundary_rate / clusterStats[clusterName].count).toFixed(1),
      avg_average: (clusterStats[clusterName].avg_average / clusterStats[clusterName].count).toFixed(1)
    }));
  };

  const processTeamClusterData = () => {
    if (!teamClusters?.clusters) return [];
    
    const clusterStats = {};
    teamClusters.clusters.forEach(team => {
      if (!clusterStats[team.cluster_name]) {
        clusterStats[team.cluster_name] = {
          count: 0,
          avg_win_percentage: 0,
          avg_runs_per_match: 0,
          avg_six_rate: 0,
          avg_wicket_rate: 0
        };
      }
      clusterStats[team.cluster_name].count++;
      clusterStats[team.cluster_name].avg_win_percentage += team.win_percentage;
      clusterStats[team.cluster_name].avg_runs_per_match += team.avg_runs_per_match;
      clusterStats[team.cluster_name].avg_six_rate += team.six_rate;
      clusterStats[team.cluster_name].avg_wicket_rate += team.wicket_rate;
    });

    return Object.keys(clusterStats).map(clusterName => ({
      cluster_name: clusterName,
      count: clusterStats[clusterName].count,
      avg_win_percentage: (clusterStats[clusterName].avg_win_percentage / clusterStats[clusterName].count).toFixed(1),
      avg_runs_per_match: (clusterStats[clusterName].avg_runs_per_match / clusterStats[clusterName].count).toFixed(1),
      avg_six_rate: (clusterStats[clusterName].avg_six_rate / clusterStats[clusterName].count).toFixed(1),
      avg_wicket_rate: (clusterStats[clusterName].avg_wicket_rate / clusterStats[clusterName].count).toFixed(1)
    }));
  };

  const batsmanClusterStats = processBatsmanClusterData();
  const teamClusterStats = processTeamClusterData();

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
          AI Clustering Analysis
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Machine Learning insights using K-means and Agglomerative clustering algorithms
        </p>
      </motion.div>

      {/* Clustering Type Selection */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-white/20">
          <button
            onClick={() => setActiveClustering('batsmen')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              activeClustering === 'batsmen' 
                ? 'bg-primary-600 text-white shadow-lg' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Batsman Clustering (K-means)
          </button>
          <button
            onClick={() => setActiveClustering('teams')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              activeClustering === 'teams' 
                ? 'bg-primary-600 text-white shadow-lg' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Team Clustering (Agglomerative)
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
            <Brain className="w-8 h-8 text-indigo-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {activeClustering === 'batsmen' ? batsmanClusters?.clusters?.length || 0 : teamClusters?.clusters?.length || 0}
              </div>
              <div className="text-sm opacity-90">Data Points</div>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Users className="w-8 h-8 text-green-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {activeClustering === 'batsmen' ? batsmanClusterStats.length : teamClusterStats.length}
              </div>
              <div className="text-sm opacity-90">Clusters</div>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Target className="w-8 h-8 text-blue-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {activeClustering === 'batsmen' ? 'K-means' : 'Agglomerative'}
              </div>
              <div className="text-sm opacity-90">Algorithm</div>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Zap className="w-8 h-8 text-purple-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {activeClustering === 'batsmen' ? '4' : '3'}
              </div>
              <div className="text-sm opacity-90">Features</div>
            </div>
          </div>
        </div>
      </motion.div>

      {activeClustering === 'batsmen' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Batsman Clusters - Scatter Plot */}
          <motion.div 
            className="chart-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              Batsman Clusters (PCA Visualization)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart data={batsmanClusters?.clusters || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  type="number" 
                  dataKey="pca_x" 
                  name="PCA Component 1"
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  type="number" 
                  dataKey="pca_y" 
                  name="PCA Component 2"
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
                  dataKey="pca_y" 
                  fill={(entry) => CLUSTER_COLORS[entry.cluster % CLUSTER_COLORS.length]}
                  r={6}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Cluster Distribution - Pie Chart */}
          <motion.div 
            className="chart-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Cluster Distribution
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={batsmanClusterStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ cluster_name, count, percent }) => `${cluster_name}: ${count}`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {batsmanClusterStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CLUSTER_COLORS[index % CLUSTER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} players`, 
                    'Count'
                  ]}
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Clusters - Bar Chart */}
          <motion.div 
            className="chart-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Team Clusters by Win Percentage
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={teamClusters?.clusters || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="team" 
                  stroke="#64748b"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
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
                  formatter={(value, name) => [`${value}%`, 'Win Percentage']}
                />
                <Bar 
                  dataKey="win_percentage" 
                  fill={(entry) => CLUSTER_COLORS[entry.cluster % CLUSTER_COLORS.length]}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Cluster Stats - Bar Chart */}
          <motion.div 
            className="chart-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Cluster Performance Metrics
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={teamClusterStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="cluster_name" 
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
                  dataKey="avg_win_percentage" 
                  fill="#3B82F6"
                  name="Win %"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="avg_runs_per_match" 
                  fill="#10B981"
                  name="Runs/Match"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {/* Cluster Details Table */}
      <motion.div 
        className="chart-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          {activeClustering === 'batsmen' ? 'Batsman Cluster Details' : 'Team Cluster Details'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">
                  {activeClustering === 'batsmen' ? 'Player' : 'Team'}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Cluster</th>
                {activeClustering === 'batsmen' ? (
                  <>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Runs</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Strike Rate</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Boundary Rate</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Average</th>
                  </>
                ) : (
                  <>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Win %</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Runs/Match</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Six Rate</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Wicket Rate</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {(activeClustering === 'batsmen' ? batsmanClusters?.clusters : teamClusters?.clusters)?.slice(0, 15).map((item, index) => (
                <motion.tr 
                  key={activeClustering === 'batsmen' ? item.player : item.team}
                  className="border-b border-slate-100 hover:bg-slate-50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {activeClustering === 'batsmen' ? item.player : item.team}
                  </td>
                  <td className="py-3 px-4">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: CLUSTER_COLORS[item.cluster % CLUSTER_COLORS.length] }}
                    >
                      {item.cluster_name}
                    </span>
                  </td>
                  {activeClustering === 'batsmen' ? (
                    <>
                      <td className="py-3 px-4 text-slate-600">{item.total_runs}</td>
                      <td className="py-3 px-4 text-slate-600">{item.strike_rate}</td>
                      <td className="py-3 px-4 text-slate-600">{item.boundary_rate}%</td>
                      <td className="py-3 px-4 text-slate-600">{item.average}</td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4 text-slate-600">{item.win_percentage}%</td>
                      <td className="py-3 px-4 text-slate-600">{item.avg_runs_per_match}</td>
                      <td className="py-3 px-4 text-slate-600">{item.six_rate}%</td>
                      <td className="py-3 px-4 text-slate-600">{item.wicket_rate}%</td>
                    </>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div 
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            🤖 Machine Learning Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">K-means Clustering (Batsmen)</h4>
              <p className="text-sm text-indigo-100">
                Identifies 4 distinct playing styles: Power Hitters (high SR, boundaries), 
                Consistent Players (balanced), Aggressive Batsmen (high risk-reward), 
                and Anchor Players (stability-focused).
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Agglomerative Clustering (Teams)</h4>
              <p className="text-sm text-indigo-100">
                Groups teams into 3 categories: Balanced Teams (all-round performance), 
                Batting Heavy (offensive strength), and Bowling Heavy (defensive focus) 
                based on win rates and performance metrics.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ClusteringAnalysis;
