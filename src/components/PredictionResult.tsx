import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { PredictionResultType } from '../types';

interface PredictionResultProps {
  result: PredictionResultType | null;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(value);
};

const calculatePercentage = (value: number, min: number, max: number): number => {
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
};

const PredictionResult: React.FC<PredictionResultProps> = ({ result }) => {
  if (!result) return null;

  const { model, year, future_year, lower_bound, upper_bound } = result;
  const average = Math.round((lower_bound + upper_bound) / 2);
  
  return (
    <motion.div
      className="glass-card p-6 md:p-8 max-w-4xl mx-auto mt-8 card-glow"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl md:text-2xl font-racing flex items-center">
          <TrendingUp className="mr-2 text-racing-red-500" />
          <span>PREDICTED <span className="text-racing-red-500">VALUE</span></span>
        </h3>
        <div className="text-sm px-3 py-1 bg-racing-red-900/30 text-racing-red-100 rounded-full">
          {future_year} Projection
        </div>
      </div>

      <div>
        <div className="bg-result-gradient p-6 rounded-lg">
          <div className="text-dark-300 text-sm mb-1">Toyota {model}</div>
          <div className="text-2xl md:text-3xl font-racing mb-4 text-white">
            {formatCurrency(average)}
          </div>
          <div className="text-xs text-dark-400 mb-4">
            {year} model • Projected value in {future_year}
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-dark-300">Price Range</span>
              <span className="text-white">
                {formatCurrency(lower_bound)} - {formatCurrency(upper_bound)}
              </span>
            </div>
            
            <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 flex">
                  <motion.div
                    className="h-full bg-racing-red-800"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.8 }}
                  ></motion.div>
                </div>
                <motion.div
                  className="absolute top-0 bottom-0 w-2 bg-racing-red-500 rounded-full"
                  initial={{ left: '50%' }}
                  animate={{ left: `${calculatePercentage(average, lower_bound, upper_bound)}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                ></motion.div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm flex items-start space-x-2 text-dark-300">
          <AlertCircle className="w-4 h-4 mt-0.5 text-racing-red-500 flex-shrink-0" />
          <p>
            Prediction based on current market trends, vehicle condition, and historical data. 
            Actual market value may vary.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PredictionResult;