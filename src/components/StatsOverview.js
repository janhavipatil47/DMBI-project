import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Calendar, 
  Target, 
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import axios from 'axios';

const StatsOverview = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data/overview');
        setOverview(response.data);
      } catch (error) {
        console.error('Error fetching overview:', error);
        // Mock data for demo
        setOverview({
          total_matches: 756,
          total_seasons: 15,
          total_deliveries: 260912,
          total_teams: 13
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const stats = [
    {
      title: 'Total Matches',
      value: overview?.total_matches || 0,
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      title: 'Seasons',
      value: overview?.total_seasons || 0,
      icon: Calendar,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Total Deliveries',
      value: overview?.total_deliveries?.toLocaleString() || 0,
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Teams',
      value: overview?.total_teams || 0,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ];

  const features = [
    {
      title: 'Team Performance',
      description: 'Analyze team statistics and win rates across seasons',
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      title: 'Venue Analysis',
      description: 'Explore venue performance and match distributions',
      icon: PieChart,
      color: 'text-green-600'
    },
    {
      title: 'Player Insights',
      description: 'Deep dive into batsman and bowler performance metrics',
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: 'Season Trends',
      description: 'Track performance trends and patterns over time',
      icon: TrendingUp,
      color: 'text-red-600'
    }
  ];

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
          IPL Analytics Overview
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Comprehensive cricket analytics powered by machine learning clustering algorithms
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              className={`${stat.bgColor} rounded-xl p-6 border border-white/50`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </div>
              </div>
              <h3 className={`font-semibold ${stat.textColor}`}>
                {stat.title}
              </h3>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              className="card card-hover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg bg-slate-100`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-slate-800">
                  {feature.title}
                </h3>
              </div>
              <p className="text-slate-600 text-sm">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* AI Clustering Highlight */}
      <motion.div 
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            🤖 AI-Powered Clustering Analysis
          </h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Our advanced machine learning algorithms use K-means and Agglomerative clustering 
            to identify hidden patterns in player performance and team strategies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Player Clustering</h4>
              <p className="text-sm text-indigo-100">
                Groups batsmen by playing style: Power Hitters, Consistent Players, Aggressive Batsmen, Anchor Players
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Team Clustering</h4>
              <p className="text-sm text-indigo-100">
                Categorizes teams: Balanced Teams, Batting Heavy, Bowling Heavy based on performance metrics
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsOverview;
