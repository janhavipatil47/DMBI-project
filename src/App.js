import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Target, 
  Zap,
  Trophy,
  Activity,
  Brain,
  Database
} from 'lucide-react';

// Import components
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import TeamPerformance from './components/TeamPerformance';
import VenueAnalysis from './components/VenueAnalysis';
import PlayerStats from './components/PlayerStats';
import SeasonTrends from './components/SeasonTrends';
import ClusteringAnalysis from './components/ClusteringAnalysis';
import MatchDetails from './components/MatchDetails';
import LoadingSpinner from './components/LoadingSpinner';

const App = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Database, color: 'text-blue-600' },
    { id: 'teams', label: 'Team Performance', icon: Users, color: 'text-green-600' },
    { id: 'venues', label: 'Venue Analysis', icon: Target, color: 'text-purple-600' },
    { id: 'players', label: 'Player Stats', icon: Trophy, color: 'text-yellow-600' },
    { id: 'trends', label: 'Season Trends', icon: TrendingUp, color: 'text-red-600' },
    { id: 'clustering', label: 'AI Clustering', icon: Brain, color: 'text-indigo-600' },
    { id: 'details', label: 'Match Details', icon: Activity, color: 'text-pink-600' }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <StatsOverview />;
      case 'teams':
        return <TeamPerformance />;
      case 'venues':
        return <VenueAnalysis />;
      case 'players':
        return <PlayerStats />;
      case 'trends':
        return <SeasonTrends />;
      case 'clustering':
        return <ClusteringAnalysis />;
      case 'details':
        return <MatchDetails />;
      default:
        return <StatsOverview />;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 mb-8 p-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200
                    ${activeTab === tab.id 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-white/20 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-600">
            <p className="text-sm">
              IPL Analytics Dashboard • Powered by Machine Learning Clustering
            </p>
            <p className="text-xs mt-2 text-slate-500">
              Built with React, Flask, and Advanced Analytics
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
