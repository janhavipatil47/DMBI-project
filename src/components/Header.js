import React from 'react';
import { motion } from 'framer-motion';
import { Cricket, Sparkles, Brain } from 'lucide-react';

const Header = () => {
  return (
    <motion.header 
      className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <Cricket className="w-10 h-10 text-cricket-600" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </motion.div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                IPL Analytics Dashboard
              </h1>
              <p className="text-sm text-slate-600">
                Advanced Cricket Analytics with AI Clustering
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            className="hidden md:flex items-center gap-2 text-sm text-slate-600"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Brain className="w-4 h-4 text-indigo-500" />
            <span>ML-Powered Insights</span>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
