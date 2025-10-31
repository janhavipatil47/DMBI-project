import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, TrendingUp, Users, Target } from 'lucide-react';
import axios from 'axios';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

const TeamPerformance = () => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState('all');

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data/team-performance');
        setTeamData(response.data);
      } catch (error) {
        console.error('Error fetching team data:', error);
        // Mock data for demo
        setTeamData({
          wins_by_season: [
            { season: '2008', team: 'Rajasthan Royals', wins: 11 },
            { season: '2009', team: 'Deccan Chargers', wins: 9 },
            { season: '2010', team: 'Chennai Super Kings', wins: 9 },
          ],
          team_stats: [
            { team: 'Mumbai Indians', season: '2020', total_matches: 16, wins: 11, win_percentage: 68.75 },
            { team: 'Chennai Super Kings', season: '2020', total_matches: 14, wins: 6, win_percentage: 42.86 },
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Process data for charts
  const processWinsData = () => {
    if (!teamData?.wins_by_season) return [];
    
    const seasonWins = {};
    teamData.wins_by_season.forEach(item => {
      if (!seasonWins[item.season]) {
        seasonWins[item.season] = {};
      }
      seasonWins[item.season][item.team] = item.wins;
    });
    
    return Object.keys(seasonWins).map(season => ({
      season,
      ...seasonWins[season]
    }));
  };

  const processWinPercentageData = () => {
    if (!teamData?.team_stats) return [];
    
    const teamAvg = {};
    teamData.team_stats.forEach(stat => {
      if (!teamAvg[stat.team]) {
        teamAvg[stat.team] = { total: 0, count: 0 };
      }
      teamAvg[stat.team].total += stat.win_percentage;
      teamAvg[stat.team].count += 1;
    });
    
    return Object.keys(teamAvg).map(team => ({
      team: team.replace(/\s+/g, ' '),
      winPercentage: Math.round(teamAvg[team].total / teamAvg[team].count * 100) / 100
    })).sort((a, b) => b.winPercentage - a.winPercentage).slice(0, 10);
  };

  const winsData = processWinsData();
  const winPercentageData = processWinPercentageData();

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
          Team Performance Analysis
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Comprehensive team statistics and performance metrics across IPL seasons
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
            <Trophy className="w-8 h-8 text-yellow-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">{teamData?.team_stats?.length || 0}</div>
              <div className="text-sm opacity-90">Teams Analyzed</div>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <TrendingUp className="w-8 h-8 text-green-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {Math.max(...(teamData?.team_stats?.map(t => t.win_percentage) || [0])).toFixed(1)}%
              </div>
              <div className="text-sm opacity-90">Highest Win Rate</div>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Users className="w-8 h-8 text-blue-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {Math.round(teamData?.team_stats?.reduce((acc, t) => acc + t.total_matches, 0) / (teamData?.team_stats?.length || 1))}
              </div>
              <div className="text-sm opacity-90">Avg Matches</div>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Target className="w-8 h-8 text-red-300" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {Math.round(teamData?.team_stats?.reduce((acc, t) => acc + t.wins, 0) / (teamData?.team_stats?.length || 1))}
              </div>
              <div className="text-sm opacity-90">Avg Wins</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Wins by Season - Bar Chart */}
        <motion.div 
          className="chart-container"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Team Wins by Season
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={winsData.slice(-5)}>
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
              {Object.keys(winsData[0] || {}).filter(key => key !== 'season').slice(0, 6).map((team, index) => (
                <Bar 
                  key={team} 
                  dataKey={team} 
                  fill={COLORS[index % COLORS.length]}
                  name={team}
                  radius={[2, 2, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Win Percentage - Pie Chart */}
        <motion.div 
          className="chart-container"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Top Teams Win Percentage
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={winPercentageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ team, winPercentage }) => `${team.split(' ')[0]} ${winPercentage.toFixed(1)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="winPercentage"
              >
                {winPercentageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value.toFixed(1)}%`, 'Win Rate']}
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

      {/* Team Performance Table */}
      <motion.div 
        className="chart-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Detailed Team Statistics
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Team</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Season</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Matches</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Wins</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {teamData?.team_stats?.slice(0, 15).map((team, index) => (
                <motion.tr 
                  key={`${team.team}-${team.season}`}
                  className="border-b border-slate-100 hover:bg-slate-50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {team.team}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {team.season}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {team.total_matches}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {team.wins}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                          style={{ width: `${Math.min(team.win_percentage, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {team.win_percentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default TeamPerformance;



