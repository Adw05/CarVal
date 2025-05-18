import React from 'react';
import { Gauge, Car } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <motion.header 
      className="py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-30 bg-dark-900/80 backdrop-blur-md border-b border-dark-800"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-2">
        <Car className="h-8 w-8 text-racing-red-500" strokeWidth={2} />
        <div>
          <h1 className="text-xl md:text-2xl font-racing text-white">
            CAR<span className="text-racing-red-500">VALUE</span>PRO
          </h1>
          <p className="text-xs text-dark-400">Price Prediction</p>
        </div>
      </div>
      
      <motion.div 
        className="flex items-center space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Gauge className="h-5 w-5 text-racing-red-500" />
        <span className="text-sm md:text-base font-racing tracking-wider">
          MARKET <span className="text-racing-red-500">PULSE</span>
        </span>
      </motion.div>
    </motion.header>
  );
};

export default Header;