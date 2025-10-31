import React from 'react';
import { motion } from 'framer-motion';
import { Cricket, Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mx-auto mb-6"
        >
          <Cricket className="w-16 h-16 text-cricket-600" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gradient mb-2">
          Loading IPL Analytics
        </h2>
        
        <p className="text-slate-600 mb-6">
          Preparing your cricket insights with AI clustering...
        </p>
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-primary-600 mx-auto" />
        </motion.div>
        
        <motion.div 
          className="mt-4 text-sm text-slate-500"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Analyzing match data and player performance...
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
